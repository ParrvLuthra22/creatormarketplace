import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { adminMiddleware } from '../middleware/adminAuth';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import BrandProfile from '../models/BrandProfile';
import CreatorProfile from '../models/CreatorProfile';
import Proposal from '../models/Proposal';
import Message from '../models/Message';
import VerificationRequest from '../models/VerificationRequest';
import { sendEmail } from '../config/email';
import { verificationApprovedEmail, verificationRejectedEmail } from '../utils/emailTemplates';
import { trackEvent } from '../config/posthog';

const router = Router();
router.use(adminMiddleware);

const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:3000';
const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

async function getProfileForUser(user: any) {
    if (user.accountType === 'Brand') {
        return BrandProfile.findOne({ userId: user._id }).lean();
    }
    return CreatorProfile.findOne({ userId: user._id }).lean();
}

async function attachProfiles(users: any[]) {
    const brandIds = users.filter(user => user.accountType === 'Brand').map(user => user._id);
    const creatorIds = users.filter(user => user.accountType === 'Creator').map(user => user._id);

    const [brandProfiles, creatorProfiles] = await Promise.all([
        BrandProfile.find({ userId: { $in: brandIds } }).lean(),
        CreatorProfile.find({ userId: { $in: creatorIds } }).lean(),
    ]);

    const brandMap = new Map(brandProfiles.map(profile => [profile.userId.toString(), profile]));
    const creatorMap = new Map(creatorProfiles.map(profile => [profile.userId.toString(), profile]));

    return users.map(user => ({
        ...user,
        profile: user.accountType === 'Brand'
            ? brandMap.get(user._id.toString()) || null
            : creatorMap.get(user._id.toString()) || null,
    }));
}

