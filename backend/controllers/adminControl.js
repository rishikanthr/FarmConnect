import User from '../models/user.js';
import Product from '../models/product.js';

// Get all consumers
export const getAllConsumers = async (req, res) => {
  try {
    const consumers = await User.find({ role: 'consumer' });
    res.status(200).json(consumers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all farmers
export const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' });
    res.status(200).json(farmers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (_, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const restrictUserOneDay = async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, {
    restrictedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  res.json({ message: "User restricted for 1 day." });
};

export const restrictUserSevenDays = async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, {
    restrictedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  res.json({ message: "User restricted for 7 days." });
};

export const banUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, { status: "banned" });
  res.json({ message: "User permanently banned." });
};

export const unbanUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      status: "active",
      restrictedUntil: null,
    });
    res.json({ message: "User unbanned / restriction lifted." });
  } catch (err) {
    console.error("Unban error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};