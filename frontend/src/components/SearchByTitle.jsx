import { useState } from "react";
import axios from "axios";
import AddToCartButton from "./AddToCartButton";

const SearchByTitle = () => {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Get user info

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/products/by-title/${encodeURIComponent(title)}`
      );
      setResults(res.data);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (status === 404 && msg) setError(msg);
      else setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
        🔍 Search Products by Title
      </h2>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-6 items-center justify-center">
        <input
          type="text"
          placeholder="Enter product title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p className="text-gray-500 text-center">No products to display.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((p) => (
          <div key={p._id} className="border rounded-lg shadow bg-white overflow-hidden">
            <img
              src={p.imageUrl || "/no-image.png"}
              alt={p.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{p.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{p.description}</p>
              <p className="text-green-800 font-semibold mb-1">₹{p.price}</p>
              <p className="text-sm">Stock: <strong>{p.stock || "N/A"}</strong></p>
              <p className="text-sm">
                Organic:{" "}
                <span className={p.certifiedOrganic ? "text-green-600" : "text-red-500"}>
                  {p.certifiedOrganic ? "Yes ✅" : "No ❌"}
                </span>
              </p>
              <div className="mt-3">
                <AddToCartButton userId={user?.id} productId={p._id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchByTitle;
