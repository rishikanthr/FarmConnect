import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LogOutButton from "../components/LogOutButton";
import AllProducts from "../components/AllProducts"; // This shows the full product list

const BASE_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/allProducts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
        <LogOutButton />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          onClick={() => navigate("/admin/consumers")}
          className="cursor-pointer bg-gradient-to-br from-green-100 to-lime-100 p-6 rounded-lg shadow hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold text-green-800 mb-2">👥 Manage Consumers</h2>
          <p className="text-gray-600">View and manage consumer accounts.</p>
        </div>

        <div
          onClick={() => navigate("/admin/farmers")}
          className="cursor-pointer bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-lg shadow hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold text-orange-700 mb-2">👨‍🌾 Manage Farmers</h2>
          <p className="text-gray-600">View and manage farmer profiles.</p>
        </div>

        <div
          onClick={() => navigate("/admin/products")}
          className="cursor-pointer bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg shadow hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold text-purple-700 mb-2">🛒 Manage Products</h2>
          <p className="text-gray-600">View or delete listed products.</p>
        </div>
      </div>

      {/* List All Products */}
      <div className="bg-white rounded-lg shadow p-6 mb-20">
        <h2 className="text-2xl font-bold mb-4 text-emerald-700">📦 All Products</h2>
        <AllProducts />
      </div>

      {/* Chat Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate("/chat")}
          className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition-all"
        >
          💬
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
