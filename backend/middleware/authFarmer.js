// middleware/authFarmer.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";          // ⬅️  make sure the path is correct

const authenticateFarmer = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // 2) Check role
    if (decoded.role !== "farmer") {
      return res.status(403).json({ error: "Access denied: Farmers only." });
    }

    // 3) Pull live user record to check ban / restriction
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 3a) Permanent ban
    if (user.status === "banned") {
      return res.status(403).json({ error: "Account banned." });
    }

    // 3b) Temporary restriction
    if (user.restrictedUntil && user.restrictedUntil > new Date()) {
      return res.status(403).json({
        error: `Account restricted until ${user.restrictedUntil.toLocaleString()}`,
      });
    }

    // 4) Attach user and proceed
    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default authenticateFarmer;
