// middleware/authUser.js
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // ✅ Adjust this path if needed

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
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

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authenticateUser;
