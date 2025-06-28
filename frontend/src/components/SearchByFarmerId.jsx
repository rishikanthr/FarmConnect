import { useState } from "react";
import axios from "axios";

const SearchByFarmer = () => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("id"); // 'id' or 'name'
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
        ? `http://localhost:3000/api/products/getByFarmer/${encodeURIComponent(query)}`
        : `http://localhost:3000/api/products/by-farmer-name/${encodeURIComponent(query)}`;

    try {
      const res = await axios.get(url);
      console.log("Search results:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.log("Search error:", err);
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Search by Farmer</h2>

      {/* Mode toggle */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="mode"
            value="id"
            checked={mode === "id"}
            onChange={() => setMode("id")}
          />
          By ID
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="mode"
            value="name"
            checked={mode === "name"}
            onChange={() => setMode("name")}
          />
          By Name
        </label>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={`Enter farmer ${mode === "id" ? "ID" : "name"}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500">No products to display.</p>
      )}

      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <li key={p._id} className="border p-4 rounded shadow bg-white">
            <img
              src={p.imageURL || "/no-image.png"}
              alt={p.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
            <p className="text-gray-600 text-sm">{p.description}</p>
            <p className="text-green-800 font-semibold mt-1">₹{p.price}</p>
            <p className="text-sm">Stock: {p.stock}</p>
            <p className="text-sm">
              Organic:{" "}
              <span className={p.certifiedOrganic ? "text-green-600" : "text-red-500"}>
                {p.certifiedOrganic ? "Yes ✅" : "No ❌"}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchByFarmer;
