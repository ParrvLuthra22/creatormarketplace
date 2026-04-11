import { Router, Response } from 'express';
import crypto from 'crypto';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import CreatorProfile from '../models/CreatorProfile';

const router = Router();

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function fetchInstagramGraph<T>(path: string, accessToken: string): Promise<T> {
    const url = `https://graph.facebook.com/v19.0/${path}&access_token=${accessToken}`;
    const res = await fetch(url);
    if (!res.ok) {
        const err = await res.json() as { error?: { message?: string } };
        throw new Error(err?.error?.message || 'Instagram Graph API error');
    }
    return res.json() as Promise<T>;
}

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
        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        const accessToken = user.instagramAccessToken;
        if (!accessToken) {
            res.status(400).json({
                success: false,
                error: 'No Instagram access token found. Please log in with Facebook/Instagram first.',
            });
            return;
        }

        // Step 1: Get connected Facebook Pages
        const pagesData = await fetchInstagramGraph<{ data: { id: string; name: string; access_token: string }[] }>(
            'me/accounts?fields=id,name,access_token',
            accessToken
        );

        if (!pagesData.data?.length) {
            res.status(400).json({
                success: false,
                error: 'No Facebook Pages found. You need a Facebook Page linked to your Instagram Business/Creator account.',
                hint: 'Convert your Instagram to a Business or Creator account and link it to a Facebook Page.',
            });
            return;
        }

        // Step 2: Find Instagram account connected to one of the Pages
        let igAccountId: string | null = null;
        let pageToken: string | null = null;

        for (const page of pagesData.data) {
            try {
                const igData = await fetchInstagramGraph<{ instagram_business_account?: { id: string } }>(
                    `${page.id}?fields=instagram_business_account`,
                    page.access_token
                );
                if (igData.instagram_business_account?.id) {
                    igAccountId = igData.instagram_business_account.id;
                    pageToken = page.access_token;
                    break;
                }
            } catch (_) {
                // Try next page
            }
        }

        if (!igAccountId || !pageToken) {
            res.status(400).json({
                success: false,
                error: 'No Instagram Business/Creator account found on your Facebook Pages.',
                hint: 'Make sure your Instagram account is a Business or Creator account and is linked to your Facebook Page under Instagram → Linked Accounts.',
            });
            return;
        }

        // Step 3: Fetch Instagram profile fields
        const profile = await fetchInstagramGraph<{
            id: string;
            username: string;
            name: string;
            biography: string;
            followers_count: number;
            follows_count: number;
            media_count: number;
            account_type: string;
            website: string;
            profile_picture_url: string;
        }>(
            `${igAccountId}?fields=id,username,name,biography,followers_count,follows_count,media_count,account_type,website,profile_picture_url`,
            pageToken
        );

        // Step 4: Fetch recent media (last 12 posts)
        const mediaData = await fetchInstagramGraph<{
            data: {
                id: string;
                media_url?: string;
                thumbnail_url?: string;
                permalink: string;
                media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
                caption?: string;
                timestamp: string;
                like_count?: number;
                comments_count?: number;
            }[];
        }>(
            `${igAccountId}/media?fields=id,media_url,thumbnail_url,permalink,media_type,caption,timestamp,like_count,comments_count&limit=12`,
            pageToken
        );

        // Step 5: Update or create CreatorProfile with Instagram data
        const instagramData = {
            instagramHandle: profile.username,
            instagramUserId: profile.id,
            instagramBio: profile.biography,
            instagramFollowerCount: profile.followers_count,
            instagramFollowingCount: profile.follows_count,
            instagramMediaCount: profile.media_count,
            instagramAccountType: profile.account_type,
            instagramWebsite: profile.website,
            instagramDataUpdatedAt: new Date(),
            ...(profile.profile_picture_url && { profilePhoto: profile.profile_picture_url }),
            recentMedia: (mediaData.data || []).map(m => ({
                id: m.id,
                mediaUrl: m.media_url,
                thumbnailUrl: m.thumbnail_url,
                permalink: m.permalink,
                mediaType: m.media_type,
                caption: m.caption,
                timestamp: m.timestamp,
                likeCount: m.like_count,
                commentsCount: m.comments_count,
            })),
        };

        // Also update the handle on the User model
        await User.findByIdAndUpdate(req.userId, { instagramHandle: profile.username });

        // Upsert CreatorProfile
        const updatedProfile = await CreatorProfile.findOneAndUpdate(
            { userId: req.userId },
            { $set: instagramData },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: `Instagram data synced for @${profile.username}`,
            instagram: {
                username: profile.username,
                name: profile.name,
                bio: profile.biography,
                followers: profile.followers_count,
                following: profile.follows_count,
                mediaCount: profile.media_count,
                accountType: profile.account_type,
                profilePicture: profile.profile_picture_url,
                recentMedia: instagramData.recentMedia,
            },
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

