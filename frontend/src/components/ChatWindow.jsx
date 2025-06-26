import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000", { autoConnect: false });

export default function ChatWindow({ partner }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  /* my data + token */
  const me    = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  /* ── connect once + join my private room ───────── */
  useEffect(() => {
    if (!me.id) return;
    if (!socket.connected) socket.connect();
    socket.emit("join", me.id);
    return () => socket.disconnect();
  }, [me.id]);

  /* ── load history when partner changes ─────────── */
  useEffect(() => {
    if (!partner?._id) return;
    (async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/chat/with/${partner._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMsgs(data);
      } catch (err) {
        console.error("Load chat failed", err);
      }
    })();
  }, [partner, token]);

  /* ── realtime listener ─────────────────────────── */
  useEffect(() => {
    const handler = (msg) => {
      const relevant =
        (msg.senderId === partner?._id && msg.receiverId === me.id) ||
        (msg.senderId === me.id && msg.receiverId === partner?._id);
      if (relevant) setMsgs((p) => [...p, msg]);
    };
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [partner, me.id]);

  /* auto-scroll */
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  /* send */
  const send = async () => {
    if (!text.trim() || !partner?._id) return;
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/chat",
        { recipientId: partner._id, message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgs((p) => [...p, data]);   // optimistic add
      setText("");
    } catch (e) {
      console.error("Send failed", e.response?.data || e.message);
    }
  };

  if (!partner) return <p className="text-center text-gray-500">Select a user to chat.</p>;

  return (
    <div className="border rounded p-4 h-96 flex flex-col">
      <h3 className="font-semibold mb-2">Chat with {partner.name || partner.email}</h3>

      <div className="flex-1 overflow-y-auto space-y-1 mb-2">
        {msgs.map((m) => (
          <div
            key={m._id}
            className={`p-2 rounded ${
              m.senderId === me.id ? "bg-green-100 ml-auto" : "bg-gray-100"
            }`}
          >
            {m.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 rounded px-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type message…"
        />
        <button
          onClick={send}
          className="bg-blue-600 text-white px-3 rounded disabled:opacity-50"
          disabled={!text.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
