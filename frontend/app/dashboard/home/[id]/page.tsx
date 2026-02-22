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
      <div className="flex flex-col items-center justify-center h-dvh bg-[#F4F1FF] gap-3">
        <p className="text-gray-500 font-semibold">Post not found.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-bold"
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
    <div className="flex flex-col h-dvh bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#F4F1FF]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center active:scale-90 transition-transform shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-gray-400">
              {post.community}
            </p>
            <p className="text-[14px] font-bold text-gray-900 truncate leading-tight">
              {post.title}
            </p>
          </div>
        </div>
        <div className="h-px bg-linear-to-r from-transparent via-purple-100 to-transparent mx-4" />
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-36">
        {/* Post Card */}
        <div className="mx-4 mt-3 bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-4">
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar initials={post.authorInitials} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[14px] font-bold text-gray-900">
                    {post.author}
                  </span>
                </div>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {post.community} · {post.timeAgo}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-[18px] font-black text-gray-900 leading-snug mb-2">
              {post.title}
            </h1>

            {/* Full body text */}
            <p className="text-[14px] text-gray-600 leading-relaxed">
              {post.body}
            </p>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-gray-50" />

          {/* Action Bar */}
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Vote pill */}
            <div
              className={`flex items-center rounded-xl overflow-hidden border transition-colors ${
                userVote === "up"
                  ? "border-green-200 bg-green-50"
                  : userVote === "down"
                    ? "border-red-200 bg-red-50"
                    : "border-gray-100 bg-gray-50"
              }`}
            >
              <button
                onClick={() => handleVote("up")}
                className="p-2.5 active:opacity-60 transition-opacity"
              >
                <ChevronUp
                  size={17}
                  className={
                    userVote === "up" ? "text-green-500" : "text-gray-400"
                  }
                />
              </button>
              <span
                className={`text-[14px] font-black tabular-nums px-1 ${
                  userVote === "up"
                    ? "text-green-500"
                    : userVote === "down"
                      ? "text-red-400"
                      : "text-gray-700"
                }`}
              >
                {voteCount}
              </span>
              <button
                onClick={() => handleVote("down")}
                className="p-2.5 active:opacity-60 transition-opacity"
              >
                <ChevronDown
                  size={17}
                  className={
                    userVote === "down" ? "text-red-400" : "text-gray-400"
                  }
                />
              </button>
            </div>

            {/* Comment count */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <MessageCircle size={15} className="text-gray-400" />
              <span className="text-[13px] font-bold text-gray-500">
                {comments.length}
              </span>
            </div>

            {/* Save */}
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2.5 rounded-xl border transition-all active:scale-90 ${
                saved
                  ? "bg-purple-50 border-purple-200"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <Bookmark
                size={15}
                className={
                  saved ? "fill-purple-400 text-purple-500" : "text-gray-400"
                }
              />
            </button>

            {/* Share */}
            <button className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 active:opacity-60 transition-opacity">
              <Share2 size={15} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-4 mt-5 mb-2 flex items-center gap-2">
          <span className="font-semibold text-[15px] text-gray-400 uppercase">
            Replies
          </span>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[11px] font-bold">
            {comments.length}
          </span>
        </div>

        <div className="flex flex-col gap-3 px-4">
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
