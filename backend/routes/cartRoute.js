import express from "express";
import { addToCart, getCart, removeFromCart, checkoutCart } from "../controllers/cartController.js";
const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.post("/remove", removeFromCart);
router.post("/checkout", checkoutCart);

export default router;
