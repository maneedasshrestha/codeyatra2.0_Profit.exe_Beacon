interface ChipSelectorProps {
  label: string;
  options: string[];
  value: string;
  error?: string;
  onChange: (val: string) => void;
}

export function ChipSelector({ label, options, value, error, onChange }: ChipSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] font-bold tracking-widest uppercase"
        style={{ color: error ? "#f87171" : "#9ca3af" }}
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="px-3 py-1.5 rounded-full text-[12px] font-bold transition-all active:scale-95"
            style={
              value === opt
                ? { background: "#7c3aed", color: "#fff" }
                : { background: "#f5f3ff", color: "#7c3aed", border: "1.5px solid #ddd6fe" }
            }
          >
            {opt}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-[11px] font-semibold" style={{ color: "#f87171" }}>
          {error}
        </p>
      )}
    </div>
  );
}
