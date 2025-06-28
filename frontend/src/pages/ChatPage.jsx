import { useState, useEffect } from "react";
import { Leaf, Users } from "lucide-react";
import ChatWindow from "../components/ChatWindow";
import UserSearch from "../components/UserSearch";

export default function ChatPage() {
  const [partner, setPartner] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-lime-50 text-gray-800">
      {/* Header */}
      <header className="py-10 text-center">
        <h1 className="text-5xl font-extrabold text-emerald-700">
          🌿 FarmConnect
        </h1>
        <p className="text-lg mt-2 text-emerald-600">
          Connect • Collaborate • Cultivate
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 space-y-10">
        {/* User Search */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Users className="text-emerald-600 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-emerald-700">
              Find Farmers & Friends
            </h2>
          </div>
          <UserSearch onSelect={setPartner} />
        </section>

        {/* Chat Section */}
        <section className="bg-white shadow-md rounded-2xl border border-emerald-100 overflow-hidden">
          <ChatWindow partner={partner} />
        </section>
      </main>

      {/* Decorative background shape */}
      <div className="fixed top-20 right-20 w-40 h-40 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
