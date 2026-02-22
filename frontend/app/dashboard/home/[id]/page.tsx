"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Bookmark,
  Share2,
} from "lucide-react";
import { POSTS_DATA, Post } from "../mockData";
import Avatar from "../../../components/Avatar";
import CommentCard from "../../../components/CommentCard";
import { COMMENTS_BY_POST, Comment } from "./mockData";
import NoReply from "@/app/components/NoReply";

export default function ThreadPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const post: Post | undefined = POSTS_DATA.find((p) => p.id === id);

  const [saved, setSaved] = useState(post?.saved ?? false);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(
    post?.userVote ?? null,
  );
  const [comments, setComments] = useState<Comment[]>(
    COMMENTS_BY_POST[id] ?? [],
  );

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-[#FDFCFE] gap-4">
        <p className="text-gray-400 font-bold text-lg">Post not found.</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-2xl bg-violet-500 text-white text-sm font-bold shadow-[0_8px_20px_rgba(139,92,246,0.3)] active:scale-95 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const voteCount =
    userVote === "up"
      ? post.upvotes + 1
      : userVote === "down"
        ? post.upvotes - 1
        : post.upvotes;

  const handleVote = (dir: "up" | "down") => {
    setUserVote((prev) => (prev === dir ? null : dir));
  };

  const handleLike = (commentId: number) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, liked: !c.liked } : c)),
    );
  };

  return (
    <div className="flex flex-col h-dvh bg-[#F8F7FA] overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-black/3">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center active:scale-90 transition-transform shrink-0 hover:border-violet-200"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <span className="text-[12px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-lg mb-1 inline-block">
              {post.community}
            </span>
            <p className="text-[16px] font-bold text-gray-900 truncate leading-none">
              {post.title}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-40">
        {/* Post Card */}
        <div className="mx-4 mt-4 bg-white rounded-[2.5rem] border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="px-6 pt-6 pb-6">
            {/* Author */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <Avatar initials={post.authorInitials} size="lg" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[15px] font-bold text-gray-900">
                    {post.author}
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 font-medium">
                  {post.community} · {post.timeAgo}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-[22px] font-bold text-gray-900 leading-[1.2] mb-3 tracking-tight">
              {post.title}
            </h1>

            {/* Full body text */}
            <p className="text-[15px] text-gray-600 leading-relaxed font-medium opacity-90">
              {post.body}
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-4 px-6 py-5 bg-gray-50/30 border-t border-gray-50/50">
            {/* Vote pill */}
            <div
              className={`flex items-center rounded-2xl overflow-hidden border transition-all duration-300 ${
                userVote === "up"
                  ? "border-green-200 bg-green-100/50"
                  : userVote === "down"
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200/50 bg-white"
              }`}
            >
              <button
                onClick={() => handleVote("up")}
                className={`p-3 transition-all ${
                  userVote === "up"
                    ? "bg-green-500 text-white"
                    : "hover:bg-violet-50 text-gray-400 hover:text-violet-500"
                }`}
              >
                <ChevronUp size={20} />
              </button>
              <span
                className={`text-[15px] font-black tabular-nums px-3 ${
                  userVote === "up"
                    ? "text-green-600"
                    : userVote === "down"
                      ? "text-red-500"
                      : "text-gray-700"
                }`}
              >
                {voteCount}
              </span>
              <button
                onClick={() => handleVote("down")}
                className={`p-3 transition-all ${
                  userVote === "down"
                    ? "bg-red-500 text-white"
                    : "hover:bg-orange-50 text-gray-400 hover:text-orange-500"
                }`}
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Comment count */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-gray-200/50">
              <MessageCircle size={18} className="text-gray-400" />
              <span className="text-[15px] font-bold text-gray-600">
                {comments.length}
              </span>
            </div>

            {/* Save */}
            <button
              onClick={() => setSaved(!saved)}
              className={`ml-auto p-3 rounded-2xl border transition-all active:scale-90 ${
                saved
                  ? "bg-violet-500 border-violet-500 text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
                  : "bg-white border-gray-200/50 text-gray-400 hover:border-violet-200"
              }`}
            >
              <Bookmark size={18} className={saved ? "fill-white" : ""} />
            </button>

            {/* Share */}
            <button className="p-3 rounded-2xl bg-white border border-gray-200/50 active:opacity-60 transition-all hover:bg-gray-50">
              <Share2 size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-6 mt-8 mb-4 flex items-center justify-between">
          <span className="font-extrabold text-[16px] text-gray-900 tracking-tight">
            Replies
          </span>
          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-600 text-[12px] font-black shadow-[0_2px_8px_rgba(139,92,246,0.1)]">
            {comments.length}
          </span>
        </div>

        <div className="flex flex-col gap-4 px-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onLike={handleLike}
            />
          ))}

          {comments.length === 0 && <NoReply />}
        </div>
      </main>
    </div>
  );
}
