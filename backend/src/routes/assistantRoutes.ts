import { Router } from 'express';
import { chatWithAssistant } from '../controllers/assistantController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

// POST /api/assistant/chat (and /chat)
router.post('/chat', chatWithAssistant);
router.post('/', chatWithAssistant);

export default router;
