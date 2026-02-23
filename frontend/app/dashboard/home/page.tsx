"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "../../components/PostCard";
import { POSTS_DATA, Post, FILTERS } from "./mockData";
import EndOfFeed from "../../components/EndOfFeed";
import FilterPills from "@/app/components/FilterPills";

const HomePage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(POSTS_DATA);

  const handleVote = (id: number, dir: "up" | "down") => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, userVote: p.userVote === dir ? null : dir } : p,
      ),
    );
  };

  const handleSave = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)),
    );
  };

  const handleNavigate = (id: number) => {
    router.push(`/dashboard/home/${id}`);
  };

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
