import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import LogOutButton from "../components/LogOutButton";
import CartButton from "../components/CartButton";
import WalletSection from "../components/WalletSection";
import AllProducts from "../components/AllProducts";

const ConsumerDashboard = () => {
  const [consumerData, setConsumerData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/consumer/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConsumerData(res.data); // { message, name, email, role, id }
      } catch (err) {
        console.error("Dashboard error", err);
        setError("Failed to load dashboard");
      }
    })();
  }, []);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!consumerData) return <div className="text-gray-600 p-4">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Top: Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">Consumer Dashboard</h1>
        <div className="flex gap-3">
          <CartButton />
          <button
            onClick={() => navigate("/chat")}
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
          >
            Chat
          </button>
          <LogOutButton />
        </div>
      </div>

      {/* Row: Profile on left, Wallet on right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow p-6 rounded-lg">
          <p className="text-lg font-semibold text-green-600 mb-4">
            {consumerData.message}, {consumerData.name}!
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-medium">👤 Name:</span> {consumerData.name}</p>
            <p><span className="font-medium">📧 Email:</span> {consumerData.email}</p>
            <p><span className="font-medium">🧑‍🌾 Role:</span> {consumerData.role}</p>
            <p><span className="font-medium">🆔 User ID:</span> {consumerData.id}</p>
          </div>
        </div>

        <div className="bg-white shadow p-6 rounded-lg">
          <WalletSection userId={consumerData.id} />
        </div>
      </div>

      {/* Center: Search Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">🔍 Search by Title</h2>
            <p className="text-sm text-gray-600 mb-4">
              Find products using their name/title.
            </p>
          </div>
          <button
            onClick={() => navigate("/search-title")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Go to Search by Title
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-green-700 mb-2">🔍 Search by Farmer</h2>
            <p className="text-sm text-gray-600 mb-4">
              Find products by farmer name or ID.
            </p>
          </div>
          <button
            onClick={() => navigate("/search-farmer")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Go to Search by Farmer
          </button>
        </div>
      </div>

      {/* Bottom: All Products */}
      <div className="bg-white shadow p-6 rounded-lg">
        <AllProducts />
      </div>
    </div>
  );
};

export default ConsumerDashboard;
