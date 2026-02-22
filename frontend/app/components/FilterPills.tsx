import React, { useState } from "react";
import { FILTERS } from "../dashboard/home/mockData";

const FilterPills = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-none">
      {FILTERS.map((f, i) => (
        <button
          key={f.label}
          onClick={() => setActive(i)}
          className={`shrink-0 flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 ${active === i
              ? "bg-violet-500 text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)] scale-105"
              : "bg-white/80 backdrop-blur-md text-gray-400 border border-gray-100 hover:border-violet-200 hover:text-violet-500"
            }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default FilterPills;
