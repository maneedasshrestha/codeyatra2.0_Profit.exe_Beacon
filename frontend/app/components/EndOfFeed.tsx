import React from "react";

const EndOfFeed = () => {
  return (
    <div className="flex flex-col items-center gap-1.5 py-8 px-4">
      <p className="text-[12px] text-gray-400 font-medium text-center">
        You&apos;re all caught up!
      </p>
      <p className="text-[11px] text-gray-300 text-center">
        Check back later for new posts.
      </p>
    </div>
  );
};

export default EndOfFeed;
