import Wallet from "../models/wallet.js";

export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) {
      const newWallet = await Wallet.create({ userId: req.params.userId, balance: 0 });
      return res.json(newWallet);
    }
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
};

export const topUpWallet = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid top-up amount" });
    }
    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { upsert: true, new: true }
    );
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: "Top-up failed" });
  }
};

const handleCheckout = async () => {
  try {
    await axios.post("http://localhost:3000/api/cart/checkout", { userId });
    alert("Purchase successful");
    const res = await axios.get(`http://localhost:3000/api/cart/${userId}`);
    setCart(res.data);
  } catch (err) {
    console.error(err.response?.data || err);
    if (err.response?.data?.error === "Insufficient wallet balance") {
      alert("Not enough balance in wallet. Please top up.");
    } else {
      alert("Checkout failed");
    }
  }
};
