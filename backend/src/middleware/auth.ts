import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    user?: any;
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

        const user = await User.findById(payload.userId);
        if (!user) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        if (user.suspended === true) {
            res.status(403).json({ error: 'Account suspended' });
            return;
        }

        // Attach user info to request
        req.userId = payload.userId;
        req.userEmail = payload.email;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
