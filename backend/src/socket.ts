import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken, JWTPayload } from './utils/jwt';
import Message from './models/Message';
import Conversation from './models/Conversation';
import cookie from 'cookie';

interface SocketUser extends JWTPayload {}

export function initSocket(httpServer: HttpServer) {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');

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

    io.on('connection', (socket: Socket) => {
        const user = socket.data.user as SocketUser;
        console.log(`Socket User connected: ${user.userId}`);

        // Join personal room to receive private messages
        socket.join(user.userId);

        // Handle sending messages
        socket.on('sendMessage', async (data: { conversationId: string, receiverId: string, text: string }, callback) => {
            try {
                const { conversationId, receiverId, text } = data;

                // Save message
                const message = await Message.create({
                    conversationId,
                    senderId: user.userId,
                    text,
                    read: false,
                });

                // Update conversation's last message
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: text,
                    lastMessageAt: new Date()
                });

                // Send back to the sender just in case they need the DB document
                if (callback) callback({ success: true, message });

                // Emit to receiver's room
                socket.to(receiverId).emit('newMessage', message);
                
                // Emit to sender's other sockets (if any)
                socket.to(user.userId).emit('newMessage', message);
                
            } catch (error) {
                console.error('Socket sendMessage error:', error);
                if (callback) callback({ success: false, error: 'Failed to send message' });
            }
        });

        // Mark messages as read
        socket.on('markAsRead', async (data: { conversationId: string, senderId: string }) => {
            try {
                const { conversationId, senderId } = data;
                await Message.updateMany(
                    { conversationId, senderId, read: false },
                    { $set: { read: true } }
                );
            } catch (error) {
                console.error('Socket markAsRead error:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket User disconnected: ${user.userId}`);
        });
    });

    return io;
}
