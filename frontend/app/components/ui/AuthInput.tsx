"use client";
import React, { useState } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export function AuthInput({ label, icon, error, type, ...props }: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        className="text-[11px] font-bold tracking-widest uppercase"
        style={{ color: focused ? "#7c3aed" : "#9ca3af" }}
      >
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 px-4 rounded-2xl transition-all duration-200"
        style={{
          background: focused ? "#faf8ff" : "#f5f3ff",
          border: `1.5px solid ${error ? "#f87171" : focused ? "#7c3aed" : "#ddd6fe"}`,
          boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.08)" : "none",
          height: 52,
        }}
      >
        {icon && (
          <span style={{ color: focused ? "#7c3aed" : "#c4b5fd", flexShrink: 0 }}>
            {icon}
          </span>
        )}
        <input
          type={isPassword ? (showPw ? "text" : "password") : type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none text-[14px] font-medium placeholder:text-[#c4b5fd]"
          style={{ color: "#1f1235" }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="shrink-0"
            tabIndex={-1}
            style={{ color: "#c4b5fd" }}
          >
            {showPw ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[11px] font-semibold" style={{ color: "#f87171" }}>{error}</p>
      )}
    </div>
  );
}
