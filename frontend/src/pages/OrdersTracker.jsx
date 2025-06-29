import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const OrdersTracker = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/orders/track`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-indigo-700 font-semibold">
        Loading your tracked orders...
      </div>
    );

  if (!orders.length)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600 font-medium">
        No tracked orders yet.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg border border-white/40 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          📦 My Orders Tracker
        </h1>

        <ul className="space-y-6">
          {orders.map((o) => (
            <li
              key={o.id}
              className="border border-gray-200 rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1 text-gray-700">
                <p>
                  <strong>Product:</strong> {o.productTitle}
                </p>
                <p>
                  <strong>Farmer:</strong> {o.farmerName}
                </p>
                <p>
                  <strong>Quantity:</strong> {o.quantity} kg
                </p>
                <p>
                  <strong>Ordered at:</strong>{" "}
                  {new Date(o.orderedAt).toLocaleString()}
                </p>
              </div>
              <div
                className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                  o.status === "Pending"
                    ? "bg-yellow-500"
                    : o.status === "Shipped"
                    ? "bg-blue-500"
                    : "bg-green-600"
                }`}
              >
                {o.status}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersTracker;
