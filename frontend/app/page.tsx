import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  { icon: "📚", label: "Notes & Resources" },
  { icon: "🛒", label: "Campus Marketplace" },
  { icon: "💬", label: "Peer Chat" },
];

export default function EntryPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f5f3ff 0%, #ede9fe 55%, #faf5ff 100%)" }}
    >
      {/* Background glow blobs */}
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-60px] right-[-40px] w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-[40%] left-[-50px] w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(196,181,253,0.18) 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[412px] mx-auto flex flex-col items-center px-6 pt-16 pb-10 min-h-screen justify-between">

        {/* Top: logo + hero */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Logo mark */}
          <Image
            src="/assets/beacon-logo1.png"
            alt="Beacon"
            width={450}
            height={450}
            className="object-contain"
            priority
          />

          {/* Headline */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1
              className="text-[38px] leading-none font-black tracking-tight"
              style={{
                background: "linear-gradient(100deg, #5b21b6 0%, #7c3aed 50%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Beacon
            </h1>
            <p className="text-[16px] font-semibold leading-snug" style={{ color: "#6d28d9" }}>
              Your campus, unlocked.
            </p>
            <p className="text-[13px] mt-1 leading-relaxed max-w-[280px]" style={{ color: "#9ca3af" }}>
              Notes, marketplace &amp; more — built for students, by students.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex gap-2.5 flex-wrap justify-center mt-1">
            {FEATURES.map((f) => (
              <span
                key={f.label}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold"
                style={{ background: "rgba(167,139,250,0.15)", color: "#6d28d9", border: "1.5px solid #ddd6fe" }}
              >
                {f.icon} {f.label}
              </span>
            ))}
          </div>


        </div>

        {/* Bottom: CTAs */}
        <div className="flex flex-col gap-3 w-full mt-8">
          <Link
            href="/setup/signup"
            className="w-full py-4 rounded-2xl text-center text-[15px] font-extrabold tracking-wide transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
              color: "#fff",
              boxShadow: "0 6px 24px rgba(124,58,237,0.30)",
            }}
          >
            Get Started — it&apos;s free
          </Link>
          <Link
            href="/setup/login"
            className="w-full py-3.5 rounded-2xl text-center text-[14px] font-bold transition-all active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.8)",
              color: "#7c3aed",
              border: "1.5px solid #ddd6fe",
            }}
          >
            I already have an account
          </Link>
          <p className="text-center text-[11px] mt-1" style={{ color: "#c4b5fd" }}>
            No credit card needed · 100% free for students
          </p>
        </div>
      </div>
    </div>
  );
}
