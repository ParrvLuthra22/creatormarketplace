import { Router, Response } from 'express';
import type { Server } from 'socket.io';
import mongoose from 'mongoose';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { createProposalLimiter } from '../middleware/rateLimiter';
import Proposal from '../models/Proposal';
import User from '../models/User';
import BrandProfile from '../models/BrandProfile';
import CreatorProfile from '../models/CreatorProfile';
import Payment from '../models/Payment';
import { trackEvent } from '../config/posthog';
import { sendEmail } from '../config/email';
import { proposalReceivedEmail, proposalAcceptedEmail, proposalDeclinedEmail } from '../utils/emailTemplates';
import { createNotification } from '../services/notificationCenter';

const router = Router();

const idToString = (value: any): string | undefined => value?._id?.toString?.() || value?.toString?.();
const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:3000';

async function sendProposalEmail(
    req: AuthRequest,
    input: { proposalId: string; type: 'received' | 'accepted' | 'declined'; to: string; html: string; subject: string }
) {
    try {
        await sendEmail({ to: input.to, subject: input.subject, html: input.html });
        trackEvent(req.userId as string, 'proposal_email_sent', {
            type: input.type,
            proposalId: input.proposalId,
        });
    } catch (error) {
        // Never fail the request over an email delivery hiccup.
        console.error(`Proposal ${input.type} email failed:`, error);
    }
}

