import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddProduct from "../components/AddProduct";
import LogoutButton from "../components/LogOutButton";
import ImagePredictor from "../components/ImagePredictor";
import AskAI from "../components/AskAI";

const FarmerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/farmer/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    }
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:3000/api/products/delete/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDashboardData((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p._id !== productId),
        totalProducts: prev.totalProducts - 1,
      }));
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!dashboardData) return <div className="text-gray-500 p-4">Loading...</div>;

  const { profile, totalProducts, products } = dashboardData;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Farmer Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/chat")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Chat
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile Info</h2>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Farmer ID:</strong> {profile._id}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Location:</strong> {profile.location}</p>
      </div>

      {/* Add Product Form */}
      <AddProduct onProductAdded={fetchDashboard} />
      <ImagePredictor />
      <AskAI />
      {/* Product List */}
      <div className="bg-white shadow p-4 rounded mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Products ({totalProducts})</h2>
        {products.length === 0 ? (
          <p>No products listed yet.</p>
        ) : (
          <ul className="space-y-2">
            {products.map((product) => (
              <li key={product._id} className="border p-3 rounded flex justify-between items-start">
                <div>
                  <p><strong>Name:</strong> {product.title}</p>
                  <p><strong>Price:</strong> ₹{product.price}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                </div>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 h-fit"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
