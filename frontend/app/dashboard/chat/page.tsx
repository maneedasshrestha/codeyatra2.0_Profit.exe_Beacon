"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import ChatList from "../../components/chat/ChatList";
import ChatConversation from "../../components/chat/ChatConversation";
import { CHATS_DATA, Chat } from "./mockData";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null); // Default to list view

  const selectedChat = CHATS_DATA.find((c) => c.id === selectedChatId) || null;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Container for Desktop */}
      <div className="flex w-full overflow-hidden relative">
        {/* Sidebar */}
        <div className={`w-full md:w-95 shrink-0 h-full ${selectedChatId !== null ? "hidden md:flex" : "flex"}`}>
          <ChatList
            chats={CHATS_DATA}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
          />
        </div>

        {/* Conversation Area */}
        <div className={`flex-1 h-full ${selectedChatId === null ? "hidden md:flex" : "flex"} relative`}>
          <ChatConversation
            chat={selectedChat}
            onBack={() => setSelectedChatId(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
