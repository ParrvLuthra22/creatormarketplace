import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface OptionalAuthRequest extends Request {
    userId?: string;
    user?: any;
}

export const optionalAuth = (req: OptionalAuthRequest, res: Response, next: NextFunction): void => {
    try {
        // Support both Bearer token and cookie token (our frontend uses cookie sessions)
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
        const cookieToken = (req as any).cookies?.token;
        const token = bearerToken || cookieToken;

        if (!token) {
            req.user = null;
            req.userId = undefined;
            return next();
        }

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
