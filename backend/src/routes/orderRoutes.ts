import { Router } from 'express';
import { createNewOrder, getOrder, getUserOrders } from '../controllers/orderController';

const router = Router();

router.post('/', createNewOrder);
router.get('/user/:userId', getUserOrders);
router.get('/:id', getOrder);

export default router;
