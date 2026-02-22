"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const TopBarAccount = () => {
  const router = useRouter();

  return (
    <nav
      className="relative flex items-center justify-between px-6 py-4"
      style={{ background: "#F8F7FA" }}
    >
      <button
        onClick={() => router.back()}
        className="w-10 h-10 rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center active:scale-90 transition-transform shrink-0 hover:border-violet-200"
        aria-label="Go back"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

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

export default TopBarAccount;
