import React, { useState } from "react";
import { FILTERS } from "../dashboard/home/mockData";

const FilterPills = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
      {FILTERS.map((f, i) => (
        <button
          key={f.label}
          onClick={() => setActive(i)}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            active === i
              ? "bg-black text-white "
              : "bg-white text-gray-500 border border-gray"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default FilterPills;
