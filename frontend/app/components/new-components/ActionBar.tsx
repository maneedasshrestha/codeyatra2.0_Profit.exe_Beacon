import React, { RefObject } from "react";

interface ActionBarProps {
  imgRef: RefObject<HTMLInputElement | null>;
  fileRef: RefObject<HTMLInputElement | null>;
  handleAddImage: (fl: FileList) => void;
  handleAddFile: (fl: FileList) => void;
  setShowLinkInput: (cb: (v: boolean) => boolean) => void;
  setShowTags: (cb: (v: boolean) => boolean) => void;
  tagsCount: number;
}

const ActionBar: React.FC<ActionBarProps> = ({
  imgRef,
  fileRef,
  handleAddImage,
  handleAddFile,
  setShowLinkInput,
  setShowTags,
  tagsCount,
}) => (
  <div className="flex items-center px-3 py-3 gap-1">
    <span className="text-xs font-medium text-gray-400 mr-1">Add to post</span>
    {/* Image upload */}
    <button
      onClick={() => imgRef.current?.click()}
      title="Upload Image"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 hover:bg-gray-100"
      style={{ color: "#c026d3" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      PNG
    </button>
    <input
      ref={imgRef}
      type="file"
      accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
      multiple
      className="hidden"
      onChange={(e) => e.target.files && handleAddImage(e.target.files)}
    />
    {/* PDF upload */}
    <button
      onClick={() => fileRef.current?.click()}
      title="Upload PDF / Doc"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 hover:bg-gray-100"
      style={{ color: "#7c3aed" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      PDF
    </button>
    <input
      ref={fileRef}
      type="file"
      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
      multiple
      className="hidden"
      onChange={(e) => e.target.files && handleAddFile(e.target.files)}
    />
    {/* Link */}
    <button
      onClick={() => setShowLinkInput((v) => !v)}
      title="Add link"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 hover:bg-gray-100"
      style={{ color: "#2563eb" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      Link
    </button>
    {/* Tags */}
    <button
      onClick={() => setShowTags((v) => !v)}
      title="Add tags"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 hover:bg-gray-100"
      style={{ color: "#16a34a" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
      Tags{" "}
      {tagsCount > 0 && (
        <span
          className="ml-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white"
          style={{ background: "#16a34a" }}
        >
          {tagsCount}
        </span>
      )}
    </button>
  </div>
);

export default ActionBar;
