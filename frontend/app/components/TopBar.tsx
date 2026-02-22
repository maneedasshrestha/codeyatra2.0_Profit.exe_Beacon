"use client";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/account`);
  };

  return (
    <nav
      className="relative flex items-center justify-between px-6 py-4"
      style={{ background: "#F8F7FA" }}
    >
      {/* Brand */}
      <div className="flex flex-col leading-none">
        <span
          className="font-extrabold text-2xl tracking-tight"
          style={{ color: "#3b0764" }}
        >
          Beacon
        </span>
      </div>

      {/* Account button */}
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-full focus:outline-none transition-all"
        style={{
          background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)",
          border: "1.5px solid #c4b5fd",
          boxShadow: "0 2px 8px rgba(167,139,250,0.18)",
        }}
        aria-label="Notifications"
        onClick={() => handleNavigate()}
      >
        <User className="h-5 w-5" style={{ color: "#7c3aed" }} />
      </button>

      {/* Bottom accent line */}
      <div
        className="absolute left-0 right-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #c4b5fd 30%, #a78bfa 50%, #c4b5fd 70%, transparent)",
        }}
      />
    </nav>
  );
};

export default TopBar;
