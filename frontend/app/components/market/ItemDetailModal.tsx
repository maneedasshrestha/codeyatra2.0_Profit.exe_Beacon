"use client";
import React from "react";
import { MarketItem, Role } from "../../dashboard/market/types";

const PALETTE = [
  ["#f3e8ff", "#c084fc"],
  ["#fce7f3", "#f472b6"],
  ["#e0f2fe", "#38bdf8"],
  ["#dcfce7", "#4ade80"],
  ["#fef9c3", "#facc15"],
  ["#ffe4e6", "#fb7185"],
  ["#f0fdf4", "#34d399"],
  ["#eef2ff", "#818cf8"],
];

const CONDITION_COLOR: Record<string, { bg: string; text: string }> = {
  New: { bg: "#dcfce7", text: "#16a34a" },
  "Like New": { bg: "#dbeafe", text: "#1d4ed8" },
  Good: { bg: "#ede9fe", text: "#6d28d9" },
  Fair: { bg: "#fef9c3", text: "#92400e" },
  Poor: { bg: "#fee2e2", text: "#b91c1c" },
};

interface ItemDetailModalProps {
  item: MarketItem | null;
  open: boolean;
  role: Role;
  onClose: () => void;
  onBuy: (item: MarketItem) => void;
}

export default function ItemDetailModal({
  item,
  open,
  role,
  onClose,
  onBuy,
}: ItemDetailModalProps) {
  if (!open || !item) return null;

  const [bg, accent] = PALETTE[item.colorSeed % PALETTE.length];
  const condStyle = CONDITION_COLOR[item.condition] ?? { bg: "#ede9fe", text: "#6d28d9" };
  const listedDate = new Date(item.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(20,10,40,0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[390px] rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "#fff",
          boxShadow: "0 20px 70px rgba(109,40,217,0.25)",
          animation: "popIn 0.26s cubic-bezier(.34,1.56,.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image area */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 200 }}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg,${bg},${accent}44)` }}
            >
              <div
                className="rounded-2xl flex items-center justify-center"
                style={{
                  width: 80,
                  height: 80,
                  background: `${accent}33`,
                  boxShadow: `0 4px 24px ${accent}55`,
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: accent }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            </div>
          )}

          {/* Gradient overlay at bottom for readability */}
          {item.imageUrl && (
            <div
              className="absolute inset-x-0 bottom-0 h-16"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}
            />
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(6px)",
              color: "#7c3aed",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Condition badge */}
          <span
            className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: condStyle.bg, color: condStyle.text }}
          >
            {item.condition}
          </span>
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-5 flex flex-col gap-4">
          {/* Name & Price */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-extrabold text-gray-900 leading-snug flex-1">
              {item.name}
            </h2>
            <span
              className="shrink-0 text-base font-extrabold px-3 py-1.5 rounded-2xl mt-0.5"
              style={{ background: `${accent}22`, color: accent }}
            >
              रु{item.price.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Description */}
          <p className="text-base text-gray-500 leading-relaxed">
            {item.description}
          </p>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <InfoTile
              label="Seller"
              value={item.sellerName}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
            <InfoTile
              label="Location"
              value={item.location}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
            />
            <InfoTile
              label="Condition"
              value={item.condition}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              }
            />
            <InfoTile
              label="Listed On"
              value={listedDate}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />
          </div>

          {/* CTA */}
          {role === "buyer" && (
            <button
              onClick={() => onBuy(item)}
              className="w-full py-3.5 rounded-2xl font-extrabold text-white text-base active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                boxShadow: "0 6px 22px rgba(109,40,217,0.4)",
              }}
            >
              Request to Buy · रु{item.price.toLocaleString("en-IN")}
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes popIn {
          from { transform: scale(0.88); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function InfoTile({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-1.5 px-3.5 py-3 rounded-2xl"
      style={{ background: "#f7f7f9", border: "1.5px solid #ececf0" }}
    >
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-bold text-gray-800 leading-snug">{value}</p>
    </div>
  );
}
