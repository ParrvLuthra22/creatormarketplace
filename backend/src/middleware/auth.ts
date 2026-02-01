import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from cookie
        const token = req.cookies?.token;

        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        // Verify token
        const payload = verifyToken(token);

        // Attach user info to request
        req.userId = payload.userId;
        req.userEmail = payload.email;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
