"use client";
import React from "react";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}

interface ActionMenuProps {
  items: MenuItem[];
}

export default function ActionMenu({ items }: ActionMenuProps) {
  return (
    <div
      className="mx-4 rounded-2xl overflow-hidden divide-y divide-gray-100"
      style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors active:scale-[0.98]"
          style={{ background: "transparent" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = item.danger ? "#fef2f2" : "#f9f5ff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: item.danger ? "#fef2f2" : "#f3f0ff",
              border: `1px solid ${item.danger ? "#fecaca" : "#ddd6fe"}`,
            }}
          >
            {item.icon}
          </div>
          <span
            className="flex-1 text-[15px] font-semibold"
            style={{ color: item.danger ? "#ef4444" : "#1f2937" }}
          >
            {item.label}
          </span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={item.danger ? "#fca5a5" : "#d1d5db"}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ))}
    </div>
  );
}
