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
            'contentStyle',
            'followers',
            'engagement',
            'location',
            'availability',
            'pricing',
            'openToNegotiation',
            'profilePublic',
            'pricingPublic',
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

        const isOwner = req.userId === profile.userId.toString();

        if (profile.profilePublic === false && !isOwner) {
            res.status(404).json({ error: 'Creator profile not found' });
            return;
        }

        // Track a real profile view (skip the creator viewing their own profile).
        if (!isOwner) {
            const now = new Date();
            await CreatorProfile.findByIdAndUpdate(profile._id, {
                $inc: { profileViews: 1 },
                $push: { profileViewLog: { $each: [now], $slice: -500 } },
            });
        }

        const visibleProfile = profile.pricingPublic === false && !isOwner ? { ...profile, pricing: undefined } : profile;

        res.status(200).json({ success: true, creator: { user, profile: visibleProfile }, authenticated: !!req.userId });
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
// Authenticated callers (the brand dashboard) get real filtering, sorting, and
// pagination; unauthenticated callers get a small teaser list as before.
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

        if (!isAuthenticated) {
            const creators = await User.find({
                accountType: 'Creator',
                ...(excludeCreatorIds.size ? { _id: { $nin: Array.from(excludeCreatorIds) } } : {}),
            })
                .select('_id fullName email')
                .limit(20);

            const creatorIds = creators.map(c => c._id);
            const profiles = await CreatorProfile.find({ userId: { $in: creatorIds } });
            const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));

            const limitedData = creators.map(creator => ({
                id: creator._id,
                profilePicture: profileMap.get(creator._id.toString())?.profilePhoto || null,
            }));

            res.status(200).json({ success: true, creators: limitedData, authenticated: false });
            return;
        }

        // ── Authenticated (dashboard) path — real filtering/sort/pagination ──

        const {
            search = '',
            niches = '',
            minFollowers,
            maxFollowers,
            minEngagement,
            maxEngagement,
            platforms = '',
            location = '',
            verified,
            available,
            sort = 'match',
            page = '1',
            limit = '12',
        } = req.query as Record<string, string>;

        // Exclude creators who have opted out of public discovery. Documents saved
        // before this field existed have no value stored, so $ne: false (not a
        // strict equality check) keeps them visible, matching the schema default.
        const profileFilter: any = { profilePublic: { $ne: false } };

        const nicheList = niches.split(',').map(n => n.trim()).filter(Boolean);
        if (nicheList.length) profileFilter.niches = { $in: nicheList };

        if (minFollowers || maxFollowers) {
            profileFilter.combinedFollowerCount = {};
            if (minFollowers) profileFilter.combinedFollowerCount.$gte = Number(minFollowers);
            if (maxFollowers) profileFilter.combinedFollowerCount.$lte = Number(maxFollowers);
        }

        if (location) profileFilter.location = { $regex: location, $options: 'i' };
        if (available === 'true') profileFilter.availability = 'available';

        const platformList = platforms.split(',').map(p => p.trim()).filter(Boolean);
        const platformFieldMap: Record<string, any> = {
            instagram: { instagramHandle: { $exists: true, $nin: [null, ''] } },
            youtube: { youtubeChannelId: { $exists: true, $nin: [null, ''] } },
            twitter: { twitterHandle: { $exists: true, $nin: [null, ''] } },
            linkedin: { linkedinHandle: { $exists: true, $nin: [null, ''] } },
            snapchat: { snapchatHandle: { $exists: true, $nin: [null, ''] } },
        };
        if (platformList.length) {
            profileFilter.$or = platformList.map(p => platformFieldMap[p]).filter(Boolean);
        }

        // Cap at 500 candidates before in-memory refinement (engagement range + text
        // search span both User and CreatorProfile, so a single Mongo query can't
        // express them cleanly at this schema's current size).
        const profiles = await CreatorProfile.find(profileFilter).limit(500).lean();
        const profileUserIds = profiles.map(p => p.userId.toString());

        const userQuery: any = {
            accountType: 'Creator',
            _id: { $in: profileUserIds },
        };
        if (excludeCreatorIds.size) userQuery._id.$nin = Array.from(excludeCreatorIds);

        const users = await User.find(userQuery).select('_id fullName verificationBadge').lean();
        const userMap = new Map(users.map(u => [u._id.toString(), u]));

        let combined = profiles
            .map((profile: any) => {
                const user = userMap.get(profile.userId.toString());
                if (!user) return null;
                const handle = (profile.instagramHandle || '').replace(/^@+/, '') || 'creator';
                return {
                    id: user._id,
                    name: user.fullName,
                    instagramHandle: handle,
                    profilePicture: profile.profilePhoto || null,
                    followers: profile.combinedFollowerCount || 0,
                    engagement: profile.engagement || null,
                    niches: profile.niches || [],
                    location: profile.location || null,
                    availability: profile.availability || 'available',
                    verificationBadge: user.verificationBadge || 'none',
                    createdAt: profile.createdAt,
                };
            })
            .filter(Boolean) as any[];

        if (search) {
            const q = search.toLowerCase();
            combined = combined.filter(
                c =>
                    c.name.toLowerCase().includes(q) ||
                    c.instagramHandle.toLowerCase().includes(q) ||
                    c.niches.some((n: string) => n.toLowerCase().includes(q))
            );
        }

        if (verified === 'true') {
            combined = combined.filter(c => c.verificationBadge && c.verificationBadge !== 'none');
        }

        if (minEngagement || maxEngagement) {
            combined = combined.filter(c => {
                const value = parseFloat(String(c.engagement || ''));
                if (Number.isNaN(value)) return false;
                if (minEngagement && value < Number(minEngagement)) return false;
                if (maxEngagement && value > Number(maxEngagement)) return false;
                return true;
            });
        }

        // Distinct locations across the filtered-but-unpaginated set, for the location dropdown.
        const distinctLocations = Array.from(
            new Set(combined.map(c => c.location).filter((loc): loc is string => Boolean(loc)))
        ).sort();

        if (sort === 'followers') {
            combined.sort((a, b) => b.followers - a.followers);
        } else if (sort === 'engagement') {
            combined.sort((a, b) => (parseFloat(b.engagement) || 0) - (parseFloat(a.engagement) || 0));
        } else if (sort === 'recent') {
            combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else {
            // "Best match" proxy: verified + higher engagement + higher followers first.
            combined.sort((a, b) => {
                const aScore = (a.verificationBadge !== 'none' ? 1000 : 0) + (parseFloat(a.engagement) || 0) * 10 + Math.log10(a.followers + 1);
                const bScore = (b.verificationBadge !== 'none' ? 1000 : 0) + (parseFloat(b.engagement) || 0) * 10 + Math.log10(b.followers + 1);
                return bScore - aScore;
            });
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));
        const total = combined.length;
        const pageItems = combined.slice((pageNum - 1) * limitNum, pageNum * limitNum);
        const hasMore = pageNum * limitNum < total;

        res.status(200).json({
            success: true,
            creators: pageItems,
            authenticated: true,
            page: pageNum,
            hasMore,
            total,
            distinctLocations,
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

        const isOwner = req.userId === user._id.toString();
        if (profile.profilePublic === false && !isOwner) {
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
        const showPricing = profile.pricingPublic !== false || isOwner;

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
                pricing: showPricing ? profile.pricing || null : null,
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
