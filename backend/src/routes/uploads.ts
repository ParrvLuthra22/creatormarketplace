import { Router, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import CreatorProfile from '../models/CreatorProfile';
import BrandProfile from '../models/BrandProfile';

const router = Router();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const authReq = req as AuthRequest;
        const ext = path.extname(file.originalname || '').toLowerCase();
        const safeExt = ext && ext.length <= 10 ? ext : '';
        const base = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${authReq.userId || 'anon'}-${base}${safeExt}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
            cb(new Error('Only image uploads are allowed (jpeg, png, webp, gif)'));
            return;
        }
        cb(null, true);
    },
});

/**
 * POST /api/uploads/profile-photo
 * Upload an image and set it as the current user's profile photo.
 *
 * Returns: { success: true, url: string }
 */
router.post('/profile-photo', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const user = await User.findById(req.userId).select('accountType');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const url = `/uploads/${req.file.filename}`;

        if (user.accountType === 'Creator') {
            await CreatorProfile.findOneAndUpdate(
                { userId: req.userId },
                { $set: { profilePhoto: url } },
                { new: true, upsert: true }
            );
        } else if (user.accountType === 'Brand') {
            await BrandProfile.findOneAndUpdate(
                { userId: req.userId },
                { $set: { logoUrl: url } },
                { new: true, upsert: true }
            );
        }

        res.status(200).json({ success: true, url });
    } catch (error: any) {
        console.error('Upload profile photo error:', error);
        res.status(500).json({ error: error?.message || 'Server error' });
    }
});

export default router;
