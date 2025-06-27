import express from "express";
import { getWallet, topUpWallet } from "../controllers/walletController.js";

const router = express.Router();

router.get("/:userId", getWallet);
router.post("/topup", topUpWallet);

export default router;
