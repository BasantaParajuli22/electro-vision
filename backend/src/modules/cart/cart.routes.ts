import { Router } from "express";
import { addToCart, getCartItems, removeItemFromCart, updateItemQuantity } from "./cart.controller";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", isAuthenticated, getCartItems);       
router.post("/add", isAuthenticated, addToCart); // POST { userId, productId, quantity }
router.patch("/item/:itemId", isAuthenticated, updateItemQuantity);
router.delete("/item/:itemId", isAuthenticated, removeItemFromCart);

export default router;
