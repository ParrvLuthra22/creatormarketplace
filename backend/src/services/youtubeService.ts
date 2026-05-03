import User from '../models/User';
import CreatorProfile from '../models/CreatorProfile';
import { updateCombinedFollowerCount } from './socialStats';

const youtubeApiBase = 'https://www.googleapis.com/youtube/v3';

async function fetchJson<T>(url: string, accessToken: string): Promise<T> {
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
        throw new Error(err?.error?.message || `YouTube API request failed with ${res.status}`);
    }

    return res.json() as Promise<T>;
}

function numberFromStat(value: string | undefined): number {
    return Number(value || 0);
}

export async function refreshYoutubeAccessToken(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (!user.youtubeRefreshToken) {
        throw new Error('No YouTube refresh token found');
    }

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '',
            refresh_token: user.youtubeRefreshToken,
            grant_type: 'refresh_token',
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error_description?: string; error?: string };
        throw new Error(err.error_description || err.error || 'Failed to refresh YouTube token');
    }

    const tokenData = await res.json() as { access_token: string };
    user.youtubeAccessToken = tokenData.access_token;
    await user.save();

    return tokenData.access_token;
}

async function getValidYoutubeAccessToken(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (user.youtubeAccessToken) {
        return user.youtubeAccessToken;
    }

    return refreshYoutubeAccessToken(userId);
}

async function fetchWithRefresh<T>(userId: string, url: string): Promise<T> {
    let accessToken = await getValidYoutubeAccessToken(userId);
    try {
        return await fetchJson<T>(url, accessToken);
    } catch (error: any) {
        if (!String(error.message || '').toLowerCase().includes('auth')) {
            throw error;
        }
        accessToken = await refreshYoutubeAccessToken(userId);
        return fetchJson<T>(url, accessToken);
    }
}

export async function syncYoutubeData(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (!user.youtubeAccessToken && !user.youtubeRefreshToken) {
        throw new Error('No YouTube token found. Please connect YouTube first.');
    }

    const channelsUrl = `${youtubeApiBase}/channels?part=snippet,statistics,brandingSettings&mine=true`;
    const channelsData = await fetchWithRefresh<{
        items?: {
            id: string;
            snippet?: {
                title?: string;
                description?: string;
                thumbnails?: Record<string, { url?: string }>;
            };
            statistics?: {
                subscriberCount?: string;
                viewCount?: string;
                videoCount?: string;
            };
            brandingSettings?: {
                image?: {
                    bannerExternalUrl?: string;
                };
            };
        }[];
    }>(userId, channelsUrl);

    const channel = channelsData.items?.[0];
    if (!channel) {
        throw new Error('No YouTube channel found for this account');
    }

    const searchUrl = `${youtubeApiBase}/search?part=snippet&channelId=${encodeURIComponent(channel.id)}&order=date&maxResults=12&type=video`;
    const searchData = await fetchWithRefresh<{
        items?: {
            id?: { videoId?: string };
            snippet?: {
                title?: string;
                publishedAt?: string;
                thumbnails?: Record<string, { url?: string }>;
            };
        }[];
    }>(userId, searchUrl);

    const videoIds = (searchData.items || [])
        .map(item => item.id?.videoId)
        .filter((id): id is string => Boolean(id));

    const statsByVideoId = new Map<string, any>();
    if (videoIds.length > 0) {
        const videosUrl = `${youtubeApiBase}/videos?id=${videoIds.join(',')}&part=statistics,contentDetails`;
        const videosData = await fetchWithRefresh<{
            items?: {
                id: string;
                statistics?: {
                    viewCount?: string;
                    likeCount?: string;
                    commentCount?: string;
                };
                contentDetails?: {
                    duration?: string;
                };
            }[];
        }>(userId, videosUrl);

        for (const video of videosData.items || []) {
            statsByVideoId.set(video.id, video);
        }
    }

    const recentYouTubeVideos = (searchData.items || [])
        .map(item => {
            const videoId = item.id?.videoId;
            if (!videoId) return null;
            const stats = statsByVideoId.get(videoId);
            return {
                videoId,
                title: item.snippet?.title || '',
                thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
                publishedAt: item.snippet?.publishedAt,
                viewCount: numberFromStat(stats?.statistics?.viewCount),
                likeCount: numberFromStat(stats?.statistics?.likeCount),
                commentCount: numberFromStat(stats?.statistics?.commentCount),
                duration: stats?.contentDetails?.duration,
            };
        })
        .filter(Boolean);

    const thumbnailUrl = channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.default?.url;
    const youtubeData = {
        youtubeChannelId: channel.id,
        youtubeChannelTitle: channel.snippet?.title,
        youtubeSubscriberCount: numberFromStat(channel.statistics?.subscriberCount),
        youtubeViewCount: numberFromStat(channel.statistics?.viewCount),
        youtubeVideoCount: numberFromStat(channel.statistics?.videoCount),
        youtubeBio: channel.snippet?.description,
        youtubeThumbnailUrl: thumbnailUrl,
        youtubeBannerUrl: channel.brandingSettings?.image?.bannerExternalUrl,
        youtubeDataUpdatedAt: new Date(),
        recentYouTubeVideos,
    };

    user.youtubeChannelId = channel.id;
    await user.save();

    await CreatorProfile.findOneAndUpdate(
        { userId },
        {
            $set: youtubeData,
            $setOnInsert: { instagramHandle: user.instagramHandle || `youtube_${channel.id}` },
        },
        { new: true, upsert: true }
    );

    const updatedProfile = await updateCombinedFollowerCount(userId);

    return {
        profile: updatedProfile,
        youtube: youtubeData,
    };
}
