import React from "react";
import { ChevronUp, ChevronDown, MessageCircle, Bookmark } from "lucide-react";
import { Post } from "../dashboard/home/mockData";
import Avatar from "@/app/components/Avatar";

interface PostCardProps {
  post: Post;
  onVote: (id: number, dir: "up" | "down") => void;
  onSave: (id: number) => void;
  onNavigate: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onVote,
  onSave,
  onNavigate,
}) => {
  const voteCount =
    post.userVote === "up"
      ? post.upvotes + 1
      : post.userVote === "down"
        ? post.upvotes - 1
        : post.upvotes;

  return (
    <article
      onClick={() => onNavigate(post.id)}
      className="bg-white mx-4 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 cursor-pointer active:scale-[0.99] transition-all duration-200 overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] group"
    >
      <div className="px-5 pt-5 pb-4">
        {/* Author Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Avatar initials={post.authorInitials} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14px] font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                {post.author}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[12px] font-semibold text-violet-500/80 bg-violet-50 px-2 py-0.5 rounded-lg">
                {post.community}
              </span>
              <span className="text-gray-300 text-[10px]">·</span>
              <span className="text-[12px] text-gray-400 font-medium">
                {post.timeAgo}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight mb-2">
          {post.title}
        </h2>

        {/* Body */}
        <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-2 font-medium opacity-90">
          {post.body}
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4 px-5 py-4 bg-gray-50/30 border-t border-gray-50/50">
        {/* Vote Pill */}
        <div
          className={`flex items-center rounded-2xl overflow-hidden border transition-all duration-300 ${
            post.userVote === "up"
              ? "border-violet-200 bg-violet-100/50 shadow-[0_2px_10px_rgba(139,92,246,0.1)]"
              : post.userVote === "down"
                ? "border-orange-200 bg-orange-50"
                : "border-gray-200/50 bg-white"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(post.id, "up");
            }}
            className={`p-2.5 transition-all ${
              post.userVote === "up"
                ? "bg-violet-500 text-white"
                : "hover:bg-violet-50 text-gray-400 hover:text-violet-500"
            }`}
            aria-label="Upvote"
          >
            <ChevronUp size={18} />
          </button>
          <span
            className={`text-[14px] font-bold tabular-nums px-2 ${
              post.userVote === "up"
                ? "text-violet-600"
                : post.userVote === "down"
                  ? "text-orange-500"
                  : "text-gray-700"
            }`}
          >
            {voteCount}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(post.id, "down");
            }}
            className={`p-2.5 transition-all ${
              post.userVote === "down"
                ? "bg-orange-500 text-white"
                : "hover:bg-orange-50 text-gray-400 hover:text-orange-500"
            }`}
            aria-label="Downvote"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Comments */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(post.id);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200/50 hover:border-violet-200 hover:bg-violet-50/30 transition-all group/btn"
          aria-label="Comments"
        >
          <MessageCircle
            size={16}
            className="text-gray-400 group-hover/btn:text-violet-500 transition-colors"
          />
          <span className="text-[14px] font-bold text-gray-600 group-hover/btn:text-violet-600">
            {post.comments}
          </span>
        </button>

        {/* Save */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(post.id);
          }}
          className={`ml-auto p-2.5 rounded-2xl border transition-all active:scale-90 ${
            post.saved
              ? "bg-violet-500 border-violet-500 text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
              : "bg-white border-gray-200/50 text-gray-400 hover:border-violet-200 hover:text-violet-500"
          }`}
          aria-label="Save"
        >
          <Bookmark size={16} className={post.saved ? "fill-white" : ""} />
        </button>
      </div>
    </article>
  );
};

export default PostCard;
