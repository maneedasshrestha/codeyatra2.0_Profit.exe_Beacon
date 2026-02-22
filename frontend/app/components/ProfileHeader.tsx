"use client";
import React from "react";
import Image from "next/image";

interface ProfileHeaderProps {
  name: string;
  email: string;
  year: string;
  initials: string;
  imgSrc?: string;
}

export default function ProfileHeader({ name, email, year, initials, imgSrc }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center pt-2 pb-6 px-5">
      {/* Avatar */}
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
          style={{ background: "#f3f0ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/>
          </svg>
          {year}
        </span>
      </div>
    </div>
  );
}
