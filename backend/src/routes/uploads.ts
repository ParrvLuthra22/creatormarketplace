import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import CreatorProfile from '../models/CreatorProfile';
import BrandProfile from '../models/BrandProfile';
import cloudinary, { isCloudinaryConfigured, uploadCloudinary } from '../config/cloudinary';

const router = Router();

function getUploadResult(file: Express.Multer.File) {
    const publicId = file.filename;
    const url = isCloudinaryConfigured ? file.path : `/uploads/${file.filename}`;

    return { url, publicId };
}

function getAttachmentType(mimeType: string): 'image' | 'video' | 'file' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'file';
}

function getCloudinaryThumbnailUrl(publicId: string, mimeType: string, fallbackUrl: string) {
    if (!isCloudinaryConfigured || !mimeType.startsWith('image/')) {
        return mimeType.startsWith('image/') ? fallbackUrl : undefined;
    }

    return cloudinary.url(publicId, {
        secure: true,
        width: 200,
        crop: 'fill',
    });
}

/**
 * POST /api/uploads/profile-photo
 * Upload an image and set it as the current user's profile photo.
 *
 * Returns: { success: true, url: string, publicId: string }
 */
router.post('/profile-photo', authMiddleware, uploadCloudinary.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
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

        const { url, publicId } = getUploadResult(req.file);

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

        res.status(200).json({ success: true, url, publicId });
    } catch (error: any) {
        console.error('Upload profile photo error:', error);
        res.status(500).json({ error: error?.message || 'Server error' });
    }
});

router.post('/brand-work', authMiddleware, uploadCloudinary.array('files', 6), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[] | undefined;
        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No files uploaded' });
            return;
        }

        const uploads = files.map(getUploadResult);

        res.status(200).json({
            success: true,
            url: uploads.map(upload => upload.url),
            publicId: uploads.map(upload => upload.publicId),
            files: uploads,
        });
    } catch (error: any) {
        console.error('Upload brand work error:', error);
        res.status(500).json({ error: error?.message || 'Server error' });
    }
});

router.post('/brand-logo', authMiddleware, uploadCloudinary.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const { url, publicId } = getUploadResult(req.file);
        await BrandProfile.findOneAndUpdate(
            { userId: req.userId },
            { $set: { logoUrl: url } },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, url, publicId });
    } catch (error: any) {
        console.error('Upload brand logo error:', error);
        res.status(500).json({ error: error?.message || 'Server error' });
    }
});

router.post('/cover-image', authMiddleware, uploadCloudinary.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const { url, publicId } = getUploadResult(req.file);
        res.status(200).json({ success: true, url, publicId });
    } catch (error: any) {
        console.error('Upload cover image error:', error);
        res.status(500).json({ error: error?.message || 'Server error' });
    }
});

router.post('/chat-attachment', authMiddleware, uploadCloudinary.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const { url, publicId } = getUploadResult(req.file);
        const type = getAttachmentType(req.file.mimetype);
        const thumbnailUrl = getCloudinaryThumbnailUrl(publicId, req.file.mimetype, url);

        res.status(200).json({
            success: true,
            url,
            publicId,
            thumbnailUrl,
            filename: req.file.originalname || publicId,
            size: req.file.size,
            mimeType: req.file.mimetype,
            type,
        });
    } catch (error: any) {
        console.error('Upload chat attachment error:', error);
        res.status(500).json({ error: error?.message || 'Server error' });
    }
});

export default router;
