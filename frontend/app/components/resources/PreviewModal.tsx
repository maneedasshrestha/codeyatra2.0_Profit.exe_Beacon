import React from "react";
import { Resource } from "../../dashboard/resources/mockData";

const TYPE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Notes: { bg: "#f3f0ff", text: "#7c3aed", border: "#ddd6fe" },
  "Past Papers": { bg: "#fef9c3", text: "#b45309", border: "#fde68a" },
  "Lab Report": { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" },
  Cheatsheet: { bg: "#fdf4ff", text: "#c026d3", border: "#f0abfc" },
};

interface PreviewModalProps {
  resource: Resource;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ resource, onClose }) => {
  const ts = TYPE_COLORS[resource.type] ?? {
    bg: "#f3f4f6",
    text: "#6b7280",
    border: "#e5e7eb",
  };
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#0f0f0f" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 pt-5 pb-3 shrink-0"
        style={{ background: "#1a1a2e" }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white truncate leading-snug">
            {resource.title}
          </p>
          <p className="text-[11px] font-medium" style={{ color: "#a78bfa" }}>
            {resource.author} &middot; {resource.size}
          </p>
        </div>
        <a
          href={resource.fileUrl ?? "#"}
          download={resource.fileUrl ? resource.title : undefined}
          onClick={!resource.fileUrl ? (e) => e.preventDefault() : undefined}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[12px] active:scale-95 transition-transform"
          style={{
            background: "#7c3aed",
            color: "#fff",
            boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </a>
      </div>

      {/* PDF preview area */}
      <div className="flex-1 overflow-hidden relative">
        {resource.fileUrl ? (
          <iframe
            src={resource.fileUrl}
            className="w-full h-full border-0"
            title={resource.title}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: ts.bg }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke={ts.text}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-[16px] mb-1">
                {resource.title}
              </p>
              <p
                className="text-[13px] font-medium mb-3"
                style={{ color: "#a78bfa" }}
              >
                Sem {resource.semester} &middot; {resource.course} &middot;{" "}
                {resource.subject}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span
                  className="text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ background: ts.bg, color: ts.text }}
                >
                  {resource.type}
                </span>
              </div>
              <p className="text-[12px] mt-5" style={{ color: "#6b7280" }}>
                No preview available &middot; tap Download to save
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
