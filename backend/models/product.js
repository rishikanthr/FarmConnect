import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerName: String,
    farmerEmail: String,
    farmerLocation: String,
    title: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    certifiedOrganic: Boolean,
    imageURL: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
