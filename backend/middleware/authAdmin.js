/*import jwt from 'jsonwebtoken';

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role != 'admin') {
        console.log(decoded.role);
        return res.status(403).json({ message: "Admin access required." });
    }

    req.user = decoded; // attach user info to request
    next(); // allow route handler to continue
  } catch (err) {
    console.log(err);
    console.error("Token verification error:", err.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authenticateAdmin;
*/
import jwt from "jsonwebtoken";

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧠 LOG for DEBUG
    console.log("Decoded Token:", decoded);

    if (decoded.role !== 'admin') {
        console.log("User Role:", decoded.role);
      return res.status(403).json({ error: "Access denied: Admins only." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ error: "Invalid or malformed token." });
  }
};

export default authenticateAdmin;
