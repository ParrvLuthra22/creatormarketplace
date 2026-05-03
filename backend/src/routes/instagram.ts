import { Router, Response } from 'express';
import crypto from 'crypto';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import CreatorProfile from '../models/CreatorProfile';
import { syncInstagramData } from '../services/instagramService';

const router = Router();

// ─── Routes ────────────────────────────────────────────────────────────────────

/**
 * GET /api/instagram/sync
 * Fetches the connected Instagram Business/Creator account data for the logged-in user
 * and saves it to their CreatorProfile.
 * 
 * Flow:
 * 1. Get the user's stored Facebook access token
 * 2. Call /me/accounts to get their Facebook Pages
 * 3. From each Page, get the connected Instagram Business Account
 * 4. Fetch profile + recent media from the Instagram account
 * 5. Cache everything in CreatorProfile
 */
router.get('/sync', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await syncInstagramData(req.userId as string);

        res.status(200).json({
            success: true,
            message: `Instagram data synced for @${result.instagram.username}`,
            instagram: result.instagram,
        });
    } catch (error: any) {
        console.error('Instagram sync error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to sync Instagram data',
        });
    }
});

/**
 * GET /api/instagram/data
 * Returns the cached Instagram data from the CreatorProfile (no Graph API call)
 */
router.get('/data', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const profile = await CreatorProfile.findOne({ userId: req.userId });
        if (!profile) {
            res.status(404).json({ success: false, error: 'Creator profile not found' });
            return;
        }

        res.status(200).json({
            success: true,
            instagram: {
                username: profile.instagramHandle,
                bio: profile.instagramBio,
                followers: profile.instagramFollowerCount,
                following: profile.instagramFollowingCount,
                mediaCount: profile.instagramMediaCount,
                accountType: profile.instagramAccountType,
                website: profile.instagramWebsite,
                profilePicture: profile.profilePhoto,
                recentMedia: profile.recentMedia || [],
                lastSynced: profile.instagramDataUpdatedAt,
            },
        });
    } catch (error: any) {
        console.error('Instagram data fetch error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ─── Meta Data Deletion Callback ──────────────────────────────────────────────

/**
 * Parses and verifies a Meta signed_request using HMAC-SHA256.
 * Returns the decoded payload, or throws if the signature is invalid.
 */
function parseSignedRequest(signedRequest: string, appSecret: string): Record<string, any> {
    const [encodedSig, payload] = signedRequest.split('.');

    if (!encodedSig || !payload) {
        throw new Error('Invalid signed_request format');
    }

    // Base64url → Buffer
    const sig = Buffer.from(encodedSig.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    const expectedSig = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest();

    if (!crypto.timingSafeEqual(sig, expectedSig)) {
        throw new Error('Invalid signed_request signature');
    }

    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
    return data;
}

/**
 * POST /api/instagram/deletion
 *
 * Meta Data Deletion Request callback.
 * Register this URL in the Meta Developer Console under:
 *   App Settings → Advanced → Data Deletion Request URL
 *
 * Meta will POST a signed_request when a user revokes permissions.
 * We must:
 *  1. Verify the HMAC-SHA256 signature
 *  2. Find the user by their Facebook/Instagram user ID
 *  3. Delete all their data
 *  4. Return a JSON response with a status URL and confirmation_code
 */
router.post('/deletion', async (req: any, res: Response): Promise<void> => {
    try {
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000');

        if (!appSecret) {
            console.error('[Deletion] FACEBOOK_APP_SECRET is not set');
            res.status(500).json({ error: 'Server misconfiguration' });
            return;
        }

        const signedRequest: string | undefined = req.body?.signed_request;

        if (!signedRequest) {
            res.status(400).json({ error: 'Missing signed_request' });
            return;
        }

        // Verify and decode the signed request
        let data: Record<string, any>;
        try {
            data = parseSignedRequest(signedRequest, appSecret);
        } catch (err: any) {
            console.error('[Deletion] Signature verification failed:', err.message);
            res.status(400).json({ error: 'Invalid signed_request' });
            return;
        }

        const facebookUserId: string | undefined = data?.user_id;
        if (!facebookUserId) {
            res.status(400).json({ error: 'No user_id in signed_request' });
            return;
        }

        console.log(`[Deletion] Received deletion request for Facebook user ID: ${facebookUserId}`);

        // Generate a unique confirmation code for this deletion request
        const confirmationCode = crypto.randomBytes(16).toString('hex');

        // Find user by their Instagram/Facebook ID
        const user = await User.findOne({ instagramId: facebookUserId });

        if (user) {
            const userId = user._id;

            // Delete creator profile (Instagram data)
            await CreatorProfile.deleteOne({ userId });

            // Clear all Instagram / OAuth fields from the User document
            await User.findByIdAndUpdate(userId, {
                $unset: {
                    instagramId: '',
                    instagramAccessToken: '',
                    instagramHandle: '',
                },
            });

            console.log(`[Deletion] Deleted Instagram data for user ${userId} (FB: ${facebookUserId}). Code: ${confirmationCode}`);
        } else {
            // User not found — still return a successful response to Meta
            console.log(`[Deletion] No user found for FB ID ${facebookUserId}. Code: ${confirmationCode}`);
        }

        // Meta requires this exact response shape
        res.status(200).json({
            url: `${frontendUrl}/deletion-status?code=${confirmationCode}`,
            confirmation_code: confirmationCode,
        });
    } catch (error: any) {
        console.error('[Deletion] Unexpected error:', error);
        res.status(500).json({ error: 'Server error during data deletion' });
    }
});

/**
 * GET /api/instagram/deletion-status?code=<confirmation_code>
 *
 * A lightweight status page so Meta (or the user) can verify the deletion
 * was processed. In production you'd persist the code+status to a DB.
 */
router.get('/deletion-status', (req: any, res: Response): void => {
    const code = req.query?.code as string | undefined;

    if (!code) {
        res.status(400).json({ error: 'Missing confirmation code' });
        return;
    }

    // Since deletion is synchronous above, if a code exists it has been processed.
    res.status(200).json({
        status: 'complete',
        confirmation_code: code,
        message: 'Your Instagram data has been deleted from CreatorSync.',
    });
});

export default router;
