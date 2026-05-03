import { PostHog } from 'posthog-node';

type EventProperties = Record<string, unknown>;
type PostHogClient = {
    capture: PostHog['capture'];
    shutdown: (shutdownTimeoutMs?: number) => Promise<void>;
};

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com';

export const isPostHogConfigured = Boolean(apiKey);

const createPostHogClient = (): PostHogClient => {
    if (!apiKey) {
        return {
            capture: () => undefined,
            shutdown: async () => undefined,
        };
    }

    const client = new PostHog(apiKey, { host });
    return Object.assign(client, {
        shutdown: (shutdownTimeoutMs?: number) => client._shutdown(shutdownTimeoutMs),
    });
};

export const posthog = createPostHogClient();

export function trackEvent(distinctId: string | undefined | null, event: string, properties: EventProperties = {}): void {
    if (!isPostHogConfigured || !distinctId) {
        return;
    }

    posthog.capture({
        distinctId,
        event,
        properties,
    });
}
