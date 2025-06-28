import Cart from "../models/cart.js";
import Product from "../models/product.js";
import Wallet from "../models/wallet.js";
import Order from "../models/Order.js";

// Add to Cart
export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid input. Quantity must be a positive number." });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found." });
    if (product.stock < quantity)
      return res.status(400).json({ error: `Only ${product.stock} kg available.` });

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, products: [{ productId, quantity }] });
    } else {
      const existing = cart.products.find((p) => p.productId.equals(productId));
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > product.stock)
          return res.status(400).json({ error: `Only ${product.stock} kg available.` });
        existing.quantity = newQuantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart." });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId");
    if (!cart) return res.json({ products: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Remove from Cart
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

// Checkout
export const checkoutCart = async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart?.products.length)
      return res.status(400).json({ error: "Cart is empty" });

    let total = 0;
    const sellerPayments = {};

    for (let { productId: product, quantity } of cart.products) {
      if (quantity > product.stock)
        return res.status(400).json({ error: `Not enough stock for ${product.title}` });

      const itemTotal = product.price * quantity;
      total += itemTotal;

      const seller = product.farmerId.toString();
      sellerPayments[seller] = (sellerPayments[seller] || 0) + itemTotal;
    }

    const buyerWallet = await Wallet.findOne({ userId });
    if (!buyerWallet || buyerWallet.balance < total)
      return res.status(400).json({ error: "Insufficient wallet balance." });

    // process orders
    for (let { productId: product, quantity } of cart.products) {
      const sellerId = product.farmerId.toString();
      const itemTotal = product.price * quantity;

      await Wallet.findOneAndUpdate({ userId: sellerId }, { $inc: { balance: itemTotal } }, { upsert: true });
      product.stock -= quantity;
      await product.save();

      await Order.create({
        consumerId: userId,
        farmerId:   sellerId,
        productId:  product._id,
        quantity,
        totalPrice: itemTotal,
        status: "Pending"
      });
    }

    buyerWallet.balance -= total;
    await buyerWallet.save();

    cart.products = [];
    await cart.save();

    res.json({ message: "Purchase successful", totalPaid: total, paidTo: sellerPayments });

  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
};