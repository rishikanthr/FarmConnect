import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmerId: { type: String, required: true },
    title: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    certifiedOrganic: Boolean,
    imageURL: String, // will store uploaded image URL or path
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
