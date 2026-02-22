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
      className="bg-white mx-4 rounded-3xl shadow-sm border border-gray-100/80 cursor-pointer active:scale-[0.985] transition-all duration-150 overflow-hidden"
    >
      <div className="px-4 pt-4 pb-3">
        {/* Author Row */}
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar initials={post.authorInitials} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[13px] font-bold text-gray-900 truncate">
                {post.author}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-semibold text-gray-400  ">
                {post.community}
              </span>
              <span className="text-gray-300 text-[10px]">·</span>
              <span className="text-[11px] text-gray-400">{post.timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[15px] font-bold text-gray-900 leading-snug">
          {post.title}
        </h2>

        {/* Body */}
        <p className="mt-1.5 text-[13px] text-gray-500 leading-relaxed line-clamp-2">
          {post.body}
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-50" />

      {/* Action Bar */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Vote Pill */}
        <div
          className={`flex items-center rounded-xl overflow-hidden border transition-colors ${
            post.userVote === "up"
              ? "border-purple-200 bg-purple-50"
              : post.userVote === "down"
                ? "border-orange-200 bg-orange-50"
                : "border-gray-100 bg-gray-50"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(post.id, "up");
            }}
            className="p-2 active:opacity-60 transition-opacity"
            aria-label="Upvote"
          >
            <ChevronUp
              size={16}
              className={
                post.userVote === "up" ? "text-purple-500" : "text-gray-400"
              }
            />
          </button>
          <span
            className={`text-[13px] font-black tabular-nums px-0.5 ${
              post.userVote === "up"
                ? "text-purple-500"
                : post.userVote === "down"
                  ? "text-orange-400"
                  : "text-gray-600"
            }`}
          >
            {voteCount}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(post.id, "down");
            }}
            className="p-2 active:opacity-60 transition-opacity"
            aria-label="Downvote"
          >
            <ChevronDown
              size={16}
              className={
                post.userVote === "down" ? "text-orange-400" : "text-gray-400"
              }
            />
          </button>
        </div>

        {/* Comments */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(post.id);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 active:opacity-60 transition-opacity"
          aria-label="Comments"
        >
          <MessageCircle size={14} className="text-gray-400" />
          <span className="text-[13px] font-bold text-gray-500">
            {post.comments}
          </span>
        </button>

        {/* Save */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(post.id);
          }}
          className={`p-2 rounded-xl border transition-all active:scale-90 ${
            post.saved
              ? "bg-purple-50 border-purple-200 text-purple-500"
              : "bg-gray-50 border-gray-100 text-gray-400"
          }`}
          aria-label="Save"
        >
          <Bookmark size={14} className={post.saved ? "fill-purple-400" : ""} />
        </button>
      </div>
    </article>
  );
};

export default PostCard;
