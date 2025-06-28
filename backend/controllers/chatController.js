import Chat from "../models/chat.js";
import User from "../models/user.js";
import mongoose from "mongoose";

/* Send a new message */
export const sendMessage = async (req, res) => {
  try {
    const newMsg = await Chat.create({
      senderId: req.user.id,
      receiverId: req.body.recipientId,
      message: req.body.message,
    });

    req.io.to(req.user.id).emit("newMessage", newMsg);
    req.io.to(req.body.recipientId).emit("newMessage", newMsg);

    res.status(201).json(newMsg);
  } catch (err) {
    console.error("controller error", err);
    res.status(500).json({ message: "Send failed" });
  }
};


/* Get full conversation between two users */
export const getConversation = async (req, res) => {
  try {
    const { partnerId } = req.params;          // matches route
    const msgs = await Chat.find({
      $or: [
        { senderId: req.user.id, receiverId: partnerId },
        { senderId: partnerId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    console.error("conversation error", err);
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* Simple user lookup by email or ID (to start a chat) */
// controllers/chatController.js

export const findUser = async (req, res) => {
  try {
    const { query } = req.query; // can be email, name, or _id

    // 1️⃣ try email
    let user = await User.findOne({ email: query }).select("_id name email role");

    // 2️⃣ try name (case-insensitive)
    if (!user) {
      user = await User.findOne({ name: new RegExp(`^${query}$`, "i") }).select(
        "_id name email role"
      );
    }

    // 3️⃣ try ObjectId, but only if query looks valid
    if (!user && mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findById(query).select("_id name email role");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("findUser error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

