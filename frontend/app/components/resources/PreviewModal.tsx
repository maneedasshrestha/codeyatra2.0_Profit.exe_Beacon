import React, { useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const ts = TYPE_COLORS[resource.type] ?? {
    bg: "#f3f4f6",
    text: "#6b7280",
    border: "#e5e7eb",
  };

  const isImage = resource.fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  const isPdf = resource.fileUrl?.match(/\.pdf$/i);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col animate-in fade-in zoom-in duration-200"
      style={{
        background: "rgba(10, 10, 15, 0.95)",
        backdropFilter: "blur(20px)"
      }}
    >
      {/* Dynamic Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${ts.text} 0%, transparent 70%)`
        }}
      />

      {/* Modern Glass Header */}
      <div
        className="flex items-center gap-4 px-6 py-4 shrink-0 relative z-10 border-b border-white/10"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)"
        }}
      >
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 active:scale-90 transition-all hover:bg-white/10 group"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-white/60 group-hover:text-white"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-bold text-white truncate leading-tight">
            {resource.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border"
              style={{
                background: `${ts.text}20`,
                color: ts.text,
                borderColor: `${ts.text}40`
              }}
            >
              {resource.type}
            </span>
            <span className="text-[11px] text-white/40 font-medium">
              By {resource.author} &bull; {resource.size}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-[13px] active:scale-95 transition-all"
            style={{
              background: "#7c3aed",
              color: "#fff",
              boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            GET FILE
          </a>
        </div>
      </div>

      {/* Enhanced Preview Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-transparent">
            <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-violet-500 animate-spin mb-4" />
            <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Loading Preview...</p>
          </div>
        )}

        {resource.fileUrl ? (
          <div className="w-full h-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative z-10 bg-black/40 border border-white/5">
            {isImage ? (
              <img
                src={resource.fileUrl}
                alt={resource.title}
                className={`w-full h-full object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setError(true);
                  setLoading(false);
                }}
              />
            ) : isPdf ? (
              <iframe
                src={`${resource.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className={`w-full h-full border-0 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
                title={resource.title}
                onLoad={() => setLoading(false)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-12 bg-white/[0.02]">
                <div
                  className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center relative group"
                  style={{ background: `linear-gradient(135deg, ${ts.text}40, ${ts.text}10)` }}
                >
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity"
                    style={{ background: ts.text }}
                  />
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={ts.text}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="text-center max-w-sm">
                  <h4 className="text-xl font-black text-white mb-2 leading-tight">Preview Unavailable</h4>
                  <p className="text-white/40 text-sm font-medium leading-relaxed">
                    This file format cannot be rendered directly in the browser. Please download it to view all details.
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-white/50 uppercase tracking-widest">
                      {resource.semester} SEM
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-white/50 uppercase tracking-widest">
                      {resource.subject}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-white/20 font-black text-4xl italic tracking-tighter opacity-10 select-none">
            RESOURCE NOT FOUND
          </div>
        )}
      </div>

      {/* Subtle Bottom Accent */}
      <div
        className="h-1.5 w-full shrink-0"
        style={{ background: `linear-gradient(90deg, transparent, ${ts.text}, transparent)` }}
      />
    </div>
  );
};

export default PreviewModal;
