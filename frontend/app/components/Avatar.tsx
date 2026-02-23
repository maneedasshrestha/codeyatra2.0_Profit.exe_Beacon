import React from "react";
import Image from "next/image";

interface AvatarProps {
  initials: string;
  imgSrc?: string;
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({ initials, imgSrc, size = "md" }) => {
  const dim =
    size === "lg"
      ? "w-14 h-14 text-[16px]"
      : size === "md"
        ? "w-10 h-10 text-[14px]"
        : "w-8 h-8 text-[12px]";

  const px = size === "lg" ? 56 : size === "md" ? 40 : 32;

  // Use initials to determine a "unique" premium gradient
  const gradients = [
    "bg-gradient-to-br from-violet-400 to-violet-600",
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
  ];
  const charCode = initials.charCodeAt(0) || 0;
  const gradient = gradients[charCode % gradients.length];

  if (imgSrc) {
    return (
      <div
        className={`${dim} rounded-2xl overflow-hidden shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-white/20`}
      >
        <Image
          src={imgSrc}
          alt={initials}
          width={px}
          height={px}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={`${dim} rounded-2xl ${gradient} flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/20`}
    >
      <span className="font-extrabold text-white tracking-tight drop-shadow-sm uppercase">
        {initials}
      </span>
    </div>
  );
};

export default Avatar;
