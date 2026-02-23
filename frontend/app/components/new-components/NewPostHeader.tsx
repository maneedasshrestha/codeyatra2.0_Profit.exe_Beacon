import React from "react";

interface NewPostHeaderProps {
  canSubmit: boolean;
  submitting: boolean;
  handleSubmit: () => void;
}

const NewPostHeader: React.FC<NewPostHeaderProps> = ({
  canSubmit,
  submitting,
  handleSubmit,
}) => (
  <div
    className="sticky top-0 z-20 pt-6 pb-4 px-5"
    style={{
      background: "linear-gradient(180deg,#f3f4f6 70%,#f3f4f6cc 100%)",
      backdropFilter: "blur(20px)",
    }}
  >
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-3xl font-extrabold leading-none text-violet-900">
          Create Post
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: "#9f7aea" }}>
          What&apos;s happening in your community?
        </p>
      </div>
      {/* Post button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className="mt-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
        style={{
          background: canSubmit ? "#7c3aed" : "#ede9fe",
          color: canSubmit ? "#fff" : "#a78bfa",
          boxShadow: canSubmit ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
        }}
      >
        {submitting ? "Posting…" : "Post"}
      </button>
    </div>
  </div>
);

export default NewPostHeader;
