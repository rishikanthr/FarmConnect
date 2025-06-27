import Cart from "../models/cart.js";
import Product from "../models/product.js";
import Wallet from "../models/wallet.js";

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, products: [{ productId, quantity }] });
    } else {
      const existing = cart.products.find((p) => p.productId.equals(productId));
      if (existing) existing.quantity += quantity;
      else cart.products.push({ productId, quantity });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart" });
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

export const checkoutCart = async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    let total = 0;
    for (const item of cart.products) {
      total += item.productId.price * item.quantity;
    }

    const buyerWallet = await Wallet.findOne({ userId });
    if (!buyerWallet || buyerWallet.balance < total)
      return res.status(400).json({ error: "Insufficient wallet balance" });

    for (const item of cart.products) {
      const product = item.productId;
      const sellerId = product.farmerId;
      await Wallet.findOneAndUpdate(
        { userId: sellerId },
        { $inc: { balance: item.productId.price * item.quantity } },
        { upsert: true, new: true }
      );
      product.stock -= item.quantity;
      await product.save();
    }

    buyerWallet.balance -= total;
    await buyerWallet.save();

    cart.products = [];
    await cart.save();

    res.json({ message: "Purchase successful" });
  } catch (err) {
    res.status(500).json({ error: "Checkout failed" });
  }
};
