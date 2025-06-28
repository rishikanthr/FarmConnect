// server.js
//---------------------------------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { Server as SocketIOServer } from "socket.io";
import Chat from "./models/chat.js"; // import Chat model

// route files
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

dotenv.config();

// ────────────────── Express App ──────────────────
const app = express();
app.use(express.json());
app.use(cors());

// ───────────── expose io to controllers ───────────
let io = null; // will be assigned after http server created
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ───────────────────── Routes ─────────────────────
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
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ────────────── HTTP + Socket.IO setup ────────────
const httpServer = http.createServer(app);
io = new SocketIOServer(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", async (msgData) => {
    const saved = await Chat.create({ ...msgData, delivered: true });
    io.to(msgData.receiverId).emit("newMessage", saved);
  });

  socket.on("markSeen", async ({ senderId, receiverId }) => {
    await Chat.updateMany(
      { senderId, receiverId, seen: false },
      { $set: { seen: true } }
    );
    io.to(senderId).emit("messagesSeen", { from: receiverId });
  });
});


// ────────────────── Start Server ──────────────────
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    httpServer.listen(PORT, () =>
      console.log(`🚀 Server & Socket.IO running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
