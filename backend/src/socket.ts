import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import mongoose from 'mongoose';
import { verifyToken, JWTPayload } from './utils/jwt';
import Message from './models/Message';
import Conversation from './models/Conversation';
import User from './models/User';
import cookie from 'cookie';
import { trackEvent } from './config/posthog';
import { addOnlineSocket, isUserOnline, onlineUsers, removeOnlineSocket } from './services/presenceService';
import { sendChatNotification } from './services/notificationService';

interface SocketUser extends JWTPayload {}

type AttachmentPayload = {
    type: 'image' | 'video' | 'file';
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    thumbnailUrl?: string;
};

type SendMessagePayload = {
    conversationId: string;
    receiverId: string;
    text?: string;
    attachments?: AttachmentPayload[];
    replyTo?: string;
};

const typingTimeouts = new Map<string, NodeJS.Timeout>();

async function emitPresenceToConversationParticipants(
    io: Server,
    userId: string,
    event: 'userOnline' | 'userOffline',
    payload: Record<string, unknown>
) {
    const conversations = await Conversation.find({ participants: userId }).select('participants').lean();
    const participantIds = new Set<string>();

    conversations.forEach(conversation => {
        conversation.participants.forEach(participantId => {
            participantIds.add(participantId.toString());
        });
    });

    participantIds.forEach(participantId => {
        io.to(participantId).emit(event, payload);
    });
}

async function emitToConversationParticipants(io: Server, conversationId: string, event: string, payload: Record<string, unknown>) {
    const conversation = await Conversation.findById(conversationId).select('participants').lean();
    if (!conversation) {
        return;
    }

    conversation.participants.forEach(participantId => {
        io.to(participantId.toString()).emit(event, payload);
    });
}

export { onlineUsers };

