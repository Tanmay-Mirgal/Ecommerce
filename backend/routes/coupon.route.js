import {Router} from 'express';
import {protectedRoute} from '../middlewares/auth.middleware.js';
import {getCoupons,ValidateCoupon} from '../controllers/coupon.controller.js';


const router = Router();

router.get('/',protectedRoute,getCoupons);
router.get('/validate',protectedRoute,ValidateCoupon);


export default router;