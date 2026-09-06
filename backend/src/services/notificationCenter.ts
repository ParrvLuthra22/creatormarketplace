import type { Server } from 'socket.io';
import Notification, { NotificationType } from '../models/Notification';

interface CreateNotificationInput {
    userId: string;
    type: NotificationType;
    message: string;
    actorId?: string;
    entityId?: string;
    entityType?: 'Proposal' | 'Message' | 'VerificationRequest';
}

/**
 * Persists a notification and pushes it in real time to the recipient's
 * socket room (their own userId, joined on connect — see socket.ts). `io` is
 * optional so this can be called safely even if socket.io hasn't been wired
 * into the caller (e.g. from a script) — the notification still gets saved,
 * it just won't push live.
 */
export async function createNotification(io: Server | undefined, input: CreateNotificationInput) {
    const notification = await Notification.create({
        userId: input.userId,
        type: input.type,
        message: input.message,
        actorId: input.actorId,
        entityId: input.entityId,
        entityType: input.entityType,
    });

    io?.to(input.userId).emit('notification', notification);

    return notification;
}
