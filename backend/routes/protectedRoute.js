import express from "express";
import { authMiddleware } from "../controllers/authController.js";

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.user.id });
});

export default router;
