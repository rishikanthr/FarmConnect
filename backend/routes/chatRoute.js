import express from "express";
import authenticateUser from "../middleware/authUser.js";
import { sendMessage, getConversation, findUser } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", authenticateUser, sendMessage);
router.get("/with/:partnerId", authenticateUser, getConversation); // 👈 param is partnerId
router.get("/find", authenticateUser, findUser);

export default router;
