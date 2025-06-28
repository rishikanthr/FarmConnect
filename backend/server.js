// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";
import Chat from "./models/chat.js";

// Routes
import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import farmerRoutes from "./routes/farmerRoute.js";
import consumerRoutes from "./routes/consumerRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import predictRoute from "./routes/predictRoute.js";
import aiRoute from "./routes/aiRoute.js";
import cartRoute from "./routes/cartRoute.js";
import walletRoutes from "./routes/walletRoute.js";
import orderRoutes from "./routes/orderRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Create uploads folder if it doesn't exist
import fs from "fs";
const uploadPath = "./uploads";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// ⛳️ Static file serving for uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ⛳️ Assign socket.io to requests
let io = null;
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ⛳️ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/predict", predictRoute);
app.use("/api/ai", aiRoute);
app.use("/api/cart", cartRoute);
app.use("/api/wallet", walletRoutes);
app.use("/api/orders", orderRoutes);

// ⛳️ Create HTTP + Socket.io Server
const httpServer = http.createServer(app);
io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🟢 Socket.IO Events
io.on("connection", (socket) => {
  console.log("⚡ New client connected");

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", async (msgData) => {
    try {
      const saved = await Chat.create({ ...msgData, delivered: true });
      io.to(msgData.receiverId).emit("newMessage", saved);
    } catch (err) {
      console.error("Message send error:", err);
    }
  });

  socket.on("markSeen", async ({ senderId, receiverId }) => {
    try {
      await Chat.updateMany(
        { senderId, receiverId, seen: false },
        { $set: { seen: true } }
      );
      io.to(senderId).emit("messagesSeen", { from: receiverId });
    } catch (err) {
      console.error("Seen update error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// ⛳️ Start Server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    httpServer.listen(PORT, () =>
      console.log(`🚀 Server & Socket.IO running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
