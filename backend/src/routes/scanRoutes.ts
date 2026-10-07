import { Router } from 'express';
import { analyzeImage } from '../controllers/scanController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Protect all scan routes
router.use(authenticate);

router.post('/analyze', analyzeImage);

export default router;
