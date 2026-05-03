import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import CreatorProfile from '../models/CreatorProfile';
import { refreshYoutubeAccessToken, syncYoutubeData } from '../services/youtubeService';

const router = Router();

router.get('/sync', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await syncYoutubeData(req.userId as string);

        res.status(200).json({
            success: true,
            message: `YouTube data synced for ${result.youtube.youtubeChannelTitle || 'channel'}`,
            youtube: result.youtube,
        });
    } catch (error: any) {
        console.error('YouTube sync error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to sync YouTube data',
        });
    }
});

router.get('/data', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const profile = await CreatorProfile.findOne({ userId: req.userId });
        if (!profile) {
            res.status(404).json({ success: false, error: 'Creator profile not found' });
            return;
        }

        res.status(200).json({
            success: true,
            youtube: {
                channelId: profile.youtubeChannelId,
                title: profile.youtubeChannelTitle,
                subscribers: profile.youtubeSubscriberCount,
                views: profile.youtubeViewCount,
                videos: profile.youtubeVideoCount,
                bio: profile.youtubeBio,
                thumbnailUrl: profile.youtubeThumbnailUrl,
                bannerUrl: profile.youtubeBannerUrl,
                recentVideos: profile.recentYouTubeVideos || [],
                lastSynced: profile.youtubeDataUpdatedAt,
            },
        });
    } catch (error: any) {
        console.error('YouTube data fetch error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.post('/refresh-token', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await refreshYoutubeAccessToken(req.userId as string);
        res.status(200).json({ success: true, message: 'YouTube access token refreshed' });
    } catch (error: any) {
        console.error('YouTube token refresh error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to refresh YouTube token' });
    }
});

export default router;
