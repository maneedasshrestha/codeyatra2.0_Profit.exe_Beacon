import React from "react";

interface UploadFABProps {
  onClick: () => void;
}

const UploadFAB: React.FC<UploadFABProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-32 right-5 w-14 h-14 rounded-2xl flex items-center justify-center z-30 active:scale-95 transition-transform"
    style={{
      background: "#7c3aed",
      boxShadow: "0 6px 24px rgba(124,58,237,0.4)",
    }}
  >
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  </button>
);

export default UploadFAB;
