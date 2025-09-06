import { Router } from "express";
import { addToCart, getCartItems, removeItemFromCart, updateItemQuantity } from "./cart.controller";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();

router.post("/cart/add", isAuthenticated, addToCart); // POST { userId, productId, quantity }
router.get("/cart", isAuthenticated, getCartItems);       
router.patch("/cart/item/:itemId", isAuthenticated, updateItemQuantity);
router.delete("/cart/item/:itemId", isAuthenticated, removeItemFromCart);

export default router;
