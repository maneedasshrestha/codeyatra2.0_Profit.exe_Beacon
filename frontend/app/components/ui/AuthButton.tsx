"use client";
import React from "react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline";
}

export function AuthButton({ children, loading, variant = "primary", className = "", ...props }: AuthButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[15px] transition-all active:scale-[0.98] disabled:opacity-60 ${className}`}
      style={
        isPrimary
          ? {
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              color: "#fff",
              boxShadow: "0 6px 20px rgba(124,58,237,0.28)",
            }
          : {
              background: "#f5f3ff",
              color: "#7c3aed",
              border: "1.5px solid #ddd6fe",
            }
      }
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : children}
    </button>
  );
}
