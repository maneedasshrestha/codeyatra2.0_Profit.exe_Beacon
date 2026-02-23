"use client";
import React, { useState } from "react";
import { MarketItem } from "../dashboard/market/components/types";

interface BuyConfirmModalProps {
  item: MarketItem | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BuyConfirmModal({
  item,
  open,
  onClose,
  onConfirm,
}: BuyConfirmModalProps) {
  const [confirming, setConfirming] = useState(false);

  if (!open || !item) return null;

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 600));
    setConfirming(false);
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: "rgba(30,10,60,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] rounded-3xl p-6 flex flex-col gap-4"
        style={{
          background: "linear-gradient(160deg,#f5f3ff,#fff)",
          boxShadow: "0 12px 60px rgba(109,40,217,0.25)",
          animation: "popIn 0.26s cubic-bezier(.34,1.56,.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
              boxShadow: "0 4px 20px rgba(139,92,246,0.2)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-extrabold text-violet-900 mb-1">
            Confirm Request
          </h3>
          <p className="text-sm text-gray-500">
            Send a purchase request for{" "}
            <span className="font-bold text-violet-700">{item.name}</span>
          </p>
        </div>

        {/* Price pill */}
        <div
          className="mx-auto px-6 py-2 rounded-2xl font-extrabold text-violet-700 text-lg"
          style={{
            background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
          }}
        >
          रु{item.price.toLocaleString("en-IN")}
        </div>

        <div className="flex gap-3 mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl font-bold text-sm border-2 active:scale-95 transition-transform"
            style={{
              borderColor: "#ddd6fe",
              color: "#7c3aed",
              background: "#faf5ff",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="flex-1 py-3 rounded-2xl font-extrabold text-white text-sm active:scale-95 transition-transform"
            style={{
              background: confirming
                ? "#a78bfa"
                : "linear-gradient(135deg,#8b5cf6,#6d28d9)",
              boxShadow: "0 4px 16px rgba(109,40,217,0.35)",
              transition: "background 0.2s, transform 0.12s",
            }}
          >
            {confirming ? "Sending…" : "Confirm Request"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes popIn {
          from {
            transform: scale(0.82);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
