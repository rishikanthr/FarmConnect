import Cart from "../models/cart.js";
import Product from "../models/product.js";
import Wallet from "../models/wallet.js";

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Basic validation
  if (!userId || !productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid input. Quantity must be a positive number." });
  }

  try {
    // Check product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        error: `Only ${product.stock} kg available for "${product.title}".`,
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, products: [{ productId, quantity }] });
    } else {
      const existing = cart.products.find((p) => p.productId.equals(productId));

      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({
            error: `Total quantity exceeds available stock. Only ${product.stock} kg available.`,
          });
        }
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
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let total = 0;
    const sellerPayments = {}; // sellerId -> amount

    // Validate all products before charging
    for (const item of cart.products) {
      const product = item.productId;

      if (!product || !product.farmerId) {
        return res.status(400).json({ error: `Invalid product in cart.` });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          error: `Not enough stock for "${product.title}". Available: ${product.stock} kg.`,
        });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      const sellerId = product.farmerId.toString();
      sellerPayments[sellerId] = (sellerPayments[sellerId] || 0) + itemTotal;
    }

    // Check buyer's wallet
    const buyerWallet = await Wallet.findOne({ userId });
    if (!buyerWallet || buyerWallet.balance < total) {
      return res.status(400).json({ error: "Insufficient wallet balance." });
    }

    // Distribute payment and update stock
    for (const item of cart.products) {
      const product = item.productId;
      const sellerId = product.farmerId.toString();
      const itemTotal = product.price * item.quantity;

      // Pay seller
      await Wallet.findOneAndUpdate(
        { userId: sellerId },
        { $inc: { balance: itemTotal } },
        { upsert: true, new: true }
      );

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Deduct from buyer's wallet
    buyerWallet.balance -= total;
    await buyerWallet.save();

    // Clear cart
    cart.products = [];
    await cart.save();

    res.json({ message: "Purchase successful", totalPaid: total, paidTo: sellerPayments });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
};
