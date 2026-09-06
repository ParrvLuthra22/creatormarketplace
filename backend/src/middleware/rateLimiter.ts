import rateLimit from 'express-rate-limit';
import { AuthRequest } from './auth';

// Rate limiter for auth endpoints: 5 requests per minute
export const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again after a minute',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Keys authenticated limiters by user id (set by authMiddleware, which always
// runs before these) rather than IP, so the limit is per-account, not per-network.
const keyByUser = (req: AuthRequest) => req.userId || req.ip || 'anonymous';

// POST /api/proposals — max 20/hour per user, to prevent proposal spam
export const createProposalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    keyGenerator: keyByUser,
    message: {
        error: 'Too many proposals sent — please try again in an hour',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// /api/uploads/* — max 50/hour per user
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50,
    keyGenerator: keyByUser,
    message: {
        error: 'Too many uploads — please try again in an hour',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// /api/verification/request — max 3/day per user
export const verificationRequestLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3,
    keyGenerator: keyByUser,
    message: {
        error: 'Too many verification requests — please try again tomorrow',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
