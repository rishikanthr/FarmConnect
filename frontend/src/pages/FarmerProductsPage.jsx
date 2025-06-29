import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit3, Package, Star, Award, DollarSign, ShoppingCart } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const FarmerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [farmerId, setFarmerId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) {
      setFarmerId(user.id);
    } else {
      setError("\u274C Farmer ID not found. Please log in again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!farmerId) return;
      try {
        const res = await axios.get(`${BASE_URL}/api/products/getByFarmer/${farmerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data || []);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError("\u274C Failed to load your products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [farmerId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("\u274C Delete failed. Please try again.");
    }
  };

  const getStockStatus = (stock) => {
    if (stock > 100) return { label: "In Stock", color: "text-emerald-600", bg: "bg-emerald-100" };
    if (stock > 50) return { label: "Limited", color: "text-amber-600", bg: "bg-amber-100" };
    if (stock > 0) return { label: "Low Stock", color: "text-orange-600", bg: "bg-orange-100" };
    return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-100" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-emerald-600 text-xl font-medium">Loading your products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-600 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-emerald-800 mb-10">Your Products</h1>

        {products.length === 0 ? (
          <div className="text-center text-gray-500">You haven't listed any products yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div
                  key={product._id}
                  className="group bg-white/70 backdrop-blur-lg border border-white/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative">
                    <img
                      src={product.imageURL || "/no-image.png"}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.certifiedOrganic && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>Organic</span>
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 ${stockStatus.bg} ${stockStatus.color} px-3 py-1 rounded-full text-xs font-bold`}>
                      {stockStatus.label}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-500">Price</span>
                        <span className="text-lg font-bold text-emerald-600">₹{product.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-500">Stock</span>
                        <span className="text-sm font-bold text-gray-700">{product.stock} kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-500">Category</span>
                        <span className="text-sm font-medium text-gray-700">{product.category}</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        className="p-2 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-xl transition-all duration-300"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-xl transition-all duration-300"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerProductsPage;
