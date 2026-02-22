import React from "react";
import { Sparkles } from "lucide-react";
import Avatar from "@/app/components/Avatar";

interface AiChatTileProps {
  active?: boolean;
  onClick: () => void;
  lastMessage: string;
}

const AiChatTile: React.FC<AiChatTileProps> = ({
  active,
  onClick,
  lastMessage,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 mx-2 rounded-[1.5rem] cursor-pointer transition-all duration-300 relative overflow-hidden group ${
        active
          ? "bg-violet-600 shadow-[0_8px_25px_rgba(139,92,246,0.25)] border-transparent"
          : "bg-white border border-violet-100 hover:border-violet-300 shadow-[0_4px_15px_rgba(139,92,246,0.05)]"
      }`}
    >
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

      <div className="relative z-10">
        <div
          className={`p-0.5 rounded-2xl ${active ? "bg-white/20" : "bg-violet-50"}`}
        >
          <Avatar initials="AI" size="md" />
        </div>
        <div
          className={`absolute -top-1 -right-1 p-1 rounded-full shadow-sm ${active ? "bg-white text-violet-600" : "bg-violet-600 text-white"}`}
        >
          <Sparkles size={10} />
        </div>
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-[15px] font-black tracking-tight ${active ? "text-white" : "text-violet-900"}`}
          >
            Beacon AI
          </span>
        </div>
        <p
          className={`text-[13px] truncate font-semibold opacity-90 ${active ? "text-violet-50" : "text-violet-600/70"}`}
        >
          {lastMessage}
        </p>
      </div>
    </div>
  );
};

export default AiChatTile;
