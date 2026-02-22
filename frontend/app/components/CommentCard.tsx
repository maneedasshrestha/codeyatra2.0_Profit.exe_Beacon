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
    <div className="flex gap-3 px-4 py-4 bg-white rounded-2xl border border-gray-100/80 shadow-sm">
      <Avatar initials={comment.initials} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
          <span className="text-[13px] font-bold text-gray-900">
            {comment.author}
          </span>
          <span className="ml-auto text-[11px] text-gray-400 whitespace-nowrap">
            {comment.timeAgo}
          </span>
        </div>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          {comment.body}
        </p>
        <button
          onClick={() => onLike(comment.id)}
          className={`mt-2 flex items-center gap-1.5 text-[12px] font-semibold transition-colors active:scale-95 ${
            comment.liked ? "text-purple-500" : "text-gray-400"
          }`}
        >
          <ThumbsUp
            size={13}
            className={comment.liked ? "fill-purple-400" : ""}
          />
          {comment.liked ? comment.likes + 1 : comment.likes}
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
