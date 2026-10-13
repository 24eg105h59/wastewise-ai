import { Router } from 'express';
import { analyzeImage, getAiHealth } from '../controllers/scanController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public AI status check
router.get('/health', getAiHealth);

// Protect all other scan routes
router.use(authenticate);

router.post('/analyze', analyzeImage);

export default router;
