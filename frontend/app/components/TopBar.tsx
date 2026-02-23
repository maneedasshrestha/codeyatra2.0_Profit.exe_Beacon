"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const router = useRouter();

  return (
    <nav
      className="mx-3 mt-3 mb-4 px-4 py-3 rounded-3xl relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f3f0ff 0%, #faf5ff 40%, #ede9fe 100%)",
        boxShadow:
          "0 4px 24px rgba(124,58,237,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
        border: "1.5px solid rgba(196,181,253,0.45)",
      }}
    >
      {/* Subtle glow blob */}
      <div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)",
        }}
      />
      <div className="flex items-center justify-between relative z-10">
        <Link href="/">
          {/* Left: logo + greeting */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/beacon-logo1.png"
                alt="Beacon"
                width={52}
                height={52}
                className="object-contain rounded-xl"
                style={{
                  transform: "scale(3.5) translateX(-20px)",
                  transformOrigin: "left center",
                }}
                priority
              />
              <span
                className="font-extrabold text-[22px] tracking-tight leading-none"
                style={{
                  background:
                    "linear-gradient(90deg, #6d28d9 0%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Beacon
              </span>
            </div>
          </div>
        </Link>

        {/* Right: avatar button */}
        <button
          onClick={() => router.push("/account")}
          className="relative flex items-center justify-center w-10 h-10 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            WebkitTapHighlightColor: "transparent",
            outline: "none",
          }}
          aria-label="Profile"
        >
          <span className="text-white font-extrabold text-[14px] tracking-wide">
            S
          </span>
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
