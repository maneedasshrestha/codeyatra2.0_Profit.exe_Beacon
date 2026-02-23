import React, { useState } from "react";
import { Search, MessageCirclePlus, X, Loader2 } from "lucide-react";
import ChatTile from "./ChatTile";
import AiChatTile from "./AiChatTile";
import Avatar from "@/app/components/Avatar";
import { Chat, User } from "../../dashboard/chat/mockData";

interface ChatListProps {
    chats: Chat[];
    selectedChatId: number | null;
    onSelectChat: (id: number) => void;
    /** Results from the backend /auth/users/search call — owned by parent. */
    searchResults: User[];
    /** Called when the query changes — parent debounces and fetches. */
    onSearchChange: (q: string) => void;
    /** True while the parent is fetching search results. */
    isSearching?: boolean;
    /** Called when the user clicks "Message" on a search result. */
    onStartNewChat: (user: User) => void;
}

const ChatList: React.FC<ChatListProps> = ({
    chats,
    selectedChatId,
    onSelectChat,
    searchResults,
    onSearchChange,
    isSearching = false,
    onStartNewChat,
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    const aiChat = chats.find((c) => c.isAi);
    const normalChats = chats.filter((c) => !c.isAi);

    const hasQuery = searchQuery.trim().length > 0;
    const q = searchQuery.toLowerCase();

    // Existing chats that match the typed query
    const filteredNormalChats = normalChats.filter((chat) =>
        chat.name.toLowerCase().includes(q)
    );

    const handleQueryChange = (value: string) => {
        setSearchQuery(value);
        onSearchChange(value);
    };

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
                        placeholder="Search people or conversations..."
                        value={searchQuery}
                        onChange={(e) => handleQueryChange(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-[1.25rem] py-3.5 pl-12 pr-10 text-[14px] font-medium outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-200 transition-all"
                    />
                    {hasQuery && (
                        <button
                            onClick={() => handleQueryChange("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
                {/* AI Chat — always pinned, hidden while actively searching */}
                {!hasQuery && aiChat && (
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

                {/* People directory results — shown only while searching */}
                {hasQuery && (
                    <div className="mb-4">
                        <div className="px-6 mb-2 flex items-center gap-2">
                            <span className="text-[11px] font-bold text-violet-500 uppercase tracking-widest opacity-70">
                                People
                            </span>
                            {isSearching && <Loader2 size={11} className="animate-spin text-violet-400" />}
                        </div>
                        {searchResults.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-3 p-4 mx-2 rounded-[1.5rem] hover:bg-violet-50 transition-all group"
                                    >
                                        <div className="relative shrink-0">
                                            <Avatar initials={user.initials} imgSrc={user.avatarUrl} size="md" />
                                            {user.online && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[15px] font-bold text-gray-900 truncate">{user.name}</p>
                                            {user.role && (
                                                <p className="text-[12px] font-medium text-gray-400 truncate">{user.role}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                onStartNewChat(user);
                                                handleQueryChange("");
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-[12px] font-bold rounded-xl shadow-sm hover:bg-violet-700 active:scale-95 transition-all whitespace-nowrap"
                                        >
                                            <MessageCirclePlus size={13} />
                                            Message
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : !isSearching && (
                            <p className="px-6 text-[13px] font-medium text-gray-400">No people found.</p>
                        )}
                    </div>
                )}

                {/* Existing Chats */}
                {(!hasQuery || filteredNormalChats.length > 0) && (
                    <>
                        <div className="px-6 mb-2 mt-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest opacity-70">
                                {hasQuery ? "Conversations" : "Recent"}
                            </span>
                        </div>
                        {filteredNormalChats.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                {filteredNormalChats.map((chat) => (
                                    <ChatTile
                                        key={chat.id}
                                        name={chat.name}
                                        initials={chat.initials}
                                        avatarUrl={chat.avatarUrl}
                                        lastMessage={chat.lastMessage}
                                        time={chat.time}
                                        unread={chat.unread}
                                        online={chat.online}
                                        active={selectedChatId === chat.id}
                                        onClick={() => onSelectChat(chat.id)}
                                    />
                                ))}
                            </div>
                        ) : !hasQuery && (
                            <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
                                <p className="text-[14px] font-semibold text-gray-400">No conversations yet</p>
                                <p className="text-[12px] font-medium text-gray-300 mt-1">Search for someone above to start chatting.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Empty state — shown only when search yields nothing at all */}
                {hasQuery && filteredNormalChats.length === 0 && searchResults.length === 0 && !isSearching && (
                    <div className="flex flex-col items-center justify-center p-10 text-center">
                        <p className="text-[14px] font-semibold text-gray-400">No results for &quot;{searchQuery}&quot;</p>
                        <p className="text-[12px] font-medium text-gray-300 mt-1">Try searching by a different name.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
