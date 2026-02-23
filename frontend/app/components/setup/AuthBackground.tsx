export function AuthBackground() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "linear-gradient(160deg, #f5f3ff 0%, #ede9fe 50%, #faf5ff 100%)" }}
      />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-0 right-0 w-60 h-60 rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }}
      />
    </>
  );
}
