import React from "react";
import { Resource } from "../../dashboard/resources/mockData";

const TYPE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  pdf: { bg: "#fee2e2", text: "#dc2626", border: "#fecaca" },
  doc: { bg: "#dbeafe", text: "#0284c7", border: "#bae6fd" },
  video: { bg: "#fef3c7", text: "#d97706", border: "#fde68a" },
  image: { bg: "#e0e7ff", text: "#6366f1", border: "#c7d2fe" },
};

interface ResourceListItemProps {
  resource: Resource;
  onClick: () => void;
}

const ResourceListItem: React.FC<ResourceListItemProps> = ({
  resource,
  onClick,
}) => {
  const ts = TYPE_COLORS[resource.type] ?? {
    bg: "#f3f4f6",
    text: "#6b7280",
    border: "#e5e7eb",
  };
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-4 rounded-2xl w-full text-left active:scale-[0.98] transition-transform"
      style={{ background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: ts.bg }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={ts.text}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-gray-900 truncate leading-snug">
          {resource.title}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
          {resource.author} &middot; Sem {resource.semester} &middot;{" "}
          {resource.size}
        </p>
      </div>
    </button>
  );
};

export default ResourceListItem;
