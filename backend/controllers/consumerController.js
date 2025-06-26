// Controller: consumerDashboard.js
import User from "../models/user.js";

export const getConsumerDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // you got this from JWT middleware

    const user = await User.findById(userId).select("-password"); // exclude password

    if (!user || user.role !== "consumer") {
      return res.status(403).json({ message: "Access denied: Consumers only" });
    }
    console.log("Consumer dashboard user:", user);
    res.json({
      message: "Welcome to your Consumer Dashboard",
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Consumer dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
