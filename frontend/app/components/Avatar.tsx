import React from "react";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({ initials, size = "md" }) => {
  const dim =
    size === "lg"
      ? "w-12 h-12 text-[15px]"
      : size === "md"
        ? "w-9 h-9 text-[13px]"
        : "w-7 h-7 text-[11px]";
  return (
    <div
      className={`${dim} rounded-full bg-blue-400 flex items-center justify-center shrink-0 shadow-sm`}
    >
      <span className="font-bold text-white tracking-tight">{initials}</span>
    </div>
  );
};

export default Avatar;
