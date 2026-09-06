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

/**
 * Guards machine-triggered endpoints (e.g. an external cron provider) that
 * shouldn't require a human admin session. Accepts either:
 *  - a valid `X-Cron-Secret` header matching CRON_SECRET, or
 *  - a normal admin-authenticated session (falls back to adminMiddleware).
 *
 * CRON_SECRET must be set for the header path to work — an empty/missing env
 * var never matches, so this can't be bypassed by sending an empty header.
 */
export const adminOrCronSecretMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const providedSecret = req.headers['x-cron-secret'];
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && providedSecret === expectedSecret) {
        next();
        return;
    }

    await adminMiddleware(req, res, next);
};
