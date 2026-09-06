import cron from 'node-cron';
import User from '../models/User';
import VerificationRequest from '../models/VerificationRequest';
import { syncInstagramData } from '../services/instagramService';
import { syncYoutubeData } from '../services/youtubeService';
import { updateCombinedFollowerCount } from '../services/socialStats';
import { trackEvent } from '../config/posthog';

const batchSize = 50;
const oneDayMs = 24 * 60 * 60 * 1000;

// Simple in-memory status for GET /health — good enough for a single-instance
// deployment; would need to move to the DB if this ever runs on multiple instances.
export const lastSyncRun: {
    startedAt: string | null;
    finishedAt: string | null;
    status: 'never_run' | 'running' | 'succeeded' | 'failed';
    summary: { processed: number; succeeded: number; failed: number; autoFlagged: number } | null;
    error: string | null;
} = {
    startedAt: null,
    finishedAt: null,
    status: 'never_run',
    summary: null,
    error: null,
};

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function syncAllSocialStats() {
    lastSyncRun.startedAt = new Date().toISOString();
    lastSyncRun.status = 'running';
    lastSyncRun.error = null;

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

    lastSyncRun.finishedAt = new Date().toISOString();
    lastSyncRun.status = 'succeeded';
    lastSyncRun.summary = summary;

    return summary;
}

// syncAllSocialStats() already does its own in-process auto-flagging as part of
// the sync loop above. This calls the standalone /api/verification/auto-flag
// endpoint too, authenticated with CRON_SECRET, so that endpoint's guard
// (adminOrCronSecretMiddleware) is actually exercised end-to-end — and so an
// external cron provider (Render Cron, GitHub Actions, etc.) has a working
// example to copy if this in-process node-cron job is ever moved out of the
// app process (node-cron doesn't survive multiple instances or serverless).
async function triggerAutoFlagEndpoint() {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
        console.warn('[Social Sync] CRON_SECRET not set — skipping HTTP auto-flag trigger.');
        return;
    }

    const port = process.env.PORT || 5001;
    try {
        const response = await fetch(`http://localhost:${port}/api/verification/auto-flag`, {
            headers: { 'X-Cron-Secret': cronSecret },
        });
        const body = await response.json().catch(() => ({}));
        console.log('[Social Sync] auto-flag endpoint response:', response.status, body);
    } catch (error: any) {
        console.error('[Social Sync] auto-flag endpoint call failed:', error.message || error);
    }
}

export function startSocialSyncJob() {
    cron.schedule(
        '0 3 * * *',
        () => {
            void syncAllSocialStats()
                .then(() => triggerAutoFlagEndpoint())
                .catch(error => {
                    console.error('[Social Sync] Job failed:', error);
                    lastSyncRun.finishedAt = new Date().toISOString();
                    lastSyncRun.status = 'failed';
                    lastSyncRun.error = error?.message || String(error);
                });
        },
        {
            timezone: 'UTC',
        }
    );

    console.log('[Social Sync] Daily job scheduled for 03:00 UTC');
}
