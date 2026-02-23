import React from "react";
import Avatar from "@/app/components/Avatar";

interface ChatTileProps {
    name: string;
    initials: string;
    lastMessage: string;
    time: string;
    unread?: number;
    online?: boolean;
    active?: boolean;
    onClick: () => void;
}

const ChatTile: React.FC<ChatTileProps> = ({
    name,
    initials,
    lastMessage,
    time,
    unread,
    online,
    active,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 p-4 mx-2 rounded-[1.5rem] cursor-pointer transition-all duration-200 group ${active
                    ? "bg-violet-50 shadow-[0_4px_20px_rgba(139,92,246,0.08)] border border-violet-100"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
        >
            <div className="relative">
                <Avatar initials={initials} size="md" />
                {online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[15px] font-bold truncate ${active ? "text-violet-900" : "text-gray-900"}`}>
                        {name}
                    </span>
                    <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap ml-2">
                        {time}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <p className={`text-[13px] truncate font-medium ${unread ? "text-gray-900 font-bold" : "text-gray-500"}`}>
                        {lastMessage}
                    </p>
                    {unread && (
                        <div className="flex items-center justify-center min-w-[18px] h-[18px] bg-violet-500 rounded-full ml-2">
                            <span className="text-[10px] font-bold text-white px-1">
                                {unread}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatTile;
