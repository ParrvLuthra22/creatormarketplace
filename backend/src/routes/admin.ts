import { Router, Response } from 'express';
import type { Server } from 'socket.io';
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
import { createNotification } from '../services/notificationCenter';

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
            dailySignupsAgg,
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
            User.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
        ]);

        // Fill in zero-count days so the line chart has a continuous 30-day series.
        const dailySignupsMap = new Map(dailySignupsAgg.map((d: any) => [d._id, d.count]));
        const dailySignups = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
            const key = date.toISOString().slice(0, 10);
            return { date: key, count: dailySignupsMap.get(key) || 0 };
        });

        res.status(200).json({
            success: true,
            users: {
                total: totalUsers,
                brands: brandUsers,
                creators: creatorUsers,
                newSignups7d,
                newSignups30d,
                activeUsers7d,
                dailySignups,
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

        if (req.query.verificationStatus && ['unverified', 'pending', 'verified', 'rejected'].includes(req.query.verificationStatus as string)) {
            query.verificationStatus = req.query.verificationStatus;
        } else if (req.query.verified === 'true') {
            query.verificationStatus = 'verified';
        } else if (req.query.verified === 'false') {
            query.verificationStatus = { $ne: 'verified' };
        }

        if (req.query.suspended === 'true') {
            query.suspended = true;
        } else if (req.query.suspended === 'false') {
            query.suspended = { $ne: true };
        }

        if (req.query.plan && ['free', 'basic', 'pro'].includes(req.query.plan as string)) {
            query.plan = req.query.plan;
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
        const [profile, recentProposals, recentMessages, proposalCounts, messageCount, verificationRequests] = await Promise.all([
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
            VerificationRequest.find({ userId }).sort({ createdAt: -1 }).lean(),
        ]);

        res.status(200).json({
            success: true,
            user,
            profile,
            verificationRequests,
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
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { suspended: true, suspendedAt: new Date() } },
            { new: true }
        ).select('-password -emailVerificationToken -passwordResetToken');

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
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { suspended: false }, $unset: { suspendedAt: '' } },
            { new: true }
        ).select('-password -emailVerificationToken -passwordResetToken');

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

// DELETE /api/admin/users/:id - Permanently delete a user and their profile
// (same cascade as the user's own self-delete in /api/auth/account)
router.delete('/users/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user._id.toString() === req.userId) {
            res.status(400).json({ error: 'Use the account settings page to delete your own account' });
            return;
        }

        if (user.accountType === 'Brand') {
            await BrandProfile.deleteOne({ userId: user._id });
        } else if (user.accountType === 'Creator') {
            await CreatorProfile.deleteOne({ userId: user._id });
        }

        await User.deleteOne({ _id: user._id });

        trackEvent(req.userId as string, 'admin_user_deleted', {
            deletedUserId: user._id.toString(),
            accountType: user.accountType,
        });

        res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Admin delete user error:', error);
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

        const io = req.app.get('io') as Server | undefined;
        await createNotification(io, {
            userId: user._id.toString(),
            type: 'verification_approved',
            actorId: req.userId,
            entityId: verificationRequest._id.toString(),
            entityType: 'VerificationRequest',
            message: `Your verification was approved — you're now ${badge}`,
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

        const io = req.app.get('io') as Server | undefined;
        await createNotification(io, {
            userId: user._id.toString(),
            type: 'verification_rejected',
            actorId: req.userId,
            entityId: verificationRequest._id.toString(),
            entityType: 'VerificationRequest',
            message: `Your verification request was declined: ${reason}`,
        });

        res.status(200).json({ success: true, verificationRequest, user });
    } catch (error: any) {
        console.error('Admin reject verification error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

interface AdminActivityItem {
    id: string;
    type: 'signup' | 'verification_approved' | 'verification_rejected' | 'suspended';
    text: string;
    timestamp: string;
    href?: string;
}

// GET /api/admin/activity - Last 10 admin-relevant events (signups, verification
// decisions, suspensions), aggregated from existing collections — no dedicated log exists.
router.get('/activity', async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const [recentSignups, reviewedRequests, recentSuspensions] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(10).select('fullName accountType createdAt').lean(),
            VerificationRequest.find({ status: { $in: ['approved', 'rejected'] } })
                .sort({ reviewedAt: -1 })
                .limit(10)
                .populate('userId', 'fullName')
                .lean(),
            User.find({ suspended: true, suspendedAt: { $exists: true } })
                .sort({ suspendedAt: -1 })
                .limit(10)
                .select('fullName suspendedAt')
                .lean(),
        ]);

        const items: AdminActivityItem[] = [];

        recentSignups.forEach((u: any) => {
            items.push({
                id: `signup-${u._id}`,
                type: 'signup',
                text: `${u.fullName} signed up as a ${u.accountType}`,
                timestamp: u.createdAt,
                href: `/dashboard/admin/users/${u._id}`,
            });
        });

        reviewedRequests.forEach((r: any) => {
            const name = r.userId?.fullName || 'A creator';
            items.push({
                id: `verification-${r._id}`,
                type: r.status === 'approved' ? 'verification_approved' : 'verification_rejected',
                text: r.status === 'approved' ? `${name}'s verification was approved` : `${name}'s verification was rejected`,
                timestamp: r.reviewedAt,
                href: r.userId?._id ? `/dashboard/admin/users/${r.userId._id}` : undefined,
            });
        });

        recentSuspensions.forEach((u: any) => {
            items.push({
                id: `suspend-${u._id}`,
                type: 'suspended',
                text: `${u.fullName} was suspended`,
                timestamp: u.suspendedAt,
                href: `/dashboard/admin/users/${u._id}`,
            });
        });

        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        res.status(200).json({ success: true, activity: items.slice(0, 10) });
    } catch (error: any) {
        console.error('Admin activity error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
