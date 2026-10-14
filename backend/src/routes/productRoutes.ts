import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

// STAFF and ADMIN can view and update
router.get('/', requireRole(['ADMIN', 'STAFF']), getProducts);
router.put('/:id', requireRole(['ADMIN', 'STAFF']), updateProduct);

// STAFF and ADMIN can create inventory
router.post('/', requireRole(['ADMIN', 'STAFF']), createProduct);
router.delete('/:id', requireRole(['ADMIN']), deleteProduct);

export default router;
