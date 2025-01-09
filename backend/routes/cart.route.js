import { Router } from "express";
import { addToCart, getCart, removeFromCart, updateTheQuantity } from "../controllers/cart.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add-to-cart", protectedRoute, addToCart);
router.get("/get-cart", protectedRoute, getCart);
router.delete("/remove-from-cart", protectedRoute, removeFromCart);
router.patch("/update-quantity", protectedRoute, updateTheQuantity);

export default router;
