import Link from "next/link";

export default function CTAs() {
  return (
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
        Get Started
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
        · 100% free for students
      </p>
    </div>
  );
}
