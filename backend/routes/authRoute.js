import express from "express";
import User from "../models/user.js"; 
import { register, login } from "../controllers/authController.js";
import  checkUserStatus  from "../middleware/checkUserStatus.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login , checkUserStatus);

export default router;
