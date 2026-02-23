import React from "react";

interface Stat {
  label: string;
  value: number;
}

interface StatsRowProps {
  stats: Stat[];
}

const StatsRow: React.FC<StatsRowProps> = ({ stats }) => (
  <div
    className="mx-4 mt-4 rounded-2xl flex items-center"
    style={{
      background: "#fff",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}
  >
    {stats.map((stat, i) => (
      <React.Fragment key={stat.label}>
        {i > 0 && (
          <div
            className="w-px self-stretch my-3"
            style={{ background: "#ede9fe" }}
          />
        )}
        <div className="flex-1 flex flex-col items-center py-5">
          <span className="text-2xl font-extrabold text-violet-900">
            {stat.value}
          </span>
          <span className="text-[11px] font-medium text-gray-400 mt-0.5">
            {stat.label}
          </span>
        </div>
      </React.Fragment>
    ))}
  </div>
);

export default StatsRow;
