import React from "react";

interface CharCountProps {
  count: number;
}

const CharCount: React.FC<CharCountProps> = ({ count }) => {
  if (count === 0) return null;
  return (
    <div className="px-4 pb-1 flex justify-end">
      <span
        className="text-[11px]"
        style={{ color: count > 900 ? "#ef4444" : "#d1d5db" }}
      >
        {count}/1000
      </span>
    </div>
  );
};

export default CharCount;
