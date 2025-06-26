import User from "../models/user.js";

const checkUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.status === "banned") {
      return res.status(403).json({ message: "Your account has been banned." });
    }

    if (user.restrictedUntil && user.restrictedUntil > new Date()) {
      return res.status(403).json({
        message: `Your account is restricted until ${user.restrictedUntil.toLocaleString()}`,
      });
    }

    next();
  } catch (err) {
    console.error("checkUserStatus error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default checkUserStatus;
