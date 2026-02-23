import React from "react";

const ResourceEmptyState: React.FC = () => (
  <div className="flex flex-col items-center py-16 text-center">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ background: "#f3f0ff" }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c4b5fd"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    </div>
    <p className="text-base font-bold text-gray-400">No resources found</p>
    <p className="text-sm text-gray-300 mt-0.5">Try a different filter</p>
  </div>
);

export default ResourceEmptyState;
