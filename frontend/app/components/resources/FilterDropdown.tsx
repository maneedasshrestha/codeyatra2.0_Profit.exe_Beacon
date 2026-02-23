import React, { useRef, useEffect } from "react";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const displayValue = value === "All" ? label : value;

  return (
    <div ref={ref} className="relative flex-1">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-1 px-3 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95"
        style={
          value !== "All"
            ? {
                background: "#7c3aed",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
              }
            : {
                background: "#fff",
                color: "#7c3aed",
                border: "1.5px solid #ddd6fe",
              }
        }
      >
        <span className="truncate">{displayValue}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke={value !== "All" ? "#fff" : "#7c3aed"}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.18s",
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
            border: "1.5px solid #ede9fe",
            minWidth: "130px",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[12px] font-semibold transition-colors"
              style={
                opt === value
                  ? { background: "#f3f0ff", color: "#7c3aed" }
                  : { background: "transparent", color: "#374151" }
              }
            >
              {opt === value && (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {opt !== value && <span className="w-2.75" />}
              {opt === "All" ? `All ${label}s` : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
