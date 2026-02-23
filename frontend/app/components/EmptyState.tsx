"use client";
import React from "react";
import { Role } from "../dashboard/market/types";

interface EmptyStateProps {
  role: Role;
}

export default function EmptyState({ role }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5"
        style={{
          background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
          boxShadow: "0 8px 32px rgba(139,92,246,0.18)",
        }}
      >
        {role === "seller" ? (
          // Box / package icon
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        ) : (
          // Shopping cart icon
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        )}
      </div>
      <p className="text-lg font-bold text-violet-800 mb-1">
        {role === "seller" ? "Nothing listed yet" : "Marketplace is empty"}
      </p>
      <p className="text-sm text-violet-400 max-w-xs">
        {role === "seller"
          ? "Tap the + button below to add your first item."
          : "Check back soon — sellers are loading up!"}
      </p>
    </div>
  );
}