router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            brandUsers,
            creatorUsers,
            newSignups7d,
            newSignups30d,
            activeUsers7d,
            pendingVerificationRequests,
            totalProposals,
            pendingProposals,
            acceptedProposals,
            declinedProposals,
            totalMessagesSent,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ accountType: 'Brand' }),
            User.countDocuments({ accountType: 'Creator' }),
            User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
            User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            User.countDocuments({ lastLoginAt: { $gte: sevenDaysAgo } }),
            VerificationRequest.countDocuments({ status: 'pending' }),
            Proposal.countDocuments(),
            Proposal.countDocuments({ status: 'pending' }),
            Proposal.countDocuments({ status: 'accepted' }),
            Proposal.countDocuments({ status: 'declined' }),
            Message.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            users: {
                total: totalUsers,
                brands: brandUsers,
                creators: creatorUsers,
                newSignups7d,
                newSignups30d,
                activeUsers7d,
            },
            verification: {
                pendingRequests: pendingVerificationRequests,
            },
            proposals: {
                total: totalProposals,
                pending: pendingProposals,
                accepted: acceptedProposals,
                declined: declinedProposals,
            },
            messages: {
                totalSent: totalMessagesSent,
            },
        });
    } catch (error: any) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const query: Record<string, any> = {};

        if (req.query.role && ['Brand', 'Creator'].includes(req.query.role as string)) {
            query.accountType = req.query.role;
        }

        if (req.query.verified === 'true') {
            query.verificationStatus = 'verified';
        } else if (req.query.verified === 'false') {
            query.verificationStatus = { $ne: 'verified' };
        }

        if (req.query.search) {
            const search = String(req.query.search).trim();
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password -emailVerificationToken -passwordResetToken')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            users: await attachProfiles(users),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Admin users list error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/users/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -emailVerificationToken -passwordResetToken')
            .lean();

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userId = toObjectId(req.params.id);
        const [profile, recentProposals, recentMessages, proposalCounts, messageCount] = await Promise.all([
            getProfileForUser(user),
            Proposal.find({ $or: [{ brandId: userId }, { creatorId: userId }] })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
            Message.find({ senderId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
            Proposal.aggregate([
                { $match: { $or: [{ brandId: userId }, { creatorId: userId }] } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            Message.countDocuments({ senderId: userId }),
        ]);

        res.status(200).json({
            success: true,
            user,
            profile,
            activity: {
                proposalsByStatus: proposalCounts,
                messagesSent: messageCount,
                recentProposals,
                recentMessages,
            },
        });
    } catch (error: any) {
        console.error('Admin user detail error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/users/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const allowedFields = ['verificationBadge', 'isAdmin', 'plan'] as const;
        const update: Record<string, any> = {};

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                update[field] = req.body[field];
            }
        }

        if (update.verificationBadge && !['none', 'verified', 'premium'].includes(update.verificationBadge)) {
            res.status(400).json({ error: 'Invalid verificationBadge' });
            return;
        }

        if (update.plan && !['free', 'basic', 'pro'].includes(update.plan)) {
            res.status(400).json({ error: 'Invalid plan' });
            return;
        }

        const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
            .select('-password -emailVerificationToken -passwordResetToken');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, user });
    } catch (error: any) {
        console.error('Admin update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/users/:id/suspend', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { $set: { suspended: true } }, { new: true })
            .select('-password -emailVerificationToken -passwordResetToken');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, user });
    } catch (error: any) {
        console.error('Admin suspend user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/users/:id/unsuspend', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { $set: { suspended: false } }, { new: true })
            .select('-password -emailVerificationToken -passwordResetToken');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, user });
    } catch (error: any) {
        console.error('Admin unsuspend user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/verification-requests', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const query: Record<string, any> = {};

        if (req.query.status && ['pending', 'approved', 'rejected'].includes(req.query.status as string)) {
            query.status = req.query.status;
        } else {
            query.status = 'pending';
        }

        const [requests, total] = await Promise.all([
            VerificationRequest.find(query)
                .populate('userId', 'fullName email accountType verificationStatus verificationBadge')
                .populate('reviewedBy', 'fullName email')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            VerificationRequest.countDocuments(query),
        ]);

        const users = requests
            .map(request => request.userId)
            .filter((user): user is any => Boolean(user && typeof user === 'object'));

        const usersWithProfiles = await attachProfiles(users);
        const profileByUserId = new Map(usersWithProfiles.map(user => [user._id.toString(), user.profile]));

        res.status(200).json({
            success: true,
            requests: requests.map(request => {
                const user = request.userId as any;
                return {
                    ...request,
                    profile: user?._id ? profileByUserId.get(user._id.toString()) || null : null,
                };
            }),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Admin verification requests list error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/verification-requests/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const request = await VerificationRequest.findById(req.params.id)
            .populate('userId', 'fullName email accountType verificationStatus verificationBadge')
            .populate('reviewedBy', 'fullName email')
            .lean();

        if (!request) {
            res.status(404).json({ error: 'Verification request not found' });
            return;
        }

        const user = request.userId as any;
        const profile = user?._id ? await getProfileForUser(user) : null;

        res.status(200).json({ success: true, request: { ...request, profile } });
    } catch (error: any) {
        console.error('Admin verification request detail error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/verification-requests/:id/approve', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { badge, notes } = req.body;
        if (!['verified', 'premium'].includes(badge)) {
            res.status(400).json({ error: 'badge must be verified or premium' });
            return;
        }

        const verificationRequest = await VerificationRequest.findById(req.params.id);
        if (!verificationRequest) {
            res.status(404).json({ error: 'Verification request not found' });
            return;
        }

        const user = await User.findById(verificationRequest.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        verificationRequest.status = 'approved';
        verificationRequest.reviewedBy = req.user?._id;
        verificationRequest.reviewedAt = new Date();
        verificationRequest.notes = notes;
        await verificationRequest.save();

        user.verificationStatus = 'verified';
        user.verificationBadge = badge;
        user.verificationApprovedAt = new Date();
        user.verificationApprovedBy = req.user?._id;
        user.verificationRejectionReason = undefined;
        await user.save();

        try {
            await sendEmail({
                to: user.email,
                subject: 'Your CreatorLyff verification was approved',
                html: verificationApprovedEmail(user.fullName, `${frontendUrl()}/profile`),
            });
        } catch (emailError) {
            console.error('Verification approval email error:', emailError);
        }

        trackEvent(user._id.toString(), 'verification_approved', {
            requestId: verificationRequest._id.toString(),
            badge,
            reviewedBy: req.userId,
        });

        res.status(200).json({ success: true, verificationRequest, user });
    } catch (error: any) {
        console.error('Admin approve verification error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/verification-requests/:id/reject', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { reason, notes } = req.body;
        if (!reason) {
            res.status(400).json({ error: 'reason is required' });
            return;
        }

        const verificationRequest = await VerificationRequest.findById(req.params.id);
        if (!verificationRequest) {
            res.status(404).json({ error: 'Verification request not found' });
            return;
        }

        const user = await User.findById(verificationRequest.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        verificationRequest.status = 'rejected';
        verificationRequest.reviewedBy = req.user?._id;
        verificationRequest.reviewedAt = new Date();
        verificationRequest.rejectionReason = reason;
        verificationRequest.notes = notes;
        await verificationRequest.save();

        user.verificationStatus = 'rejected';
        user.verificationBadge = 'none';
        user.verificationRejectionReason = reason;
        await user.save();

        try {
            await sendEmail({
                to: user.email,
                subject: 'CreatorLyff verification update',
                html: verificationRejectedEmail(user.fullName, `${frontendUrl()}/profile`),
            });
        } catch (emailError) {
            console.error('Verification rejection email error:', emailError);
        }

        trackEvent(user._id.toString(), 'verification_rejected', {
            requestId: verificationRequest._id.toString(),
            reason,
            reviewedBy: req.userId,
        });

        res.status(200).json({ success: true, verificationRequest, user });
    } catch (error: any) {
        console.error('Admin reject verification error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
