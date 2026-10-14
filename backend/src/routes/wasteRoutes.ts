import { Router } from 'express';
import { getWasteRecords, createWasteRecord } from '../controllers/wasteController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getWasteRecords);
router.post('/', createWasteRecord);

export default router;
