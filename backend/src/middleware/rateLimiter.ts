import rateLimit from 'express-rate-limit';

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
