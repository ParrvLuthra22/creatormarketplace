import { Response, NextFunction } from 'express';
import { authMiddleware, AuthRequest } from './auth';

export const adminMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    await authMiddleware(req, res, () => {
        if (!req.user?.isAdmin) {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        next();
    });
};
