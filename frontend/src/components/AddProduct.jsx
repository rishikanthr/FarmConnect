import React, { useState, useRef } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

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
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("certifiedOrganic", form.certifiedOrganic);
      formData.append("image", form.image);
      formData.append("farmerId", user._id);
      formData.append("farmerName", user.name);
      formData.append("farmerEmail", user.email);
      formData.append("farmerLocation", user.location);

      await axios.post(`${BASE_URL}/api/products/add`, formData, {
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
      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "❌ Failed to add product");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-green-700">🧺 Add New Product</h2>

        {error && <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded">{error}</div>}
        {success && <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded">{success}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="input" />
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required className="input" />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required className="input" />
          <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} className="input" />
        </div>

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="input h-24 resize-none" />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div
            className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-green-500"
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
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
            ) : (
              <div className="text-gray-500">📷 Click to upload product image</div>
            )}
          </div>

          <label className="flex items-center gap-2 text-green-700">
            <input
              type="checkbox"
              name="certifiedOrganic"
              checked={form.certifiedOrganic}
              onChange={handleChange}
              className="accent-green-600"
            />
            Certified Organic
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
        >
          ➕ Add Product
        </button>
      </form>

      <style jsx>{`
        .input {
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1.5px solid #ccc;
          width: 100%;
          outline: none;
        }
        .input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AddProduct;
