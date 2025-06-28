import Order from "../models/Order.js";

// Place an order during checkout
export const placeOrder = async (req, res) => {
  const { consumerId, productId, farmerId, quantity, totalPrice } = req.body;

  if (!consumerId || !productId || !farmerId || !quantity || !totalPrice) {
    return res.status(400).json({ error: "Missing required order details." });
  }

  try {
    const order = new Order({
      consumerId,
      productId,
      farmerId,
      quantity,
      totalPrice,
      status: "Pending", // Default status
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// GET /api/orders/track
export const getTrackedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumerId: req.user.id })
      .populate("productId", "title")
      .populate("farmerId", "name")
      .sort({ createdAt: -1 });

    const formatted = orders.map((o) => ({
      id: o._id,
      productTitle: o.productId?.title || "Unknown",
      farmerName: o.farmerId?.name || "Unknown",
      quantity: o.quantity,
      price: o.totalPrice,
      status: o.status,
      orderedAt: o.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Tracked orders error:", err);
    res.status(500).json({ message: "Failed to fetch tracked orders" });
  }
};

// PATCH /api/orders/status or /track/:id
export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  const validStatuses = ["Pending", "Shipped", "Delivered"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found." });

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
