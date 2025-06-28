import { useEffect, useState, useRef } from "react";
import { Send, Check, CheckCheck, Smile, Paperclip } from "lucide-react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000", { autoConnect: false });

export default function ChatWindow({ partner }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!me.id) return;
    if (!socket.connected) socket.connect();
    socket.emit("join", me.id);
    return () => socket.disconnect();
  }, [me.id]);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    if (!partner?._id || !me.id) return;
    socket.emit("markSeen", { senderId: partner._id, receiverId: me.id });
  }, [msgs]);

  useEffect(() => {
    socket.on("messagesSeen", ({ from }) => {
      if (from === partner._id) {
        setMsgs((prev) =>
          prev.map((m) =>
            m.receiverId === from ? { ...m, seen: true } : m
          )
        );
      }
    });
    return () => socket.off("messagesSeen");
  }, [partner]);

  const send = async () => {
    if (!text.trim() || !partner?._id) return;
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/chat",
        { recipientId: partner._id, message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgs((p) => [...p, data]);
      setText("");
    } catch (e) {
      console.error("Send failed", e.response?.data || e.message);
    }
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDateHeader = (dateStr) => {
    const today = new Date();
    const msgDate = new Date(dateStr);
    const diffDays = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));
    if (today.toDateString() === msgDate.toDateString()) return "Today";
    if (diffDays === 1) return "Yesterday";
    return msgDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedMsgs = msgs.reduce((acc, msg) => {
    const date = new Date(msg.timestamp).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  if (!partner)
    return (
      <div className="flex items-center justify-center h-full text-white bg-gradient-to-br from-emerald-900 via-green-900 to-lime-900">
        <p>Select a user to chat.</p>
      </div>
    );

  return (
    <div className="h-[90vh] flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-lime-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10"></div>

      {/* Glass Container */}
      <div className="relative z-10 h-full m-4 rounded-3xl border border-white/20 backdrop-blur-lg bg-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-white/20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {partner.name?.[0].toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{partner.name || partner.email}</h3>
            <p className="text-sm text-white/60">Online now</p>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {Object.entries(groupedMsgs).map(([date, msgs]) => (
            <div key={date}>
              <div className="text-center text-sm text-white/60 mb-2">
                {formatDateHeader(date)}
              </div>
              {msgs.map((m) => {
                const isMe = m.senderId === me.id;
                return (
                  <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-5 py-3 rounded-3xl shadow-xl border backdrop-blur-sm ${
                        isMe
                          ? "bg-gradient-to-r from-lime-500 to-emerald-500 text-white border-white/20 rounded-br-lg"
                          : "bg-white/20 text-white border-white/30 rounded-bl-lg"
                      }`}
                    >
                      <div className="break-words">{m.message}</div>
                      <div className="text-xs mt-2 flex items-center gap-2 opacity-70 justify-end">
                        <span>{formatTime(m.timestamp)}</span>
                        {isMe && (
                          <span>
                            {m.seen ? (
                              <CheckCheck className="w-4 h-4 text-lime-300" />
                            ) : m.delivered ? (
                              <CheckCheck className="w-4 h-4 text-white/60" />
                            ) : (
                              <Check className="w-4 h-4 text-white/60" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300">
              <Paperclip className="w-5 h-5 text-white/60" />
            </button>
            <input
              className="flex-1 bg-white/10 border border-white/30 rounded-full px-5 py-3 text-white placeholder-white/50 focus:outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your message..."
            />
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20">
              <Smile className="w-4 h-4 text-white/60" />
            </button>
            <button
              onClick={send}
              disabled={!text.trim()}
              className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
