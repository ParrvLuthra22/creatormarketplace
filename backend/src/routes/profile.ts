import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import BrandProfile from '../models/BrandProfile';
import CreatorProfile from '../models/CreatorProfile';
import User from '../models/User';
import Proposal from '../models/Proposal';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { optionalAuth, OptionalAuthRequest } from '../middleware/optionalAuth';
import { trackEvent } from '../config/posthog';
import { syncInstagramData } from '../services/instagramService';
import { syncYoutubeData } from '../services/youtubeService';
import { updateCombinedFollowerCount } from '../services/socialStats';

const router = Router();

const refreshStatsLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1,
    message: { error: 'Stats can only be refreshed once every 10 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => (req as AuthRequest).userId || 'anonymous',
});

// PUT /api/profile/creator - Creator updates own profile
router.put('/creator', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const user = await User.findById(req.userId).select('accountType');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Creator') {
            res.status(403).json({ error: 'Only creator accounts can update creator profiles' });
            return;
        }

        const allowedFields = [
            'bio',
            'instagramHandle',
            'profilePhoto',
            'coverImage',
            'niches',
            'followers',
            'engagement',
            'location',
            'availability',
            'pricing',
            'brandWork',
        ] as const;

        const update: Record<string, any> = {};
        for (const key of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                update[key] = (req.body as any)[key];
            }
        }

        const profile = await CreatorProfile.findOneAndUpdate(
            { userId: req.userId },
            { $set: update },
            { new: true, upsert: true }
        );

        trackEvent(req.userId, 'profile_updated', {
            profileType: 'creator',
            updatedFields: Object.keys(update),
        });

        res.status(200).json({ success: true, profile });
    } catch (error: any) {
        console.error('Update creator profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/creator/refresh-stats', authMiddleware, refreshStatsLimiter, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user || req.user.accountType !== 'Creator') {
            res.status(403).json({ error: 'Only creators can refresh creator stats' });
            return;
        }

        const results: Record<string, unknown> = {};
        const errors: Record<string, string> = {};

        if (req.user.instagramAccessToken) {
            try {
                results.instagram = await syncInstagramData(req.userId as string);
            } catch (error: any) {
                errors.instagram = error.message || 'Instagram sync failed';
            }
        }

        if (req.user.youtubeAccessToken || req.user.youtubeRefreshToken) {
            try {
                results.youtube = await syncYoutubeData(req.userId as string);
            } catch (error: any) {
                errors.youtube = error.message || 'YouTube sync failed';
            }
        }

        const profile = await updateCombinedFollowerCount(req.userId as string)
            || await CreatorProfile.findOne({ userId: req.userId });

        res.status(200).json({
            success: true,
            profile,
            results,
            errors,
        });
    } catch (error: any) {
        console.error('Refresh creator stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/profile/brand - Brand updates own profile
router.put('/brand', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const user = await User.findById(req.userId).select('accountType');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Brand') {
            res.status(403).json({ error: 'Only brand accounts can update brand profiles' });
            return;
        }

        const allowedFields = [
            'companyName',
            'industry',
            'logoUrl',
            'website',
            'brandStory'
        ] as const;

        const update: Record<string, any> = {};
        for (const key of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                update[key] = (req.body as any)[key];
            }
        }

        const profile = await BrandProfile.findOneAndUpdate(
            { userId: req.userId },
            { $set: update },
            { new: true, upsert: true }
        );

        trackEvent(req.userId, 'profile_updated', {
            profileType: 'brand',
            updatedFields: Object.keys(update),
        });

        res.status(200).json({ success: true, profile });
    } catch (error: any) {
        console.error('Update brand profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/profile/brand/:userId - Get brand profile
router.get('/brand/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // Verify user exists and is a brand
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Brand') {
            res.status(400).json({ error: 'User is not a brand account' });
            return;
        }

        // Fetch brand profile
        const profile = await BrandProfile.findOne({ userId })
            .populate('creatorsHired', 'fullName email');

        if (!profile) {
            res.status(404).json({ error: 'Brand profile not found' });
            return;
        }

        res.status(200).json({ profile });
    } catch (error: any) {
        console.error('Get brand profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/profile/creator/:userId - Get creator profile
router.get('/creator/by-handle/:handle', optionalAuth, async (req: OptionalAuthRequest, res: Response): Promise<void> => {
    try {
        const handle = req.params.handle.replace(/^@+/, '');

        const profile = await CreatorProfile.findOne({
            instagramHandle: { $regex: `^@?${handle}$`, $options: 'i' },
        }).lean();

        if (!profile) {
            res.status(404).json({ error: 'Creator profile not found' });
            return;
        }

        const user = await User.findById(profile.userId).select('_id fullName email accountType verificationStatus verificationBadge').lean();
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, creator: { user, profile }, authenticated: !!req.userId });
    } catch (error: any) {
        console.error('Get creator by handle error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/profile/creator/:userId - Get creator profile
router.get('/creator/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // Verify user exists and is a creator
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Creator') {
            res.status(400).json({ error: 'User is not a creator account' });
            return;
        }

        // Fetch creator profile
        const profile = await CreatorProfile.findOne({ userId });

        if (!profile) {
            res.status(404).json({ error: 'Creator profile not found' });
            return;
        }

        res.status(200).json({ profile });
    } catch (error: any) {
        console.error('Get creator profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/profile/creators/public - Get public creator list (with optional auth)
router.get('/creators/public', optionalAuth, async (req: OptionalAuthRequest, res: Response): Promise<void> => {
    try {
        const isAuthenticated = !!req.userId;

        // If a brand is authenticated, hide creators they've already proposed to (pending or accepted)
        // so the brand cannot spam duplicate proposals from the creators list.
        let excludeCreatorIds = new Set<string>();
        if (isAuthenticated && req.userId) {
            const authedUser = await User.findById(req.userId).select('accountType');
            if (authedUser?.accountType === 'Brand') {
                const existingProposals = await Proposal.find({
                    brandId: req.userId,
                    status: { $in: ['pending', 'accepted'] },
                }).select('creatorId');

                excludeCreatorIds = new Set(existingProposals.map(p => p.creatorId.toString()));
            }
        }

        // Fetch all creators
        const creators = await User.find({
            accountType: 'Creator',
            ...(excludeCreatorIds.size ? { _id: { $nin: Array.from(excludeCreatorIds) } } : {}),
        })
            .select('_id fullName email')
            .limit(20);

        if (!creators || creators.length === 0) {
            res.status(200).json({
                success: true,
                creators: [],
                authenticated: isAuthenticated
            });
            return;
        }

        // Get creator profiles
        const creatorIds = creators.map(c => c._id);
        const profiles = await CreatorProfile.find({ userId: { $in: creatorIds } });

        // Create a map of userId to profile
        const profileMap = new Map();
        profiles.forEach(profile => {
            profileMap.set(profile.userId.toString(), profile);
        });

        if (!isAuthenticated) {
            // Return only profile pictures for unauthenticated users
            const limitedData = creators.map(creator => {
                const profile = profileMap.get(creator._id.toString());
                return {
                    id: creator._id,
                    profilePicture: profile?.profilePhoto || null,
                };
            });

            res.status(200).json({
                success: true,
                creators: limitedData,
                authenticated: false
            });
            return;
        }

        // Return full data for authenticated users
        const fullData = creators.map(creator => {
            const profile = profileMap.get(creator._id.toString());

            const rawHandle = profile?.instagramHandle || '';
            const normalizedHandle = rawHandle.replace(/^@+/, '');
            return {
                id: creator._id,
                name: creator.fullName, // Map fullName to name for frontend
                instagramHandle: normalizedHandle || 'unknown',
                profilePicture: profile?.profilePhoto || null,
                followers: profile?.followers || '0',
                following: '0', // Not in schema yet
                bio: '', // Not in schema yet  
                verified: false, // Not in schema yet
                featured: false,
                isActive: true,
                openToWork: true,
                category: profile?.niches?.[0] || 'Other'
            };
        });

        res.status(200).json({
            success: true,
            creators: fullData,
            authenticated: true
        });
    } catch (error: any) {
        console.error('Get public creators error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/profile/creators/:userId/public - Public creator profile+stats (with optional auth)
router.get('/creators/:userId/public', optionalAuth, async (req: OptionalAuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('_id fullName accountType');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Creator') {
            res.status(400).json({ error: 'User is not a creator account' });
            return;
        }

        const profile = await CreatorProfile.findOne({ userId: user._id });
        if (!profile) {
            res.status(404).json({ error: 'Creator profile not found' });
            return;
        }

        const normalizedHandle = (profile.instagramHandle || '').replace(/^@+/, '');

        // Consider accepted proposals as “past collaborations” (lightweight proxy).
        const collaborationsCount = await Proposal.countDocuments({
            creatorId: user._id,
            status: 'accepted',
        });

        // NOTE: avgReach isn't modeled yet. Return null so frontend can handle nicely.
        const avgReach = null;

        res.status(200).json({
            success: true,
            creator: {
                id: user._id,
                name: user.fullName,
                instagramHandle: normalizedHandle,
                profilePicture: profile.profilePhoto || null,
                niches: profile.niches || [],
                followers: profile.followers || '0',
                engagement: profile.engagement || null,
                availability: profile.availability,
                pricing: profile.pricing || null,
                brandWork: profile.brandWork || [],
            },
            stats: {
                followers: profile.followers || '0',
                engagement: profile.engagement || null,
                avgReach,
                pastBrandCollaborations: collaborationsCount,
            },
            authenticated: !!req.userId,
        });
    } catch (error: any) {
        console.error('Get public creator stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/profile/brand/:userId/public - Public brand profile (with optional auth)
router.get('/brand/:userId/public', optionalAuth, async (req: OptionalAuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('_id fullName accountType');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Brand') {
            res.status(400).json({ error: 'User is not a brand account' });
            return;
        }

        const profile = await BrandProfile.findOne({ userId: user._id });
        if (!profile) {
            res.status(404).json({ error: 'Brand profile not found' });
            return;
        }

        res.status(200).json({
            success: true,
            brand: {
                id: user._id,
                name: user.fullName,
                companyName: profile.companyName || user.fullName,
                industry: profile.industry || 'General',
                logoUrl: profile.logoUrl || null,
                website: profile.website || null,
                brandStory: profile.brandStory || null,
            },
            authenticated: !!req.userId,
        });
    } catch (error: any) {
        console.error('Get public brand profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/profile/brands/public - Get public brands list
router.get('/brands/public', optionalAuth, async (req: OptionalAuthRequest, res: Response): Promise<void> => {
    try {
        // Fetch users who are Brands
        const users = await User.find({ accountType: 'Brand' }).select('fullName email');
        
        // Fetch their profiles
        const userIds = users.map(u => u._id);
        const profiles = await BrandProfile.find({ userId: { $in: userIds } });

        // Merge user and profile data
        const brands = users.map(user => {
            const profile = profiles.find(p => p.userId.toString() === user._id.toString());
            return {
                id: user._id,
                name: user.fullName,
                companyName: profile?.companyName,
                industry: profile?.industry,
            };
        });

        res.status(200).json({
            success: true,
            brands,
            authenticated: !!req.userId
        });
    } catch (error: any) {
        console.error('Get public brands error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
