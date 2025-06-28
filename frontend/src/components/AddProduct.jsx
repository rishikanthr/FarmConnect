import React, { useState, useRef } from "react";
import axios from "axios";

const AddProduct = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
    certifiedOrganic: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === "checkbox" ? checked : type === "file" ? files[0] : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (type === "file" && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append("farmerId", user._id);

      await axios.post("http://localhost:3000/api/products/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("🎉 Product added successfully!");
      setForm({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
        certifiedOrganic: false,
      });
      setImagePreview(null);
      onProductAdded();
    } catch (err) {
      setError(err.response?.data?.error || "❌ Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-10 px-4 flex justify-center items-center">
      {/* Background Blurs */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl bg-white/90 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-8 space-y-8"
      >
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          🧺 Add New Product
        </h2>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded-xl animate-fade-in">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-600 text-green-700 px-4 py-3 rounded-xl animate-fade-in">
            ✨ {success}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 bg-white shadow-sm outline-none"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 bg-white shadow-sm outline-none"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 bg-white shadow-sm outline-none"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Fruits)"
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 bg-white shadow-sm outline-none"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          placeholder="Enter product description..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 h-28 resize-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm outline-none"
          value={form.description}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div
            className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-green-400 cursor-pointer transition-all bg-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg shadow"
              />
            ) : (
              <div>
                <p className="text-gray-600">📷 Upload Product Image</p>
                <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 cursor-pointer shadow-sm">
            <input
              type="checkbox"
              name="certifiedOrganic"
              checked={form.certifiedOrganic}
              onChange={handleChange}
              className="w-5 h-5 accent-green-600"
            />
            <span>🌿 Certified Organic</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl text-lg font-bold transition-transform transform hover:scale-[1.02] shadow-lg"
        >
          ➕ Add Product
        </button>
      </form>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(5px);
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

export default AddProduct;
