"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, MessageCircle, GraduationCap, BookOpen, Building2, Award } from "lucide-react";
import Image from "next/image";
import { fetchUserProfile, UserProfile } from "@/lib/api";

interface UserProfileModalProps {
  userId: string;
  authorName: string;
  authorInitials: string;
  avatarUrl?: string;
  onClose: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  junior: "Junior",
  senior: "Senior",
  alumni: "Alumni",
  both: "Senior/Alumni",
};

const ROLE_COLORS: Record<string, string> = {
  junior: "bg-blue-100 text-blue-700",
  senior: "bg-violet-100 text-violet-700",
  alumni: "bg-amber-100 text-amber-700",
  both: "bg-emerald-100 text-emerald-700",
};

export default function UserProfileModal({
  userId,
  authorName,
  authorInitials,
  avatarUrl,
  onClose,
}: UserProfileModalProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchUserProfile(userId)
      .then((p) => setProfile(p))
      .finally(() => setLoading(false));
  }, [userId]);

  const initials = authorInitials || authorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const role = profile?.role ?? "";
  const roleLabel = ROLE_LABELS[role] ?? role;
  const roleColor = ROLE_COLORS[role] ?? "bg-gray-100 text-gray-700";

  const handleMessage = () => {
    onClose();
    const name = profile?.name ?? authorName;
    const ini = initials;
    router.push(
      `/dashboard/chat?userId=${encodeURIComponent(userId)}&name=${encodeURIComponent(name)}&initials=${encodeURIComponent(ini)}&role=${encodeURIComponent(roleLabel)}${
        avatarUrl ? `&avatarUrl=${encodeURIComponent(avatarUrl)}` : ""
      }`
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-[2rem] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] overflow-hidden max-w-lg mx-auto">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>

          <div className="px-6 pt-4 pb-36">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", padding: 3 }}
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={authorName}
                    width={76}
                    height={76}
                    className="rounded-full object-cover w-full h-full"
                    style={{ border: "3px solid #fff" }}
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-xl font-extrabold text-white"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
                  >
                    {initials}
                  </div>
                )}
              </div>

              <h2 className="text-[20px] font-extrabold text-gray-900 text-center leading-tight">
                {profile?.name ?? authorName}
              </h2>

              {role && (
                <span className={`mt-2 text-[12px] font-bold px-3 py-1 rounded-full ${roleColor}`}>
                  {roleLabel}
                </span>
              )}
            </div>

            {/* Profile details */}
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : profile ? (
              <div className="flex flex-col gap-3 mb-6">
                {profile.college && (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                    <Building2 size={18} className="text-violet-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">College</p>
                      <p className="text-[14px] font-bold text-gray-800">{profile.college}</p>
                    </div>
                  </div>
                )}
                {profile.stream && (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                    <BookOpen size={18} className="text-violet-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Stream</p>
                      <p className="text-[14px] font-bold text-gray-800">{profile.stream}</p>
                    </div>
                  </div>
                )}
                {profile.semester != null && profile.semester > 0 && (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                    <GraduationCap size={18} className="text-violet-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Semester</p>
                      <p className="text-[14px] font-bold text-gray-800">Semester {profile.semester}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-400 mb-6">No profile details available.</p>
            )}

            {/* Message button */}
            <button
              onClick={handleMessage}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-[15px] transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
            >
              <MessageCircle size={20} />
              Message {profile?.name?.split(" ")[0] ?? authorName.split(" ")[0]}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
