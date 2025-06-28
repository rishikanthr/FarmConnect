import { useState, useCallback } from "react";
import axios from "axios";

export default function UserSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const token = localStorage.getItem("token");

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setResult(null);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/chat/find?query=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      setResult({ error: "User not found" });
    } finally {
      setIsSearching(false);
    }
  }, [query, token]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 relative z-10">
      {/* Background Layers */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-100 via-green-100 to-lime-100 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/80 via-white/60 to-white/40 backdrop-blur-xl z-0 pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 border border-green-300/40 rounded-3xl p-8 shadow-2xl backdrop-blur-sm bg-white/80">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-emerald-700 mb-2">🔍 Find People</h3>
          <p className="text-gray-700">Search for users to start a conversation</p>
        </div>

        {/* Input + Button */}
        <div className="relative mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Enter email or user ID"
              className="flex-1 px-4 py-3 rounded-lg border border-green-300 outline-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={search}
              disabled={isSearching || !query.trim()}
              className="px-5 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 z-20"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && !result.error && (
          <div className="p-4 bg-lime-100 border border-lime-300 rounded-lg shadow-md flex justify-between items-center">
            <span className="text-green-900 font-medium">{result.name || result.email}</span>
            <button
              onClick={() => onSelect(result)}
              className="text-emerald-700 hover:underline font-medium"
            >
              Chat →
            </button>
          </div>
        )}

        {/* Error */}
        {result?.error && (
          <div className="mt-4 text-center text-red-600 font-medium">
            {result.error}
          </div>
        )}
      </div>
    </div>
  );
}
