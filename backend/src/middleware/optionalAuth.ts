import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface OptionalAuthRequest extends Request {
    userId?: string;
    user?: any;
}

export const optionalAuth = (req: OptionalAuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            req.userId = undefined;
            return next();
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
            req.userId = decoded.userId;
            req.user = decoded;
            next();
        } catch (error) {
            // Invalid token, but don't reject the request
            req.user = null;
            req.userId = undefined;
            next();
        }
    } catch (error) {
        req.user = null;
        req.userId = undefined;
        next();
    }
};
