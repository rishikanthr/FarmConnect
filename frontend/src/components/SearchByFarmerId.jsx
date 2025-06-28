import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const SearchByFarmer = () => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("id");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setError("");
    setProducts([]);
    setLoading(true);

    const url =
      mode === "id"
        ? `${BASE_URL}/api/products/getByFarmer/${encodeURIComponent(query)}`
        : `${BASE_URL}/api/products/by-farmer-name/${encodeURIComponent(query)}`;

    try {
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg border border-white/40 rounded-3xl p-8 shadow-2xl transition-all duration-300">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">🌾 Search by Farmer</h2>

      {/* Mode toggle */}
      <div className="flex justify-center gap-6 mb-6">
        <label className="flex items-center space-x-2 text-green-700 font-medium">
          <input
            type="radio"
            name="mode"
            value="id"
            checked={mode === "id"}
            onChange={() => setMode("id")}
            className="accent-green-600"
          />
          <span>Farmer ID</span>
        </label>
        <label className="flex items-center space-x-2 text-green-700 font-medium">
          <input
            type="radio"
            name="mode"
            value="name"
            checked={mode === "name"}
            onChange={() => setMode("name")}
            className="accent-green-600"
          />
          <span>Farmer Name</span>
        </label>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
      >
        <input
          type="text"
          placeholder={`Enter ${mode === "id" ? "ID" : "Name"}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-green-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* Feedback */}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500 text-center">No products to display.</p>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
          >
            <img
              src={p.imageURL || "/no-image.png"}
              alt={p.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-1">
              <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
              <p className="text-gray-600 text-sm">{p.description}</p>
              <p className="text-green-700 font-semibold">₹{p.price}</p>
              <p className="text-sm">Stock: {p.stock || "N/A"}</p>
              <p className="text-sm">
                Organic:{" "}
                <span className={p.certifiedOrganic ? "text-green-600" : "text-red-500"}>
                  {p.certifiedOrganic ? "Yes ✅" : "No ❌"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchByFarmer;
