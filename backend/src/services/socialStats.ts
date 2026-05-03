import CreatorProfile, { ICreatorProfile } from '../models/CreatorProfile';

export function computeCombinedFollowerCount(profile: Partial<ICreatorProfile>): number {
    return [
        profile.instagramFollowerCount,
        profile.youtubeSubscriberCount,
        profile.twitterFollowerCount,
    ].reduce<number>((total, value) => total + (Number(value) || 0), 0);
}

export function determinePrimaryPlatform(profile: Partial<ICreatorProfile>) {
    const platforms = [
        { platform: 'instagram' as const, count: Number(profile.instagramFollowerCount) || 0 },
        { platform: 'youtube' as const, count: Number(profile.youtubeSubscriberCount) || 0 },
        { platform: 'twitter' as const, count: Number(profile.twitterFollowerCount) || 0 },
        { platform: 'linkedin' as const, count: 0 },
        { platform: 'snapchat' as const, count: 0 },
    ];

    return platforms.sort((a, b) => b.count - a.count)[0].platform;
}

export async function updateCombinedFollowerCount(userId: string) {
    const profile = await CreatorProfile.findOne({ userId });
    if (!profile) {
        return null;
    }

    profile.combinedFollowerCount = computeCombinedFollowerCount(profile);
    profile.primaryPlatform = determinePrimaryPlatform(profile);
    await profile.save();

    return profile;
}
