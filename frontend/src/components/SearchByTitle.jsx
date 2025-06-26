import { useState } from "react";
import axios from "axios";

const SearchByTitle = () => {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      // Encode title so spaces & special chars work
      const res = await axios.get(
        `http://localhost:3000/api/products/by-title/${encodeURIComponent(title)}`
      );
      setResults(res.data);            // array of products
    } catch (err) {
      // 404 from backend will have res.data.message = "Out of stock"
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 404 && msg) setError(msg);          // Out of stock
      else setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-indigo-700">Search Products</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="text-gray-500">No products to display.</p>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((p) => (
          <li key={p._id} className="border p-4 rounded shadow bg-gray-50">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p>{p.description}</p>
            <p className="font-medium">₹{p.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchByTitle;
