import React from "react";

interface TitleInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  postType: string;
}

const TitleInput: React.FC<TitleInputProps> = ({
  value,
  onChange,
  postType,
}) => (
  <div className="px-4 pt-4">
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-2xl"
      style={{ background: "#f9f5ff", border: "1.5px solid #ddd6fe" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      <input
        type="text"
        placeholder={
          postType === "question"
            ? "Your question in one line…"
            : postType === "announcement"
              ? "Notice heading…"
              : "Resource title…"
        }
        value={value}
        onChange={onChange}
        className="flex-1 text-[15px] font-semibold outline-none placeholder:text-[#c4b5fd] bg-transparent"
        style={{ color: "#4c1d95" }}
      />
    </div>
  </div>
);

export default TitleInput;
