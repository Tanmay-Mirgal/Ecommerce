import {Router} from 'express';
import { isAdmin, protectedRoute } from '../middlewares/auth.middleware.js';
import { getAllProducts ,getFeaturedProducts,createProduct,deleteProduct,getRecommendedProducts,getCategoryProducts,toggleFeaturedProducts} from '../controllers/product.controller.js';


const router = Router();

router.get('/',protectedRoute,isAdmin,getAllProducts);
router.get('/featured',getFeaturedProducts);
router.get('/category/:category',getCategoryProducts);
router.get('/recommended',getRecommendedProducts);
router.post('/create',protectedRoute,isAdmin,createProduct);
router.patch('/:id',protectedRoute,isAdmin,toggleFeaturedProducts);
router.delete('/:id',protectedRoute,isAdmin,deleteProduct);

export  default router;