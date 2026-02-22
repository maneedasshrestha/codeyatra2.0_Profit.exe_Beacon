"use client";
import React from "react";

interface Credential {
  label: string;
  value: string;
}

interface AcademicCardProps {
  credentials: Credential[];
}

export default function AcademicCard({ credentials }: AcademicCardProps) {
  return (
    <div
      className="mx-4 rounded-2xl overflow-hidden"
      style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        <span
          className="text-[11px] font-bold tracking-widest uppercase"
          style={{ color: "#a78bfa", letterSpacing: "0.1em" }}
        >
          Academic Profile
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 px-5 pb-5 pt-1">
        {credentials.map((c) => (
          <div key={c.label}>
            <p className="text-[11px] font-medium text-gray-400 mb-0.5">{c.label}</p>
            <p className="text-[14px] font-bold text-gray-900 leading-snug">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
