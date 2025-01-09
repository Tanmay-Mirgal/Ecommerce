import {Router} from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { createCheckoutSession } from '../controllers/payment.controller.js';

const router = Router();
router.post('/create-checkout-session',protectedRoute,createCheckoutSession);
export default router;