import React from "react";

interface UserRowProps {
  user: { name: string; batch: string; initials: string };
  visibility: "public" | "batch";
  setVisibility: (v: "public" | "batch") => void;
  postType: string;
}

const UserRow: React.FC<UserRowProps> = ({
  user,
  visibility,
  setVisibility,
  postType,
}) => (
  <div className="flex items-center gap-3 px-4 pt-5 pb-5">
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
      style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
    >
      {user.initials}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[20px] font-bold text-gray-900 leading-tight">
        {user.name}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        {/* Visibility pill */}
        <button
          onClick={() =>
            setVisibility(visibility === "public" ? "batch" : "public")
          }
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-semibold"
          style={{
            background: "#f3f4f6",
            color: "#374151",
            border: "1px solid #e5e7eb",
          }}
        >
          {visibility === "public" ? (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Public
            </>
          ) : (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Batch only
            </>
          )}
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {/* post type badge */}
        <span className="text-[13px] text-violet-600 font-semibold capitalize">
          {postType}
        </span>
      </div>
    </div>
  </div>
);

export default UserRow;
