import React, { useState } from "react";
import { Search } from "lucide-react";
import ChatTile from "./ChatTile";
import AiChatTile from "./AiChatTile";
import { Chat } from "../../dashboard/chat/mockData";

interface ChatListProps {
    chats: Chat[];
    selectedChatId: number | null;
    onSelectChat: (id: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({
    chats,
    selectedChatId,
    onSelectChat,
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    const aiChat = chats.find((c) => c.isAi);
    const normalChats = chats.filter((c) => !c.isAi);

    const filteredNormalChats = normalChats.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 w-full md:w-[380px] shrink-0 overflow-hidden">
            {/* Search Header */}
            <div className="p-6 pb-4">
                <h1 className="text-[24px] font-black text-gray-900 mb-4 tracking-tight">Messages</h1>
                <div className="relative group">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-[1.25rem] py-3.5 pl-12 pr-4 text-[14px] font-medium outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-200 transition-all"
                    />
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
                {/* AI Chat Pinned at Top */}
                {aiChat && (
                    <div className="mb-4">
                        <div className="px-6 mb-2">
                            <span className="text-[11px] font-bold text-violet-500 uppercase tracking-widest opacity-70">
                                Assistant
                            </span>
                        </div>
                        <AiChatTile
                            active={selectedChatId === aiChat.id}
                            onClick={() => onSelectChat(aiChat.id)}
                            lastMessage={aiChat.lastMessage}
                        />
                    </div>
                )}

                {/* Normal Chats */}
                <div className="px-6 mb-2 mt-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest opacity-70">
                        Recent
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    {filteredNormalChats.map((chat) => (
                        <ChatTile
                            key={chat.id}
                            name={chat.name}
                            initials={chat.initials}
                            lastMessage={chat.lastMessage}
                            time={chat.time}
                            unread={chat.unread}
                            online={chat.online}
                            active={selectedChatId === chat.id}
                            onClick={() => onSelectChat(chat.id)}
                        />
                    ))}
                    {filteredNormalChats.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-10 text-center">
                            <p className="text-[14px] font-semibold text-gray-400">No conversations found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatList;
