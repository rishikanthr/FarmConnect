// backend/scripts/fixFarmerIds.js
import mongoose from "mongoose";
import Product from "../models/product.js";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const products = await Product.find();

for (const product of products) {
  if (typeof product.farmerId === "string") {
    const farmer = await User.findOne({ _id: product.farmerId });
    if (farmer) {
      product.farmerId = farmer._id;
      await product.save();
    }
  }
}

process.exit();
