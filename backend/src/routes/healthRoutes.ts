import { Router } from 'express';
import { checkHealth } from '../controllers/healthController';

export const router = Router();

router.get('/health', checkHealth);
