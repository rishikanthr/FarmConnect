// backend/scripts/farmerEmbedInfo.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.js";
import User from "../models/user.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not set in .env");
  process.exit(1);
}

const enrichProductsWithFarmerInfo = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const products = await Product.find();

    for (const product of products) {
      const farmer = await User.findById(product.farmerId);

      if (!farmer) {
        console.warn(`⚠️ Farmer not found for product ${product.title} (${product._id})`);
        continue;
      }

      product.farmerName = farmer.name;
      product.farmerEmail = farmer.email;
      product.farmerLocation = farmer.location;

      await product.save();
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

enrichProductsWithFarmerInfo();
