import React from "react";

interface BodyTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  postType: string;
  userName: string;
}

const BodyTextarea: React.FC<BodyTextareaProps> = ({
  value,
  onChange,
  postType,
  userName,
}) => (
  <textarea
    rows={10}
    placeholder={
      postType === "discussion"
        ? `What's on your mind, ${userName}?`
        : postType === "question"
          ? "Describe your question in detail…"
          : postType === "resource"
            ? "Write a short description…"
            : "Write your announcement…"
    }
    value={value}
    onChange={onChange}
    className="w-full px-4 pt-3 pb-4 text-[15px] outline-none resize-none placeholder:text-gray-400"
    style={{ color: "#111827", background: "transparent", lineHeight: "1.75" }}
  />
);

export default BodyTextarea;
