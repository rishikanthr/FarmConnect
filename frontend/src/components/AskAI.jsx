import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post(`${BASE_URL}/api/ai`, { question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("❌ Failed to fetch answer. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-2xl rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">🤖 Ask AI Assistant</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about plant care, weather advice, crop diseases, etc."
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        rows={5}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 w-full rounded transition"
      >
        {loading ? "💬 Thinking..." : "Ask Question"}
      </button>

      {answer && (
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-md text-gray-800">
          <h3 className="font-semibold text-indigo-700 mb-2">📝 AI Response</h3>
          <p className="whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}
