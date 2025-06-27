import Cart from "../models/cart.js";

export const addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: "Missing userId or productId" });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, products: [{ productId }] });
    } else {
      const existing = cart.products.find((p) => p.productId.equals(productId));
      if (existing) existing.quantity += 1;
      else cart.products.push({ productId });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error("🔥 Add to cart error:", err.message);
    res.status(500).json({ error: err.message || "Failed to add to cart" });
  }
};


export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId");
    if (!cart) return res.json({ products: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } },
      { new: true }
    ).populate("products.productId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};