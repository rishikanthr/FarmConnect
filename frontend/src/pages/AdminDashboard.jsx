import React, { useEffect, useState } from "react";
import axios from "axios";
import AllProducts from "../components/AllProducts";
import LogOutButton from "../components/LogOutButton";
import AdminUserManager from "../components/AdminUserManager"; // if you have the manager

const AdminDashboard = () => {
  const [consumers, setConsumers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchAdminData = async () => {
    try {
      const [consRes, farmRes, prodRes] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/allConsumers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/admin/allFarmers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/admin/allProducts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setConsumers(consRes.data);
      setFarmers(farmRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Admin Dashboard Error:", err.message);
      setError("Failed to load admin data");
    }
  };

  // 🔴 Delete any product
  const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:3000/api/products/admin/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // remove locally so UI updates instantly
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      console.error("Deletion failed:", e.response?.data || e.message);
    }
  };


  useEffect(() => {
    fetchAdminData();
  }, []);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!consumers.length && !farmers.length && !products.length)
    return <div className="text-gray-500 p-4">Loading admin data...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
        <LogOutButton />
      </div>

      {/* Quick stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            Consumers ({consumers.length})
          </h2>
          <ul className="space-y-1 text-sm">
            {consumers.map((c) => (
              <li key={c._id}>{c.name} - {c.email}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-700">
            Farmers ({farmers.length})
          </h2>
          <ul className="space-y-1 text-sm">
            {farmers.map((f) => (
              <li key={f._id}>{f.name} - {f.email}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-purple-700">
            Products ({products.length})
          </h2>
          <ul className="space-y-1 text-sm">
            {products.map((p) => (
              <li key={p._id}>
                {p.title} - ₹{p.price}
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Optional full product cards */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <AllProducts />
      </div>

      {/* Optional user manager with restrict/ban/unban */}
      <AdminUserManager />
    </div>
  );
};

export default AdminDashboard;
