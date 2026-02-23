"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Bookmark,
  Share2,
  Send,
} from "lucide-react";
import Avatar from "../../../components/Avatar";
import CommentCard, { CommentData } from "../../../components/CommentCard";
import NoReply from "@/app/components/NoReply";

interface Post {
  id: string;
  content: string;
  upvote_count: number;
  comment_count: number;
  user_name: string;
  user_avatar: string | null;
  created_at: string;
  college: string;
  semester: string;
}

export default function ThreadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth_token") ||
        sessionStorage.getItem("signup_token")
      : null;

  useEffect(() => {
    if (!id) return;
    fetchPost();
    fetchComments();
    fetchCurrentUser();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch post");
      setPost(data.post);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${id}`);
      const data = await res.json();
      if (data.comments) setComments(data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.user) setCurrentUserId(data.user.id);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || posting || !token) return;

    setPosting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      setNewComment("");
      fetchComments();
      fetchPost(); // refresh comment count
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to delete comment");
      fetchComments();
      fetchPost();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-[#FDFCFE] gap-4">
        <p className="text-gray-400 font-bold text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-[#FDFCFE] gap-4">
        <p className="text-gray-400 font-bold text-lg">
          {error || "Post not found"}
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-2xl bg-violet-500 text-white text-sm font-bold shadow-[0_8px_20px_rgba(139,92,246,0.3)] active:scale-95 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const voteCount = post.upvote_count;

  const handleVote = async (dir: "up" | "down") => {
    if (!token) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/upvote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setUserVote((prev) => (prev === dir ? null : dir));
        fetchPost();
      }
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  const initials = post.user_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = new Date(post.created_at).toLocaleString();

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
              {post.college} - Sem {post.semester}
            </span>
            <p className="text-[16px] font-bold text-gray-900 truncate leading-none">
              Post Detail
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
                <Avatar initials={initials} size="lg" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[15px] font-bold text-gray-900">
                    {post.user_name}
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 font-medium">
                  {post.college} · {timeAgo}
                </p>
              </div>
            </div>

            {/* Full body text */}
            <p className="text-[15px] text-gray-600 leading-relaxed font-medium opacity-90 whitespace-pre-wrap">
              {post.content}
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

        {/* Comment Input */}
        {token && (
          <form onSubmit={handlePostComment} className="mx-4 mb-4">
            <div className="flex gap-3 bg-white rounded-2xl border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] px-4 py-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 text-[14px] text-gray-700 placeholder-gray-400 bg-transparent outline-none"
              />
              <button
                type="submit"
                disabled={posting || !newComment.trim()}
                className="p-2 rounded-xl bg-violet-500 text-white disabled:opacity-40 active:scale-90 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-4 px-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={handleDeleteComment}
            />
          ))}

          {comments.length === 0 && <NoReply />}
        </div>
      </main>
    </div>
  );
}