export function initSocket(httpServer: HttpServer) {
    const allowedOrigins = (process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')).split(',');

    const io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
                    return callback(null, true);
                }
                callback(new Error('Not allowed by CORS'));
            },
            credentials: true,
        }
    });

    // Authentication middleware
    io.use((socket, next) => {
        try {
            let token = socket.handshake.auth.token;

            // Try to extract from cookies if not provided in auth payload
            if (!token && socket.handshake.headers.cookie) {
                const cookies = cookie.parse(socket.handshake.headers.cookie);
                token = cookies.token;
                console.log('[Socket Auth] Token from cookie:', token ? 'found' : 'not found');
            }

            // Fallback: try query param
            if (!token && socket.handshake.query.token) {
                token = socket.handshake.query.token as string;
                console.log('[Socket Auth] Token from query param:', token ? 'found' : 'not found');
            }

            if (!token) {
                console.error('[Socket Auth] No token found in auth, cookies, or query. Headers:', Object.keys(socket.handshake.headers));
                return next(new Error('Authentication error: No token'));
            }

            const decoded = verifyToken(token);
            socket.data.user = decoded;
            console.log('[Socket Auth] Authenticated user:', decoded.userId);
            next();
        } catch (error: any) {
            console.error('[Socket Auth] Error:', error.message);
            return next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket: Socket) => {
        const user = socket.data.user as SocketUser;
        console.log(`Socket User connected: ${user.userId}`);

        // Join personal room to receive private messages
        socket.join(user.userId);

        const wasOffline = addOnlineSocket(user.userId, socket.id);
        if (wasOffline) {
            await emitPresenceToConversationParticipants(io, user.userId, 'userOnline', {
                userId: user.userId,
                timestamp: new Date().toISOString(),
            });
        }

        // Handle sending messages
        socket.on('sendMessage', async (data: SendMessagePayload, callback) => {
            try {
                const { conversationId, receiverId, attachments = [], replyTo } = data;
                const text = (data.text || '').trim();

                if (!text && attachments.length === 0) {
                    if (callback) callback({ success: false, error: 'Message text or attachment is required' });
                    return;
                }

                const receiverOnline = isUserOnline(receiverId);

                // Save message
                const message = await Message.create({
                    conversationId,
                    senderId: user.userId,
                    text: text || 'Attachment',
                    read: false,
                    status: receiverOnline ? 'delivered' : 'sent',
                    attachments,
                    ...(replyTo && mongoose.Types.ObjectId.isValid(replyTo) ? { replyTo } : {}),
                });

                // Update conversation's last message
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: text || (attachments.length === 1 ? attachments[0].filename : `${attachments.length} attachments`),
                    lastMessageAt: new Date()
                });

                trackEvent(user.userId, 'message_sent', {
                    messageId: message._id.toString(),
                    conversationId,
                    receiverId,
                    hasAttachments: attachments.length > 0,
                });

                // Send back to the sender just in case they need the DB document
                if (callback) callback({ success: true, message });

                // Emit to receiver's room
                socket.to(receiverId).emit('newMessage', message);

                // Emit to sender's other sockets (if any)
                socket.to(user.userId).emit('newMessage', message);

                if (receiverOnline) {
                    io.to(user.userId).emit('messageDelivered', {
                        conversationId,
                        messageId: message._id,
                        receiverId,
                        deliveredAt: new Date().toISOString(),
                    });
                } else {
                    const sender = await User.findById(user.userId).select('fullName');
                    await sendChatNotification(
                        receiverId,
                        sender?.fullName || 'Someone',
                        text || (attachments.length > 0 ? 'Sent an attachment' : ''),
                        conversationId
                    );
                }
            } catch (error) {
                console.error('Socket sendMessage error:', error);
                if (callback) callback({ success: false, error: 'Failed to send message' });
            }
        });

        socket.on('typing', async (data: { conversationId: string, receiverId: string }) => {
            try {
                const { conversationId, receiverId } = data;
                const key = `${conversationId}:${user.userId}`;
                const existingTimeout = typingTimeouts.get(key);
                if (existingTimeout) clearTimeout(existingTimeout);

                socket.to(receiverId).emit('userTyping', { conversationId, userId: user.userId });

                typingTimeouts.set(key, setTimeout(() => {
                    socket.to(receiverId).emit('userStoppedTyping', { conversationId, userId: user.userId });
                    typingTimeouts.delete(key);
                }, 5000));
            } catch (error) {
                console.error('Socket typing error:', error);
            }
        });

        socket.on('stoppedTyping', async (data: { conversationId: string, receiverId: string }) => {
            try {
                const { conversationId, receiverId } = data;
                const key = `${conversationId}:${user.userId}`;
                const existingTimeout = typingTimeouts.get(key);
                if (existingTimeout) clearTimeout(existingTimeout);
                typingTimeouts.delete(key);

                socket.to(receiverId).emit('userStoppedTyping', { conversationId, userId: user.userId });
            } catch (error) {
                console.error('Socket stoppedTyping error:', error);
            }
        });

        // Mark messages as read
        socket.on('markAsRead', async (data: { conversationId: string, senderId: string }) => {
            try {
                const { conversationId, senderId } = data;
                const messages = await Message.find({
                    conversationId,
                    senderId,
                    read: false,
                }).select('_id');
                const messageIds = messages.map(message => message._id);

                if (messageIds.length === 0) {
                    return;
                }

                await Message.updateMany(
                    { _id: { $in: messageIds } },
                    { $set: { read: true, status: 'read' } }
                );

                io.to(senderId).emit('messagesRead', {
                    conversationId,
                    readerId: user.userId,
                    messageIds,
                });
            } catch (error) {
                console.error('Socket markAsRead error:', error);
            }
        });

        socket.on('addReaction', async (data: { messageId: string, emoji: string }, callback) => {
            try {
                const { messageId, emoji } = data;
                const message = await Message.findById(messageId);
                if (!message) {
                    if (callback) callback({ success: false, error: 'Message not found' });
                    return;
                }

                message.reactions = message.reactions.filter(reaction => reaction.userId.toString() !== user.userId);
                message.reactions.push({
                    userId: new mongoose.Types.ObjectId(user.userId),
                    emoji,
                    createdAt: new Date(),
                });
                await message.save();

                await emitToConversationParticipants(io, message.conversationId.toString(), 'reactionAdded', {
                    messageId,
                    userId: user.userId,
                    emoji,
                });

                if (callback) callback({ success: true, message });
            } catch (error) {
                console.error('Socket addReaction error:', error);
                if (callback) callback({ success: false, error: 'Failed to add reaction' });
            }
        });

        socket.on('removeReaction', async (data: { messageId: string }, callback) => {
            try {
                const { messageId } = data;
                const message = await Message.findById(messageId);
                if (!message) {
                    if (callback) callback({ success: false, error: 'Message not found' });
                    return;
                }

                message.reactions = message.reactions.filter(reaction => reaction.userId.toString() !== user.userId);
                await message.save();

                await emitToConversationParticipants(io, message.conversationId.toString(), 'reactionRemoved', {
                    messageId,
                    userId: user.userId,
                });

                if (callback) callback({ success: true, message });
            } catch (error) {
                console.error('Socket removeReaction error:', error);
                if (callback) callback({ success: false, error: 'Failed to remove reaction' });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Socket User disconnected: ${user.userId}`);

            const isNowOffline = removeOnlineSocket(user.userId, socket.id);
            if (isNowOffline) {
                const lastSeen = new Date();
                await User.findByIdAndUpdate(user.userId, { $set: { lastSeen } });

                await emitPresenceToConversationParticipants(io, user.userId, 'userOffline', {
                    userId: user.userId,
                    lastSeen: lastSeen.toISOString(),
                });
            }
        });
    });

    return io;
}
