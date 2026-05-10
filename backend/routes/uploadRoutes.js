import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage config to preserve file extensions
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
    }
});

const upload = multer({ storage });

// Upload route
router.post('/', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const isPdf = req.file.mimetype === 'application/pdf';
        let fileUrl = '';

        if (isPdf) {
            // ✅ For PDFs: Use local storage URL
            // We use the full URL including port. In production, this would be the domain.
            const port = process.env.PORT || 5000;
            fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
        } else {
            // ✅ For Images: Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'internship_docs',
                resource_type: 'auto',
            });

            fileUrl = result.secure_url;

            // Delete local file after uploading to Cloudinary
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        res.status(200).json({
            message: 'File uploaded successfully',
            url: fileUrl,
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});


export default router;