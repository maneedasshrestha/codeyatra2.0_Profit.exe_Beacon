import React from "react";

interface PostDoneStateProps {
  resetAll: () => void;
}

const PostDoneState: React.FC<PostDoneStateProps> = ({ resetAll }) => (
  <div
    className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    style={{ background: "#f3f4f6" }}
  >
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
      style={{ background: "#7c3aed" }}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-1">Post Published!</h2>
    <p className="text-sm text-gray-500 mb-6">
      Your post is now live on the feed.
    </p>
    <button
      onClick={resetAll}
      className="px-6 py-2.5 rounded-full font-semibold text-white text-sm"
      style={{ background: "#7c3aed" }}
    >
      Create Another
    </button>
  </div>
);

export default PostDoneState;
