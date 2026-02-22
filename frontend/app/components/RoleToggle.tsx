"use client";
import React from "react";
import { Role } from "../dashboard/market/components/types";

interface RoleToggleProps {
  role: Role;
  onToggle: (role: Role) => void;
}

export default function RoleToggle({ role, onToggle }: RoleToggleProps) {
  const isSeller = role === "seller";

  return (
    <div
      className="flex items-center justify-between px-2 py-2 rounded-2xl"
      style={{
        background: "linear-gradient(135deg,#ede9fe55,#ddd6fe33)",
        border: "1.5px solid #ddd6fe",
      }}
    >
      {/* Buyer side */}
      <button
        onClick={() => !isSeller || onToggle("buyer")}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-250"
        style={{
          background: !isSeller ? "#fff" : "transparent",
          color: !isSeller ? "#6d28d9" : "#c4b5fd",
          boxShadow: !isSeller ? "0 2px 10px rgba(139,92,246,0.15)" : "none",
          border: !isSeller ? "1.5px solid #ddd6fe" : "1.5px solid transparent",
        }}
      >
        {/* Shopping bag icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        Buyer
      </button>

      {/* Divider */}
      <div
        className="w-px h-6 rounded-full"
        style={{ background: "#ddd6fe" }}
      />

      {/* Seller side */}
      <button
        onClick={() => isSeller || onToggle("seller")}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-250"
        style={{
          background: isSeller
            ? "linear-gradient(135deg,#8b5cf6,#6d28d9)"
            : "transparent",
          color: isSeller ? "#fff" : "#c4b5fd",
          boxShadow: isSeller ? "0 4px 14px rgba(109,40,217,0.35)" : "none",
          border: "1.5px solid transparent",
        }}
      >
        {/* Tag icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        Seller
      </button>
    </div>
  );
}
