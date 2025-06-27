// server.js
//---------------------------------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

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

// ────────────── HTTP + Socket.IO setup ────────────
const httpServer = http.createServer(app);
io = new SocketIOServer(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("🔌 socket connected", socket.id);      // <== D
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("🏠 joined room", userId, "socket", socket.id); // <== E
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
