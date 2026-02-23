import React from "react";
import { AttachedLink } from "../../components/AttachmentSection";

interface AttachedLinkListProps {
  links: AttachedLink[];
  onRemove: (id: string) => void;
}

const AttachedLinkList: React.FC<AttachedLinkListProps> = ({
  links,
  onRemove,
}) => {
  if (links.length === 0) return null;
  return (
    <div className="px-4 pb-2 flex flex-col gap-2">
      {links.map((l) => (
        <div
          key={l.id}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
          style={{ background: "#f9f5ff", border: "1px solid #ede9fe" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#6d28d9" }}
          >
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
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <p className="flex-1 text-xs font-medium text-gray-700 truncate">
            {l.url.replace(/^https?:\/\//, "")}
          </p>
          <button
            onClick={() => onRemove(l.id)}
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

export default AttachedLinkList;
