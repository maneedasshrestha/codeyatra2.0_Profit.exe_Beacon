import React from "react";
import { Trash2 } from "lucide-react";
import Avatar from "./Avatar";

export interface CommentData {
  id: string;
  content: string;
  user_name: string;
  user_avatar: string | null;
  user_id: string;
  created_at: string;
}

interface CommentCardProps {
  comment: CommentData;
  currentUserId: string | null;
  onDelete: (id: string) => void;
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  currentUserId,
  onDelete,
}) => {
  const initials = (comment.user_name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex gap-4 px-5 py-5 bg-white rounded-[1.5rem] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all group">
      <div className="relative shrink-0">
        <Avatar initials={initials} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
          <span className="text-[14px] font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
            {comment.user_name}
          </span>
          <span className="ml-auto text-[12px] text-gray-400 font-medium whitespace-nowrap">
            {getTimeAgo(comment.created_at)}
          </span>
        </div>
        <p className="text-[14px] text-gray-600 leading-relaxed font-medium opacity-90">
          {comment.content}
        </p>
        {currentUserId === comment.user_id && (
          <button
            onClick={() => onDelete(comment.id)}
            className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all active:scale-95 text-[13px] font-bold text-red-400 bg-red-50 border-red-100 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
