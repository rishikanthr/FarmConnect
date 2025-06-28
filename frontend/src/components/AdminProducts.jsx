import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaLeaf, FaSearch } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/allProducts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Product fetch error:", err);
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/api/products/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const combinedText = (p.title + p.farmerName + p.farmerEmail).toLowerCase();
    return combinedText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-purple-200 p-6">
        <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-3 mb-6">
          <FaLeaf className="text-green-500" />
          Admin — Product Management
        </h1>

        {/* 🔍 Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by product or farmer name/email..."
              className="w-full border-2 border-purple-300 rounded-xl px-5 py-3 pl-10 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute top-3.5 left-3 text-purple-400 text-lg" />
          </div>
        </div>

        {/* 📦 Product List */}
        <div className="space-y-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-purple-50 border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition-all px-5 py-4"
              >
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-purple-800">
                    {p.title} – ₹{p.price}
                  </div>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md shadow-md text-sm flex items-center gap-2"
                  >
                    <FaTrashAlt />
                    Delete
                  </button>
                </div>

                <div className="text-sm mt-2 space-y-1 text-gray-700">
                  <p>
                    👨‍🌾 <strong>Farmer Name:</strong>{" "}
                    <span className="text-indigo-700 font-medium">
                      {p.farmerName || "Unknown"}
                    </span>
                  </p>
                  <p>
                    📧 <strong>Email:</strong>{" "}
                    <span className="text-gray-800">{p.farmerEmail || "N/A"}</span>
                  </p>
                  <p>
                    📍 <strong>Location:</strong> {p.farmerLocation || "Unknown"}
                  </p>
                  <p>
                    🆔 <strong>Farmer ID:</strong>{" "}
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono text-xs">
                      {p.farmerId || "N/A"}
                    </span>
                  </p>
                  <p>
                    🧺 <strong>Stock:</strong> {p.stock}
                  </p>
                  <p>
                    🌿 <strong>Organic:</strong>{" "}
                    <span className={p.certifiedOrganic ? "text-green-600" : "text-red-500"}>
                      {p.certifiedOrganic ? "Yes ✅" : "No ❌"}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 italic mt-10">
              No products match your search 🧐
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
