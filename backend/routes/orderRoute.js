import express from "express";
import authUser from "../middleware/authUser.js";
import {
  placeOrder,
  updateOrderStatus,
  getTrackedOrders
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", authUser, placeOrder);
router.patch("/status", updateOrderStatus); // Optional for admins/farmers
router.get("/track", authUser, getTrackedOrders);
router.patch("/track/:orderId", authUser, updateOrderStatus);

export default router;
