import React from "react";
import { AttachedFile } from "../../components/AttachmentSection";

interface AttachedFileListProps {
  files: AttachedFile[];
  onRemove: (id: string) => void;
  kind: "file" | "image";
}

const icon = (kind: "file" | "image") =>
  kind === "image" ? (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ) : (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );

const bg = (kind: "file" | "image") =>
  kind === "image" ? "#c026d3" : "#7c3aed";
const border = (kind: "file" | "image") =>
  kind === "image" ? "#f0abfc" : "#ede9fe";
const cardBg = (kind: "file" | "image") =>
  kind === "image" ? "#fdf4ff" : "#f9f5ff";

const AttachedFileList: React.FC<AttachedFileListProps> = ({
  files,
  onRemove,
  kind,
}) => {
  if (files.length === 0) return null;
  return (
    <div className="px-4 pb-3 flex flex-col gap-2">
      {files.map((f) => (
        <div
          key={f.id}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{
            background: cardBg(kind),
            border: `1px solid ${border(kind)}`,
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: bg(kind) }}
          >
            {icon(kind)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">
              {f.name}
            </p>
            <p className="text-[10px] text-gray-400">
              {(f.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            onClick={() => onRemove(f.id)}
            className="text-gray-300 hover:text-red-400 transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachedFileList;
