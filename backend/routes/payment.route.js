import {Router} from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { createCheckoutSession, checkoutSuccess } from '../controllers/payment.controller.js';

const router = Router();
router.post('/create-checkout-session',protectedRoute,createCheckoutSession);
router.post("/checkout-success", protectedRoute, checkoutSuccess);
export default router;