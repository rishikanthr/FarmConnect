import Product from "../models/product.js";
import User from "../models/user.js";

// GET Farmer Dashboard Data
export const getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user.id; // from JWT middleware

    // Get farmer details
    const farmer = await User.findById(farmerId).select("-password");

    if (!farmer || farmer.role !== "farmer") {
      return res.status(403).json({ error: "Access denied: Farmers only." });
    }

    // Get products listed by the farmer
    const products = await Product.find({ farmerId });

    res.json({
      profile: farmer,
      totalProducts: products.length,
      products,
    });

  } catch (err) {
    console.error("Farmer Dashboard Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
