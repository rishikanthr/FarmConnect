import express from "express";
import { getFarmerDashboard } from "../controllers/farmerController.js";
import { authMiddleware } from "../controllers/authController.js";
import authenticateFarmer from "../middleware/authFarmer.js";

const router = express.Router();

router.get("/dashboard", authenticateFarmer , authMiddleware, getFarmerDashboard);

export default router;
