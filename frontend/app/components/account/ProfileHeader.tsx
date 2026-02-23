"use client";
import React from "react";
import Image from "next/image";

interface ProfileHeaderProps {
  name: string;
  email: string;
  year: string;
  initials: string;
  imgSrc?: string;
  onUploadClick?: () => void;
  uploading?: boolean;
}

export default function ProfileHeader({
  name,
  email,
  year,
  initials,
  imgSrc,
  onUploadClick,
  uploading,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center pt-2 pb-6 px-5">
      {/* Avatar with upload button */}
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            padding: 3,
          }}
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={name}
              width={92}
              height={92}
              className="rounded-full object-cover w-full h-full"
              style={{ border: "3px solid #fff" }}
              unoptimized
            />
          ) : (
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-2xl font-extrabold text-white"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Camera button */}
        {onUploadClick && (
          <button
            onClick={onUploadClick}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
            style={{ background: "#7c3aed", border: "2px solid #fff" }}
            title={uploading ? "Uploading..." : "Change photo"}
          >
            {uploading ? (
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Name */}
      <h2 className="mt-4 text-[22px] font-extrabold text-violet-900 leading-tight text-center">
        {name}
      </h2>

      {/* Email */}
      <p className="mt-0.5 text-sm font-medium" style={{ color: "#9f7aea" }}>
        {email}
      </p>

      {/* Year badge */}
      <div className="mt-3">
        <span
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: "#f3f0ff",
            color: "#7c3aed",
            border: "1px solid #ddd6fe",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
          </svg>
          {year}
        </span>
      </div>
    </div>
  );
}
