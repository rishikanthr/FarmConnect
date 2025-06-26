import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AllProducts from "../components/AllProducts";
import SearchByTitle from "../components/SearchByTitle";
import SearchByFarmerId from "../components/SearchByFarmerId";
import LogOutButton from "../components/LogOutButton";

const ConsumerDashboard = () => {
  const [consumerData, setConsumerData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();        // for “Chat” button

  /* ───────────────── fetch profile/message once ───────────────── */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/consumer/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConsumerData(res.data);       // { message, name, email, role, id }
      } catch (err) {
        console.error("Dashboard error", err);
        setError("Failed to load dashboard");
      }
    })();
  }, []);

  /* ───────────────── UI states ───────────────── */
  if (error)        return <div className="text-red-500 p-4">{error}</div>;
  if (!consumerData) return <div className="text-gray-600 p-4">Loading…</div>;

  /* ───────────────── markup ───────────────── */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Consumer Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/chat")}
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
          >
            Chat
          </button>
          <LogOutButton />
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white shadow p-6 rounded-lg">
        <p className="text-lg font-semibold text-green-600 mb-4">
          {consumerData.message}, {consumerData.name}!
        </p>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {consumerData.name}</p>
          <p><span className="font-medium">Email:</span> {consumerData.email}</p>
          <p><span className="font-medium">Role:</span> {consumerData.role}</p>
          <p><span className="font-medium">User&nbsp;ID:</span> {consumerData.id}</p>
        </div>
      </div>

      {/* Search by product title */}
      <div className="bg-white shadow p-6 rounded-lg">
        <SearchByTitle />
      </div>

      {/* Search by farmer ID */}
      <div className="bg-white shadow p-6 rounded-lg">
        <SearchByFarmerId />
      </div>

      {/* All products list */}
      <div className="bg-white shadow p-6 rounded-lg">
        <AllProducts />
      </div>
    </div>
  );
};

export default ConsumerDashboard;
