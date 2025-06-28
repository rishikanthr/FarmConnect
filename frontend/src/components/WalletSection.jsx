import { use, useEffect, useState } from "react";
import axios from "axios";

const WalletSection = ({ userId }) => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTopping, setIsTopping] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [animateBalance, setAnimateBalance] = useState(false);

  const fetchWallet = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/wallet/${userId}`);
      console.log(userId);
      setWallet(res.data);
    } catch (err) {
      console.error("Failed to fetch wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopUp = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      return alert("Enter valid amount");
    }

    setIsTopping(true);
    try {
      const res = await axios.post("http://localhost:3000/api/wallet/topup", {
        userId,
        amount: amt,
      });
      setWallet(res.data);
      setAmount("");
      setShowTopUp(false);
      setAnimateBalance(true);
      setTimeout(() => setAnimateBalance(false), 1000);
      alert("Wallet topped up!");
    } catch (err) {
      alert("Top-up failed");
    } finally {
      setIsTopping(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000];

  useEffect(() => {
    if (userId) fetchWallet();
  }, [userId]);

  if (!userId) {
    return (
      <div className="p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl border border-red-200 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
        <p className="text-red-700 font-semibold text-lg">Please login to view wallet</p>
      </div>
    );
  }

  if (isLoading || !wallet) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-3xl p-8 shadow-2xl animate-pulse">
        <div className="space-y-6">
          <div className="h-8 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-2xl animate-pulse" />
          <div className="h-16 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-indigo-200 rounded-xl animate-pulse" />
            <div className="h-12 bg-purple-200 rounded-xl animate-pulse" />
            <div className="h-12 bg-pink-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/80 via-indigo-600/80 to-purple-600/80 rounded-3xl" />

      {/* Decorative Blurred Orbs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-pink-400/30 rounded-full blur-2xl animate-pulse delay-1000" />

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Digital Wallet</h3>
              <p className="text-white/80 text-sm">Secure & Instant Payments</p>
            </div>
          </div>

          <button
            onClick={() => setShowTopUp(!showTopUp)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-2xl border border-white/30 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* Wallet Balance */}
        <div className="mb-8">
          <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-inner">
            <p className="text-white/80 text-sm font-medium mb-2">Current Balance</p>
            <div className={`flex items-baseline space-x-2 ${animateBalance ? 'animate-bounce' : ''}`}>
              <span className="text-5xl font-bold text-white">₹{wallet.balance.toLocaleString("en-IN")}</span>
              <span className="text-white/60 text-lg">.{(wallet.balance % 1).toFixed(2).split(".")[1]}</span>
            </div>
          </div>
        </div>

        {/* Top-up Form */}
        {showTopUp && (
          <div className="mb-8 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 animate-fade-in">
            <h4 className="text-xl font-bold text-white mb-4">⚡ Quick Top-up</h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="bg-white/15 hover:bg-white/25 text-white font-semibold py-3 px-4 rounded-2xl border border-white/30 transition-all duration-300 hover:scale-105"
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 font-semibold">₹</div>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl pl-8 pr-4 py-4 text-white placeholder-white/50 focus:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300"
                />
              </div>

              <button
                onClick={handleTopUp}
                disabled={isTopping || !amount}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isTopping ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>💳</span>
                    <span>Add Money</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fade In Animation Style */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WalletSection;
