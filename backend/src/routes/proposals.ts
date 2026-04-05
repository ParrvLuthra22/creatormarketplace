import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Proposal from '../models/Proposal';
import User from '../models/User';
import BrandProfile from '../models/BrandProfile';
import CreatorProfile from '../models/CreatorProfile';
import Payment from '../models/Payment';

const router = Router();

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
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
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
            .select('userId profilePhoto')
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
        await proposal.save();

        await proposal.populate('brandId', 'fullName email');
        await proposal.populate('creatorId', 'fullName email');

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

        res.status(200).json({ success: true, proposal });
    } catch (error: any) {
        console.error('Decline proposal error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
