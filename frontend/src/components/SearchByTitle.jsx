import { useState } from "react";
import axios from "axios";
import AddToCartButton from "./AddToCartButton";

const SearchByTitle = () => {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Title */}
        <h2 className="text-center text-4xl font-bold text-indigo-800">
          🔍 Search Products by Title
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row justify-center items-center gap-4"
        >
          <input
            type="text"
            placeholder="Enter product title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {/* Error & Empty */}
        {error && <p className="text-center text-red-600 text-lg">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className="text-center text-gray-500">No products found.</p>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((p) => (
            <div
              key={p._id}
              className="bg-white/80 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={p.imageURL || "/no-image.png"}
                alt={p.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.description}</p>
                <p className="text-green-700 font-bold text-lg">₹{p.price}</p>
                <p className="text-sm">Stock: <strong>{p.stock || "N/A"}</strong></p>
                <p className="text-sm">
                  Organic:{" "}
                  <span className={p.certifiedOrganic ? "text-green-600" : "text-red-500"}>
                    {p.certifiedOrganic ? "Yes ✅" : "No ❌"}
                  </span>
                </p>
                <div className="pt-3">
                  <AddToCartButton userId={user?.id} productId={p._id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchByTitle;
