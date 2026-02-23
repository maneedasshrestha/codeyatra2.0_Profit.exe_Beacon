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
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
}

const ResourceListItem: React.FC<ResourceListItemProps> = ({
  resource,
  onClick,
  onUpvote,
  onDownvote,
}) => {
  const ts = TYPE_COLORS[resource.type] ?? {
    bg: "#f3f4f6",
    text: "#6b7280",
    border: "#e5e7eb",
  };

  const handleVote = (e: React.MouseEvent, type: "up" | "down") => {
    e.stopPropagation();
    if (type === "up") onUpvote(resource.id);
    else onDownvote(resource.id);
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full text-left active:scale-[0.99] transition-all cursor-pointer group"
      style={{
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        border: "1px solid #f3f4f6"
      }}
    >
      {/* Vote Controls */}
      <div className="flex flex-col items-center gap-1.5 mr-1 pr-3 border-r border-gray-100">
        <button
          onClick={(e) => handleVote(e, "up")}
          className={`p-1.5 rounded-lg transition-colors ${resource.has_upvoted ? 'bg-violet-50 text-violet-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={resource.has_upvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
        <span className={`text-[12px] font-black tabular-nums ${resource.has_upvoted ? 'text-violet-600' : resource.has_downvoted ? 'text-red-500' : 'text-gray-500'}`}>
          {(resource.upvotes_count || 0) - (resource.downvotes_count || 0)}
        </span>
        <button
          onClick={(e) => handleVote(e, "down")}
          className={`p-1.5 rounded-lg transition-colors ${resource.has_downvoted ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={resource.has_downvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* File Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: ts.bg }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={ts.text}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-gray-900 truncate leading-snug group-hover:text-violet-600 transition-colors">
          {resource.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-[11px] text-gray-400 font-medium truncate">
            {resource.author} &middot; Sem {resource.semester}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceListItem;
