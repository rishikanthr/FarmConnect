import { useState } from "react";
import axios from "axios";

export default function UserSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const token = localStorage.getItem("token");

  const search = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/chat/find?query=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch {
      setResult({ error: "User not found" });
    }
  };

  return (
    <div className="mb-4">
      <input
        className="border px-2 py-1 mr-2 rounded"
        placeholder="Email or User ID"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={search} className="bg-indigo-600 text-white px-3 py-1 rounded">
        Find
      </button>

      {result && !result.error && (
        <div className="mt-2">
          {result.name || result.email}{" "}
          <button
            onClick={() => onSelect(result)}
            className="text-blue-600 underline"
          >
            Chat
          </button>
        </div>
      )}
      {result?.error && <p className="text-red-600">{result.error}</p>}
    </div>
  );
}
