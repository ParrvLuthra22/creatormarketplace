import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'pdf', 'txt', 'csv', 'doc', 'docx', 'zip'];
const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
];

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
} else {
    console.warn('Cloudinary env vars missing. Falling back to local uploads storage.');
}

const randomSuffix = () => Math.random().toString(36).slice(2, 10);

export const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: 'creatorlyff',
        allowed_formats: allowedFormats,
        resource_type: 'auto',
        public_id: `${Date.now()}-${randomSuffix()}`,
    }),
});

const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const localStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const userId = (req as any).userId || 'anon';
        const ext = path.extname(file.originalname || '').toLowerCase();
        const safeExt = ext && ext.length <= 10 ? ext : '';
        cb(null, `${userId}-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
    },
});

export const uploadCloudinary = multer({
    storage: isCloudinaryConfigured ? cloudinaryStorage : localStorage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            cb(new Error('Only jpg, jpeg, png, webp, mp4, and mov uploads are allowed'));
            return;
        }
        cb(null, true);
    },
});

export default cloudinary;
