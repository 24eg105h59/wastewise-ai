import { Router } from 'express';
import { register, login, getUsers, addStaff } from '../controllers/authController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', authenticate, requireRole(['ADMIN']), getUsers);
router.post('/staff', authenticate, requireRole(['ADMIN']), addStaff);

export default router;
