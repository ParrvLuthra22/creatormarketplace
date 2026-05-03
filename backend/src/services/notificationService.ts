import User from '../models/User';
import { sendEmail } from '../config/email';
import { newMessageEmail } from '../utils/emailTemplates';
import { isUserOnline } from './presenceService';

const lastChatNotificationAt = new Map<string, number>();
const throttleMs = 15 * 60 * 1000;

export async function sendChatNotification(
    receiverId: string,
    senderName: string,
    messagePreview: string,
    conversationId: string
) {
    if (isUserOnline(receiverId)) {
        return { skipped: true, reason: 'receiver_online' };
    }

    const now = Date.now();
    const lastSentAt = lastChatNotificationAt.get(receiverId) || 0;
    if (now - lastSentAt < throttleMs) {
        return { skipped: true, reason: 'throttled' };
    }

    const receiver = await User.findById(receiverId).select('fullName email');
    if (!receiver?.email) {
        return { skipped: true, reason: 'receiver_not_found' };
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    await sendEmail({
        to: receiver.email,
        subject: `New message from ${senderName}`,
        html: newMessageEmail(
            receiver.fullName,
            senderName,
            messagePreview || 'Open CreatorLyff to view the latest message.',
            `${frontendUrl}/messages/${conversationId}`
        ),
        text: `${senderName}: ${messagePreview}`,
    });

    lastChatNotificationAt.set(receiverId, now);

    // TODO: Send web push notification once push subscriptions are modeled.
    return { success: true };
}
