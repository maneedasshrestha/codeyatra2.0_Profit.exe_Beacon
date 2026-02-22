import React from "react";
import { ThumbsUp } from "lucide-react";
import Avatar from "./Avatar";
import { Comment } from "../dashboard/home/[id]/mockData";

interface CommentCardProps {
  comment: Comment;
  onLike: (id: number) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onLike }) => {
  return (
    <div className="flex gap-4 px-5 py-5 bg-white rounded-[1.5rem] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all group">
      <div className="relative shrink-0">
        <Avatar initials={comment.initials} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
          <span className="text-[14px] font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
            {comment.author}
          </span>
          <span className="ml-auto text-[12px] text-gray-400 font-medium whitespace-nowrap">
            {comment.timeAgo}
          </span>
        </div>
        <p className="text-[14px] text-gray-600 leading-relaxed font-medium opacity-90">
          {comment.body}
        </p>
        <button
          onClick={() => onLike(comment.id)}
          className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all active:scale-95 text-[13px] font-bold ${
            comment.liked
              ? "text-violet-500 bg-violet-50 border-violet-100 shadow-[0_2px_8px_rgba(139,92,246,0.1)]"
              : "text-gray-400 bg-gray-50 border-gray-100 hover:border-violet-100 hover:text-violet-500 hover:bg-white"
          }`}
        >
          <ThumbsUp
            size={14}
            className={comment.liked ? "fill-violet-400" : ""}
          />
          {comment.liked ? comment.likes + 1 : comment.likes}
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
