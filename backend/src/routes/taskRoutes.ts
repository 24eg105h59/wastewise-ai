import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', requireRole(['ADMIN', 'STAFF']), createTask);
router.put('/:id', updateTask);
router.delete('/:id', requireRole(['ADMIN']), deleteTask);

export default router;