// GET /api/proposals/summary - Summary counts for sidebar badges
router.get('/summary', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('accountType');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const query = user.accountType === 'Brand'
            ? { brandId: userId, status: 'pending' }
            : { creatorId: userId, status: 'pending' };

        const pendingProposals = await Proposal.countDocuments(query);

        res.status(200).json({
            success: true,
            pendingProposals,
        });
    } catch (error: any) {
        console.error('Get proposals summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/proposals/dashboard-summary - Numbers used on the dashboard stat cards
router.get('/dashboard-summary', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('accountType');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Brand') {
            res.status(403).json({ error: 'Only brands can access brand dashboard summary' });
            return;
        }

        const pendingProposals = await Proposal.countDocuments({ brandId: userId, status: 'pending' });

        const acceptedCreatorIds = await Proposal.distinct('creatorId', {
            brandId: userId,
            status: 'accepted',
        });
        const creatorsHired = acceptedCreatorIds.length;

        const spendAgg = await Payment.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    status: 'captured',
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                },
            },
        ]);

        const totalSpend = spendAgg?.[0]?.total ?? 0;

        res.status(200).json({
            success: true,
            totalSpend,
            creatorsHired,
            pendingProposals,
        });
    } catch (error: any) {
        console.error('Get dashboard summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/proposals - Create a proposal (Brand only)
router.post('/', authMiddleware, createProposalLimiter, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const brandId = req.userId;

        // Verify the user is a brand
        const brandUser = await User.findById(brandId);
        if (!brandUser || brandUser.accountType !== 'Brand') {
            res.status(403).json({ error: 'Only brands can send proposals' });
            return;
        }

        const { creatorId, title, description, budget, deliverables, deadline } = req.body;

        if (!creatorId || !title || !description || !budget || !deliverables || !deadline) {
            res.status(400).json({ error: 'All fields are required: creatorId, title, description, budget, deliverables, deadline' });
            return;
        }

        // Verify the creator exists
        const creatorUser = await User.findById(creatorId);
        if (!creatorUser || creatorUser.accountType !== 'Creator') {
            res.status(404).json({ error: 'Creator not found' });
            return;
        }

        const proposal = await Proposal.create({
            brandId,
            creatorId,
            title,
            description,
            budget: Number(budget),
            deliverables,
            deadline: new Date(deadline),
        });

        await proposal.populate('brandId', 'fullName email');
        await proposal.populate('creatorId', 'fullName email');

        trackEvent(brandId, 'proposal_created', {
            proposalId: proposal._id.toString(),
            creatorId,
            budget: proposal.budget,
            title: proposal.title,
        });

        const proposalsUrl = `${frontendUrl()}/dashboard/creator/proposals`;
        void sendProposalEmail(req, {
            proposalId: proposal._id.toString(),
            type: 'received',
            to: creatorUser.email,
            subject: 'New collaboration proposal',
            html: proposalReceivedEmail(creatorUser.fullName, brandUser.fullName, proposal.title, proposalsUrl),
        });

        const io = req.app.get('io') as Server | undefined;
        await createNotification(io, {
            userId: creatorId,
            type: 'proposal_created',
            actorId: brandId,
            entityId: proposal._id.toString(),
            entityType: 'Proposal',
            message: `${brandUser.fullName} sent you a proposal: "${proposal.title}"`,
        });

        res.status(201).json({ success: true, proposal });
    } catch (error: any) {
        console.error('Create proposal error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/proposals - List proposals for the current user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        let query: any = {};
        if (user.accountType === 'Brand') {
            query = { brandId: userId };
        } else {
            query = { creatorId: userId };
        }

        // Optional status filter
        const { status } = req.query;
        if (status && ['pending', 'accepted', 'declined'].includes(status as string)) {
            query.status = status;
        }

        const proposals = await Proposal.find(query)
            .populate('brandId', 'fullName email')
            .populate('creatorId', 'fullName email')
            .sort({ createdAt: -1 })
            .lean();

        // Attach brand profile display fields (companyName/logo) for better UI rendering
        const brandIds = Array.from(
            new Set(
                proposals
                    .map((p: any) => (p.brandId && typeof p.brandId === 'object' ? p.brandId._id?.toString?.() : null))
                    .filter(Boolean)
            )
        );

        const brandProfiles = await BrandProfile.find({ userId: { $in: brandIds } })
            .select('userId companyName logoUrl')
            .lean();

        const brandProfileByUserId = new Map<string, any>(
            brandProfiles.map((bp: any) => [bp.userId.toString(), bp])
        );

        // Also fetch creator profiles to supply their profile photo
        const creatorIds = Array.from(
            new Set(
                proposals
                    .map((p: any) => (p.creatorId && typeof p.creatorId === 'object' ? p.creatorId._id?.toString?.() : null))
                    .filter(Boolean)
            )
        );

        const creatorProfiles = await CreatorProfile.find({ userId: { $in: creatorIds } })
            .select('userId profilePhoto niches combinedFollowerCount engagement')
            .lean();

        const creatorProfileByUserId = new Map<string, any>(
            creatorProfiles.map((cp: any) => [cp.userId.toString(), cp])
        );

        const enrichedProposals = proposals.map((p: any) => {
            const brandUserId = p.brandId && typeof p.brandId === 'object' ? p.brandId._id?.toString?.() : undefined;
            const brandProfile = brandUserId ? brandProfileByUserId.get(brandUserId) : undefined;

            const creatorUserId = p.creatorId && typeof p.creatorId === 'object' ? p.creatorId._id?.toString?.() : undefined;
            const creatorProfile = creatorUserId ? creatorProfileByUserId.get(creatorUserId) : undefined;

            return {
                ...p,
                brandProfile: brandProfile
                    ? {
                        companyName: brandProfile.companyName,
                        logoUrl: brandProfile.logoUrl,
                    }
                    : null,
                creatorProfile: creatorProfile
                    ? {
                        profilePhoto: creatorProfile.profilePhoto,
                        niches: creatorProfile.niches,
                        combinedFollowerCount: creatorProfile.combinedFollowerCount,
                        engagement: creatorProfile.engagement,
                    }
                    : null,
            };
        });

        res.status(200).json({ success: true, proposals: enrichedProposals });
    } catch (error: any) {
        console.error('Get proposals error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/proposals/:id - Get a single proposal
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const proposal = await Proposal.findById(id)
            .populate('brandId', 'fullName email')
            .populate('creatorId', 'fullName email');

        if (!proposal) {
            res.status(404).json({ error: 'Proposal not found' });
            return;
        }

        // Verify user is a participant
        if (proposal.brandId._id.toString() !== userId && proposal.creatorId._id.toString() !== userId) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        res.status(200).json({ success: true, proposal });
    } catch (error: any) {
        console.error('Get proposal error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/proposals/:id/accept - Accept a proposal (Creator only)
router.put('/:id/accept', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const proposal = await Proposal.findById(id);
        if (!proposal) {
            res.status(404).json({ error: 'Proposal not found' });
            return;
        }

        if (proposal.creatorId.toString() !== userId) {
            res.status(403).json({ error: 'Only the creator can accept this proposal' });
            return;
        }

        if (proposal.status !== 'pending') {
            res.status(400).json({ error: `Proposal is already ${proposal.status}` });
            return;
        }

        proposal.status = 'accepted';
        proposal.dealStage = 'content_creation';
        await proposal.save();

        await proposal.populate('brandId', 'fullName email');
        await proposal.populate('creatorId', 'fullName email');

        const brandIdStr = idToString(proposal.brandId) as string;
        const creatorIdStr = idToString(proposal.creatorId) as string;

        trackEvent(userId, 'proposal_accepted', {
            proposalId: proposal._id.toString(),
            brandId: brandIdStr,
            creatorId: creatorIdStr,
            budget: proposal.budget,
            title: proposal.title,
        });

        // Track this as a hired creator on the brand's profile.
        await BrandProfile.findOneAndUpdate(
            { userId: brandIdStr },
            { $addToSet: { creatorsHired: creatorIdStr } },
            { upsert: true }
        );

        const brandUser = proposal.brandId as any;
        const creatorUser = proposal.creatorId as any;
        const campaignsUrl = `${frontendUrl()}/dashboard/brand/campaigns`;
        void sendProposalEmail(req, {
            proposalId: proposal._id.toString(),
            type: 'accepted',
            to: brandUser.email,
            subject: 'Proposal accepted',
            html: proposalAcceptedEmail(brandUser.fullName, creatorUser.fullName, proposal.title, campaignsUrl),
        });

        const io = req.app.get('io') as Server | undefined;
        await createNotification(io, {
            userId: brandIdStr,
            type: 'proposal_accepted',
            actorId: creatorIdStr,
            entityId: proposal._id.toString(),
            entityType: 'Proposal',
            message: `${creatorUser.fullName} accepted your proposal: "${proposal.title}"`,
        });

        res.status(200).json({ success: true, proposal });
    } catch (error: any) {
        console.error('Accept proposal error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/proposals/:id/decline - Decline a proposal (Creator only)
router.put('/:id/decline', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const proposal = await Proposal.findById(id);
        if (!proposal) {
            res.status(404).json({ error: 'Proposal not found' });
            return;
        }

        if (proposal.creatorId.toString() !== userId) {
            res.status(403).json({ error: 'Only the creator can decline this proposal' });
            return;
        }

        if (proposal.status !== 'pending') {
            res.status(400).json({ error: `Proposal is already ${proposal.status}` });
            return;
        }

        proposal.status = 'declined';
        await proposal.save();

        await proposal.populate('brandId', 'fullName email');
        await proposal.populate('creatorId', 'fullName email');

        const brandIdStr = idToString(proposal.brandId) as string;
        const creatorIdStr = idToString(proposal.creatorId) as string;

        trackEvent(userId, 'proposal_declined', {
            proposalId: proposal._id.toString(),
            brandId: brandIdStr,
            creatorId: creatorIdStr,
            budget: proposal.budget,
            title: proposal.title,
        });

        const brandUser = proposal.brandId as any;
        const creatorUser = proposal.creatorId as any;
        const campaignsUrl = `${frontendUrl()}/dashboard/brand/campaigns`;
        void sendProposalEmail(req, {
            proposalId: proposal._id.toString(),
            type: 'declined',
            to: brandUser.email,
            subject: 'Proposal declined',
            html: proposalDeclinedEmail(brandUser.fullName, creatorUser.fullName, proposal.title, campaignsUrl),
        });

        const io = req.app.get('io') as Server | undefined;
        await createNotification(io, {
            userId: brandIdStr,
            type: 'proposal_declined',
            actorId: creatorIdStr,
            entityId: proposal._id.toString(),
            entityType: 'Proposal',
            message: `${creatorUser.fullName} declined your proposal: "${proposal.title}"`,
        });

        res.status(200).json({ success: true, proposal });
    } catch (error: any) {
        console.error('Decline proposal error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const DEAL_STAGES = ['brief', 'content_creation', 'review', 'approved', 'posted', 'paid'] as const;

// PUT /api/proposals/:id/stage - Advance an accepted deal's stage (Creator only, self-reported)
router.put('/:id/stage', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { stage } = req.body;
        const userId = req.userId;

        if (!DEAL_STAGES.includes(stage)) {
            res.status(400).json({ error: `stage must be one of: ${DEAL_STAGES.join(', ')}` });
            return;
        }

        const proposal = await Proposal.findById(id);
        if (!proposal) {
            res.status(404).json({ error: 'Proposal not found' });
            return;
        }

        if (proposal.creatorId.toString() !== userId) {
            res.status(403).json({ error: 'Only the creator can update this deal\'s stage' });
            return;
        }

        if (proposal.status !== 'accepted') {
            res.status(400).json({ error: 'Only accepted deals have a stage' });
            return;
        }

        const currentIndex = DEAL_STAGES.indexOf(proposal.dealStage);
        const nextIndex = DEAL_STAGES.indexOf(stage);
        if (nextIndex < currentIndex) {
            res.status(400).json({ error: 'Cannot move a deal stage backward' });
            return;
        }

        proposal.dealStage = stage;
        await proposal.save();
        await proposal.populate('brandId', 'fullName email');
        await proposal.populate('creatorId', 'fullName email');

        res.status(200).json({ success: true, proposal });
    } catch (error: any) {
        console.error('Update deal stage error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/proposals/:id/deliverables - Toggle one deliverable line as complete/incomplete (Creator only)
router.put('/:id/deliverables', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { item, completed } = req.body;
        const userId = req.userId;

        if (typeof item !== 'string' || !item.trim()) {
            res.status(400).json({ error: 'item is required' });
            return;
        }

        const proposal = await Proposal.findById(id);
        if (!proposal) {
            res.status(404).json({ error: 'Proposal not found' });
            return;
        }

        if (proposal.creatorId.toString() !== userId) {
            res.status(403).json({ error: 'Only the creator can update deliverables' });
            return;
        }

        const set = new Set(proposal.completedDeliverables);
        if (completed) set.add(item);
        else set.delete(item);
        proposal.completedDeliverables = Array.from(set);
        await proposal.save();

        res.status(200).json({ success: true, completedDeliverables: proposal.completedDeliverables });
    } catch (error: any) {
        console.error('Update deliverables error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
