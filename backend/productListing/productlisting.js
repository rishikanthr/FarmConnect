import Product from "../models/product.js";
import User from "../models/user.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

/* Add new product with image upload */
export const addProduct = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const {
      title,
      description,
      price,
      stock,
      category,
      certifiedOrganic,
    } = req.body;

    const farmer = await User.findById(farmerId);
    if (!farmer || farmer.role !== "farmer") {
      return res.status(403).json({ error: "Only farmers can add products" });
    }

    const baseURL = process.env.BASE_URL;
    // Get image path
    const imageURL = req.file
      ? `${baseURL}/uploads/${req.file.filename}`
      : "";

    const newProduct = new Product({
      farmerId,
      farmerName: farmer.name,            // ✅ embed farmer name
      farmerEmail: farmer.email,          // ✅ embed farmer email
      farmerLocation: farmer.location,    // ✅ embed farmer location
      title,
      description,
      price,
      stock,
      category,
      certifiedOrganic,
      imageURL,
    });

    await newProduct.save();
    console.log("✅ New product added:", newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Error adding product:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* Other existing functions like getAllProducts, getProductsByFarmer, etc. remain unchanged */


// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gte: 0 } })
      .populate("farmerId", "name email location") // 👈 only selected fields
      .sort({ updatedAt: -1 });
    console.log(products);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
 


// Get products by farmer
export const getProductsByFarmer = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;
    const products = await Product.find({ farmerId });
    console.log(products);
    res.json(products);
  } catch (err) {
    console.log("Error fetching products by farmer:", err);
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const getProductsByTitle = async (req, res) => {
  try {
    const title = req.params.title;

    // Case-insensitive partial-match
    const products = await Product.find({
      title: { $regex: title, $options: "i" },
    });

    if (products.length === 0) {
      // Nothing found → respond 404 + message
      console.log("No products found for title:", title);
      return res.status(404).json({ message: "Out of stock" });
    }

    // Return the matching products
    console.log("Found products:", products);
    res.status(200).json(products);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
};

//  GET /api/products/by-farmer-name/:name
export const getProductsByFarmerName = async (req, res) => {
  try {
    const name = req.params.name;

    // 1. Find all farmers whose name matches (case-insensitive)
    const farmers = await User.find({
      role: "farmer",
      name: { $regex: name, $options: "i" },
    }).select("_id");

    if (farmers.length === 0) {
      return res.status(404).json({ message: "No farmer found with that name." });
    }

    // 2. Collect their ids and fetch every product belonging to them
    const farmerIds = farmers.map((f) => f._id);
    const products = await Product.find({ farmerId: { $in: farmerIds } });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products for this farmer." });
    }

    res.json(products);
  } catch (err) {
    console.error("Error searching by farmer name:", err);
    res.status(500).json({ error: "Server error" });
  }
};  