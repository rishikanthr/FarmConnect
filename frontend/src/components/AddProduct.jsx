// /src/components/AddProduct.jsx
import React, { useState } from "react";
import axios from "axios";

const AddProduct = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageURL: "",
    certifiedOrganic: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.post(
        "http://localhost:3000/api/products/add",
        {
          ...form,
          farmerId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Product added successfully!");
      setForm({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        imageURL: "",
        certifiedOrganic: false,
      });

      onProductAdded(); // refresh product list
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6">
      <h2 className="text-xl font-semibold mb-2">Add New Product</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <input
        type="text"
        name="title"
        placeholder="Product Title"
        className="w-full border p-2 mb-2 rounded"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full border p-2 mb-2 rounded"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        className="w-full border p-2 mb-2 rounded"
        value={form.price}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        className="w-full border p-2 mb-2 rounded"
        value={form.stock}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        className="w-full border p-2 mb-2 rounded"
        value={form.category}
        onChange={handleChange}
      />

      <input
        type="text"
        name="imageURL"
        placeholder="Image URL"
        className="w-full border p-2 mb-2 rounded"
        value={form.imageURL}
        onChange={handleChange}
      />

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          name="certifiedOrganic"
          checked={form.certifiedOrganic}
          onChange={handleChange}
        />
        <span>Certified Organic</span>
      </label>

      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
