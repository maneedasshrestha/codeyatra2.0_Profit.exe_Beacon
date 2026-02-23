export default function Headline() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1
        className="text-[38px] leading-none font-black tracking-tight"
        style={{
          background:
            "linear-gradient(100deg, #5b21b6 0%, #7c3aed 50%, #a78bfa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Beacon
      </h1>
      <p
        className="text-[16px] font-semibold leading-snug"
        style={{ color: "#6d28d9" }}
      >
        Your campus, unlocked.
      </p>
      <p
        className="text-[13px] mt-1 leading-relaxed max-w-70"
        style={{ color: "#9ca3af" }}
      >
        Notes, marketplace &amp; more — built for students, by students.
      </p>
    </div>
  );
}
