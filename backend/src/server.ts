import './config/env';
import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { initSocket } from './socket';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import uploadsRoutes from './routes/uploads';
import chatRoutes from './routes/chat';
import proposalRoutes from './routes/proposals';
import instagramRoutes from './routes/instagram';
import path from 'path';
import './config/passport'; // Initialize Passport strategies
import passport from 'passport';
// import paymentsRoutes from './routes/payments';

// Load environment variables
// dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

const PORT = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy for Render load balancers
app.set('trust proxy', 1);

// Connect to database
connectDB();

app.use(helmet({
    contentSecurityPolicy: isProduction ? undefined : false, // Disable CSP in dev for HMR
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow frontend apps to load uploaded images
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(passport.initialize()); // Initialize Passport (no sessions — we use JWT cookies)

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')).split(',').map(s => s.trim());
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);

            // Check exact match
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow Vercel preview deployments (*.vercel.app)
            if (origin.endsWith('.vercel.app')) {
                return callback(null, true);
            }

            // Allow Railway deployments
            if (origin.endsWith('.up.railway.app')) {
                return callback(null, true);
            }

            console.warn(`CORS blocked origin: ${origin}`);
            callback(null, false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/instagram', instagramRoutes);
// app.use('/api/payments', paymentsRoutes);

// Serve uploaded files (local dev)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        name: 'Creator Marketplace API',
        status: 'running',
        version: '1.0.0',
    });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);

    // Don't leak error details in production
    const message = isProduction ? 'Internal server error' : err.message;

    res.status(500).json({
        error: message,
        ...(isProduction ? {} : { stack: err.stack })
    });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security headers: ${isProduction ? 'enabled' : 'development mode'}`);
});

export default app;
