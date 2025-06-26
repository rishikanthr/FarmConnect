import { useState } from "react";
import axios from "axios";

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post("http://localhost:3000/api/ai", { question });
      //console.log(question);
      console.log(res.data);
      setAnswer(res.data.answer);
    } catch (err) { 
      //console.log("Error fetching answer:", err);
      setAnswer("❌ Failed to fetch answer. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">🧠 Ask AI - Agriculture Assistant</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about plant disease, farming tips, etc."
        className="w-full p-3 border border-gray-300 rounded mb-4"
        rows={4}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-gray-800 whitespace-pre-line">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
