import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import UserSearch from "../components/UserSearch";

export default function ChatPage() {
  const [partner, setPartner] = useState(null);

  return (
    <div className="max-w-xl mx-auto p-6">
      <UserSearch onSelect={setPartner} />
      <ChatWindow partner={partner} />
    </div>
  );
}


