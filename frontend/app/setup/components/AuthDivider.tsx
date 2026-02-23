export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: "#ede9fe" }} />
      <span className="text-[11px] font-semibold" style={{ color: "#c4b5fd" }}>OR</span>
      <div className="flex-1 h-px" style={{ background: "#ede9fe" }} />
    </div>
  );
}
