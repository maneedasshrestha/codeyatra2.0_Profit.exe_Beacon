"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostCard from "../../components/PostCard";
import { Post } from "./mockData";
import EndOfFeed from "../../components/EndOfFeed";
import FilterPills from "@/app/components/FilterPills";

const HomePage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("signup_token");

    if (!token) {
      router.replace("/setup/login");
      return;
    }

    // Fetch user profile to get college and semester
    fetch("http://localhost:5000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((userData) => {
        if (!userData.profile) {
          router.replace("/setup/login");
          return;
        }

        const { college, semester } = userData.profile;

        // Fetch posts feed based on user's college and semester
        return fetch(
          `http://localhost:5000/feed?college=${encodeURIComponent(college)}&semester=${semester}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      })
      .then((r) => r?.json())
      .then((data) => {
        if (data?.posts) {
          // Transform backend posts to frontend Post type
          const transformedPosts: Post[] = data.posts.map((p: any) => {
            const authorName = p.user_name || "Anonymous";
            const initials = authorName
              .split(" ")
              .map((w: string) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return {
              id: p.id,
              community: `c/${p.college}-${p.semester}`,
              author: authorName,
              authorInitials: initials,
              isSenior: false,
              timeAgo: getTimeAgo(p.created_at),
              title:
                p.content.substring(0, 60) +
                (p.content.length > 60 ? "..." : ""),
              body: p.content,
              upvotes: p.upvote_count || 0,
              comments: p.comment_count || 0,
              userVote: null, // TODO: check if user has upvoted
              tags: [],
              saved: false,
            };
          });
          setPosts(transformedPosts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function getTimeAgo(timestamp: string): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  const handleVote = async (id: number, dir: "up" | "down") => {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("signup_token");
    if (!token) return;

    const post = posts.find((p) => p.id === id);
    const isTogglingOff = post?.userVote === dir;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              userVote: isTogglingOff ? null : dir,
              upvotes: isTogglingOff
                ? p.upvotes - 1
                : p.upvotes + (p.userVote ? 0 : 1),
            }
          : p,
      ),
    );

    try {
      await fetch(`http://localhost:5000/api/posts/${id}/upvote`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to upvote:", err);
      // Revert on error
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, userVote: post?.userVote || null } : p,
        ),
      );
    }
  };

  const handleSave = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)),
    );
  };

  const handleNavigate = (id: number) => {
    router.push(`/dashboard/home/${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-dvh bg-[#F8F7FA] items-center justify-center">
        <p className="text-gray-400 text-sm">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-[#F8F7FA] overflow-hidden">
      <div className="sticky top-0 z-20 bg-[#F8F7FA]/80 backdrop-blur-2xl">
        <FilterPills />
        <div className="h-px bg-linear-to-r from-transparent via-violet-100 to-transparent mx-4" />
      </div>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="flex flex-col gap-4 pt-2">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onVote={handleVote}
              onSave={handleSave}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
        <EndOfFeed />
      </main>
    </div>
  );
};

export default HomePage;
