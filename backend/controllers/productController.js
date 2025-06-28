import Product from "../models/product.js";

/* Farmer: only delete if he owns the product */
export const deleteProductFarmer = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      farmerId: req.user.id, // only owner
    });
    if (!product) return res.status(403).json({ message: "Not your product." });

    await product.deleteOne();
    res.json({ message: "Product deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* Admin: delete any product */
export const deleteProductAdmin = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.productId);
    if (!result) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted by admin." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
