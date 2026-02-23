const FEATURES = [
  { label: "Notes & Resources" },
  { label: "Campus Marketplace" },
  { label: "Peer Chat" },
];

export default function FeaturePills() {
  return (
    <div className="flex gap-2.5 flex-wrap justify-center mt-1">
      {FEATURES.map((f) => (
        <span
          key={f.label}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold"
          style={{
            background: "rgba(167,139,250,0.15)",
            color: "#6d28d9",
            border: "1.5px solid #ddd6fe",
          }}
        >
          {f.label}
        </span>
      ))}
    </div>
  );
}
