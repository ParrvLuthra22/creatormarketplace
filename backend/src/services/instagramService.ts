import User from '../models/User';
import CreatorProfile from '../models/CreatorProfile';
import { updateCombinedFollowerCount } from './socialStats';

async function fetchInstagramGraph<T>(path: string, accessToken: string): Promise<T> {
    const separator = path.includes('?') ? '&' : '?';
    const url = `https://graph.facebook.com/v19.0/${path}${separator}access_token=${accessToken}`;
    const res = await fetch(url);
    if (!res.ok) {
        const err = await res.json() as { error?: { message?: string } };
        throw new Error(err?.error?.message || 'Instagram Graph API error');
    }
    return res.json() as Promise<T>;
}

export async function syncInstagramData(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const accessToken = user.instagramAccessToken;
    if (!accessToken) {
        throw new Error('No Instagram access token found. Please log in with Facebook/Instagram first.');
    }

    const pagesData = await fetchInstagramGraph<{ data: { id: string; name: string; access_token: string }[] }>(
        'me/accounts?fields=id,name,access_token',
        accessToken
    );

    if (!pagesData.data?.length) {
        throw new Error('No Facebook Pages found. You need a Facebook Page linked to your Instagram Business/Creator account.');
    }

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
            // Try next page.
        }
    }

    if (!igAccountId || !pageToken) {
        throw new Error('No Instagram Business/Creator account found on your Facebook Pages.');
    }

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

    await User.findByIdAndUpdate(userId, { instagramHandle: profile.username });

    await CreatorProfile.findOneAndUpdate(
        { userId },
        {
            $set: instagramData,
            $setOnInsert: { instagramHandle: profile.username },
        },
        { new: true, upsert: true }
    );

    const updatedProfile = await updateCombinedFollowerCount(userId);

    return {
        profile: updatedProfile,
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
    };
}
