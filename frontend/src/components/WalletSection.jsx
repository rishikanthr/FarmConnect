import { useEffect, useState } from "react";
import axios from "axios";

const WalletSection = ({ userId }) => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/wallet/${userId}`);
      setWallet(res.data);
    } catch (err) {
      console.error("Failed to fetch wallet");
    }
  };

  const handleTopUp = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert("Enter valid amount");

    try {
      const res = await axios.post("http://localhost:3000/api/wallet/topup", {
        userId,
        amount: amt,
      });
      setWallet(res.data);
      setAmount("");
      alert("Wallet topped up!");
    } catch (err) {
      alert("Top-up failed");
    }
  };

  useEffect(() => {
    if (userId) fetchWallet();
  }, [userId]);

  if (!userId) return <p className="text-red-600">Please login to view wallet</p>;
  if (!wallet) return <p>Loading wallet…</p>;

  return (
    <div className="p-4 bg-white rounded shadow mt-6">
      <h3 className="text-xl font-bold mb-2 text-green-800">💰 Wallet</h3>
      <p className="mb-4">Current Balance: ₹{wallet.balance.toFixed(2)}</p>

      <div className="flex gap-2 items-center">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-3 py-1 rounded w-32"
        />
        <button
          onClick={handleTopUp}
          className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
        >
          Top Up
        </button>
      </div>
    </div>
  );
};

export default WalletSection;
