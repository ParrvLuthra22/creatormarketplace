import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
    | 'proposal_created'
    | 'proposal_accepted'
    | 'proposal_declined'
    | 'new_message'
    | 'verification_approved'
    | 'verification_rejected';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId; // recipient
    type: NotificationType;
    actorId?: mongoose.Types.ObjectId; // who triggered the notification
    entityId?: mongoose.Types.ObjectId; // related Proposal/Message/VerificationRequest id
    entityType?: 'Proposal' | 'Message' | 'VerificationRequest';
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: [
            'proposal_created',
            'proposal_accepted',
            'proposal_declined',
            'new_message',
            'verification_approved',
            'verification_rejected',
        ],
        required: true,
    },
    actorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    entityId: {
        type: Schema.Types.ObjectId,
    },
    entityType: {
        type: String,
        enum: ['Proposal', 'Message', 'VerificationRequest'],
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
