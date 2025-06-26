import express from "express";
import User from "../models/user.js"; 
import { getConsumerDashboard } from "../controllers/consumerController.js";
import authenticateConsumer from "../middleware/authConsumer.js";
import authenticateUser from "../middleware/authUser.js";

const router = express.Router();

router.get("/dashboard", authenticateUser , authenticateConsumer , getConsumerDashboard);

export default router;
