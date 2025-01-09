import {Router} from 'express';
import {protectedRoute} from '../middlewares/auth.middleware.js';
import {createCoupon,deleteCoupon,getCoupon,getCoupons,updateCoupon} from '../controllers/coupon.controller.js';


const router = Router();

router.post('/create',protectedRoute,createCoupon); 
router.get('/get-coupons',protectedRoute,getCoupons);
router.get('/get-coupon/:id',protectedRoute,getCoupon);
router.patch('/update-coupon/:id',protectedRoute,updateCoupon);
router.delete('/delete-coupon/:id',protectedRoute,deleteCoupon);

export default router;