"use client";
import React, { useState } from "react";
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

function getColor(seed: number) {
  return PALETTE[seed % PALETTE.length];
}

interface ItemCardProps {
  item: MarketItem;
  role: Role;
  isNew?: boolean;
  isWishlisted?: boolean;
  currentUserId?: string;
  onBuy: (item: MarketItem) => void;
  onDelete: (id: string) => void;
  onViewDetail: (item: MarketItem) => void;
  onWishlist?: (item: MarketItem) => void;
}

export default function ItemCard({
  item,
  role,
  isNew = false,
  isWishlisted = false,
  currentUserId,
  onBuy,
  onDelete,
  onViewDetail,
  onWishlist,
}: ItemCardProps) {
  const [pressed, setPressed] = useState(false);
  const [bg, accent] = getColor(item.colorSeed);

  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: "#fff",
        border: "2px solid #ede9fe",
        boxShadow:
          "0 4px 24px rgba(139,92,246,0.13), 0 1.5px 6px rgba(139,92,246,0.08)",
        transition:
          "transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.transform = "scale(1.025)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.transform = "scale(1)")
      }
    >
      {/* Image area – clickable for detail */}
      <div
        className="w-full cursor-pointer relative overflow-hidden"
        style={{ height: 130 }}
        onClick={() => onViewDetail(item)}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${bg}, ${accent}44)`,
            }}
          >
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                background: `${accent}33`,
                boxShadow: `0 4px 16px ${accent}55`,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: accent, opacity: 0.85 }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>
        )}

        {/* Price pill */}
        <div
          className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: "#ffffff",
            color: "#000000",
            border: `1px solid #e0e0e0`,
            backdropFilter: "blur(4px)",
          }}
        >
          रु{item.price.toLocaleString("en-IN")}
        </div>

        {/* New badge */}
        {isNew && (
          <div
            className="absolute top-3 left-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wide"
            style={{
              background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(109,40,217,0.4)",
            }}
          >
            NEW
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p
          className="font-bold text-gray-800 text-base leading-snug line-clamp-1 cursor-pointer hover:text-violet-700 transition-colors"
          onClick={() => onViewDetail(item)}
        >
          {item.name}
        </p>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {role === "buyer" ? (
          <div className="mt-auto flex items-center gap-2">
            <button
              onPointerDown={() => setPressed(true)}
              onPointerUp={() => setPressed(false)}
              onPointerLeave={() => setPressed(false)}
              onClick={() => onViewDetail(item)}
              className="flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all"
              style={{
                background: "#f5f3ff",
                color: "#6d28d9",
                border: "2px solid #ddd6fe",
                transform: pressed ? "scale(0.96)" : "scale(1)",
                transition: "transform 0.12s",
              }}
            >
              View Details
            </button>
            <button
              onClick={() => onWishlist?.(item)}
              className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-90 transition-transform shrink-0"
              style={{
                background: isWishlisted ? "#ede9fe" : "#f5f3ff",
                border: isWishlisted
                  ? "2px solid #c4b5fd"
                  : "2px solid #ddd6fe",
                boxShadow: isWishlisted
                  ? "0 2px 10px rgba(139,92,246,0.18)"
                  : "none",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill={isWishlisted ? "#7c3aed" : "none"}
                stroke="#7c3aed"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="mt-auto">
            {currentUserId && item.user_id && currentUserId === item.user_id ? (
              <button
                onClick={() => onDelete(item.id)}
                className="w-full py-2.5 rounded-2xl font-semibold text-sm active:scale-95 transition-transform"
                style={{
                  background: "#fef2f2",
                  color: "#ef4444",
                  border: "2px solid #fca5a5",
                }}
              >
                Delete
              </button>
            ) : (
              <div
                className="w-full py-2.5 rounded-2xl text-xs text-center font-medium"
                style={{ color: "#a0a0a0" }}
              >
                Listed by {item.sellerName}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
