import React from "react";

const EndOfFeed = () => {
  return (
    <div className="flex flex-col items-center gap-2 py-12 px-6">
      <div className="w-12 h-1 bg-violet-100 rounded-full mb-2 opacity-50" />
      <p className="text-[14px] text-gray-500 font-extrabold text-center tracking-tight">
        You&apos;re all caught up!
      </p>
      <p className="text-[13px] text-gray-400 font-medium text-center opacity-80">
        Check back later for new stories and conversations.
      </p>
    </div>
  );
};

export default EndOfFeed;
