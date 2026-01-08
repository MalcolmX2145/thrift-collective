import { Router } from 'express';
import { upload } from '../middleware/upload';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Single image upload (protected - admin only)
router.post('/image', requireAdmin, upload.single('image'), uploadImage);

// Multiple images upload (protected - admin only)
router.post('/images', requireAdmin, upload.array('images', 10), uploadMultipleImages);

export default router;
