"use client";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const router = useRouter();

  return (
    <nav
      className="mx-3 mt-3 mb-4 px-4 py-3 rounded-3xl relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f3f0ff 0%, #faf5ff 40%, #ede9fe 100%)",
        boxShadow: "0 4px 24px rgba(124,58,237,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
        border: "1.5px solid rgba(196,181,253,0.45)",
      }}
    >
      {/* Subtle glow blob */}
      <div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)" }}
      />

      <div className="flex items-center justify-between relative z-10">
        {/* Left: logo + greeting */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2" style={{ paddingBottom: 2 }}>
            {/* Beacon orb icon */}
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                boxShadow: "0 2px 10px rgba(124,58,237,0.35)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="white" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span
              className="font-extrabold text-[20px] tracking-tight leading-none"
              style={{
                background: "linear-gradient(90deg, #6d28d9 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Beacon
            </span>
          </div>
        </div>

        {/* Right: avatar button */}
        <button
          onClick={() => router.push("/dashboard/account")}
          className="relative flex items-center justify-center w-10 h-10 rounded-2xl"
          style={{ WebkitTapHighlightColor: "transparent", outline: "none" }}
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
          }}
          aria-label="Profile"
        >
          <span className="text-white font-extrabold text-[14px] tracking-wide">S</span>
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
