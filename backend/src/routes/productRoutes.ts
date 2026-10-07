import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

// STAFF and ADMIN can view and update
router.get('/', requireRole(['ADMIN', 'STAFF']), getProducts);
router.put('/:id', requireRole(['ADMIN', 'STAFF']), updateProduct);

// Only ADMIN can create or delete inventory
router.post('/', requireRole(['ADMIN']), createProduct);
router.delete('/:id', requireRole(['ADMIN']), deleteProduct);

export default router;
