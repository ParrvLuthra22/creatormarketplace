import { Router, Response } from 'express';
import BrandProfile from '../models/BrandProfile';
import CreatorProfile from '../models/CreatorProfile';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { optionalAuth, OptionalAuthRequest } from '../middleware/optionalAuth';

const router = Router();

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

        // Fetch all creators
        const creators = await User.find({ accountType: 'Creator' })
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
                    profilePicture: profile?.profilePicture || '/api/placeholder/100/100',
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
            return {
                id: creator._id,
                name: creator.fullName, // Map fullName to name for frontend
                instagramHandle: profile?.instagramHandle || 'unknown',
                profilePicture: profile?.profilePicture || '/api/placeholder/140/140',
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

export default router;
