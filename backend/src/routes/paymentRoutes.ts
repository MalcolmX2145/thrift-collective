import { Router } from 'express';
import { initiatePayment, mpesaCallback } from '../controllers/paymentController';

const router = Router();

router.post('/initiate', initiatePayment);
router.post('/callback', mpesaCallback); // Public endpoint for Safaricom

export default router;
