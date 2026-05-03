import cron from 'node-cron';
import User from '../models/User';
import VerificationRequest from '../models/VerificationRequest';
import { syncInstagramData } from '../services/instagramService';
import { syncYoutubeData } from '../services/youtubeService';
import { updateCombinedFollowerCount } from '../services/socialStats';
import { trackEvent } from '../config/posthog';

const batchSize = 50;
const oneDayMs = 24 * 60 * 60 * 1000;

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function syncAllSocialStats() {
    const staleBefore = new Date(Date.now() - oneDayMs);
    const users = await User.find({
        accountType: 'Creator',
        verificationStatus: { $ne: 'rejected' },
        $or: [
            { lastSocialSyncAt: { $exists: false } },
            { lastSocialSyncAt: null },
            { lastSocialSyncAt: { $lt: staleBefore } },
        ],
    }).select('_id instagramAccessToken youtubeAccessToken youtubeRefreshToken verificationStatus lastSocialSyncAt');

    let processed = 0;
    let succeeded = 0;
    let failed = 0;
    let autoFlagged = 0;

    for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);

        for (const user of batch) {
            processed += 1;
            let hadFailure = false;

            try {
                if (user.instagramAccessToken) {
                    await syncInstagramData(user._id.toString());
                }
            } catch (error: any) {
                hadFailure = true;
                console.error(`Instagram social sync failed for ${user._id}:`, error.message || error);
            }

            try {
                if (user.youtubeAccessToken || user.youtubeRefreshToken) {
                    await syncYoutubeData(user._id.toString());
                }
            } catch (error: any) {
                hadFailure = true;
                console.error(`YouTube social sync failed for ${user._id}:`, error.message || error);
            }

            try {
                const profile = await updateCombinedFollowerCount(user._id.toString());
                const combinedFollowerCount = profile?.combinedFollowerCount || 0;

                if (combinedFollowerCount >= 100_000 && user.verificationStatus === 'unverified') {
                    const existingPending = await VerificationRequest.findOne({
                        userId: user._id,
                        status: 'pending',
                    });

                    if (!existingPending) {
                        await VerificationRequest.create({
                            userId: user._id,
                            requestType: 'auto_flag',
                            followerCount: combinedFollowerCount,
                            platform: 'multi',
                        });

                        user.verificationStatus = 'pending';
                        user.verificationRequestedAt = new Date();
                        autoFlagged += 1;
                    }
                }

                user.lastSocialSyncAt = new Date();
                await user.save();

                if (hadFailure) {
                    failed += 1;
                } else {
                    succeeded += 1;
                }
            } catch (error: any) {
                failed += 1;
                console.error(`Social sync finalization failed for ${user._id}:`, error.message || error);
            }
        }

        if (i + batchSize < users.length) {
            await delay(1000);
        }
    }

    const summary = { processed, succeeded, failed, autoFlagged };
    console.log('[Social Sync] Completed:', summary);
    trackEvent('system', 'social_sync_completed', summary);

    return summary;
}

export function startSocialSyncJob() {
    cron.schedule(
        '0 3 * * *',
        () => {
            void syncAllSocialStats().catch(error => {
                console.error('[Social Sync] Job failed:', error);
            });
        },
        {
            timezone: 'UTC',
        }
    );

    console.log('[Social Sync] Daily job scheduled for 03:00 UTC');
}
