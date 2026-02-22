"use client";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", path: "/dashboard/home", icon: HomeIcon },
  { label: "Market", path: "/dashboard/market", icon: MarketIcon },
  { label: "New", path: "/dashboard/new", icon: PlusIcon },
  { label: "Chat", path: "/dashboard/chat", icon: ChatIcon },
  { label: "Resources", path: "/dashboard/resources", icon: ResourcesIcon },
];

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="fixed bottom-8 left-4 right-4 z-50 flex justify-center">
      <div
        className="w-fit flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-3xl
        bg-white/85 backdrop-blur-2xl
        border border-black/8
        shadow-[0_20px_60px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]"
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const isNew = item.label === "New";

          if (isNew) {
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="relative mx-1 sm:mx-2 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl
                  bg-linear-to-br from-violet-400 to-violet-600
                  shadow-[0_4px_24px_rgba(139,92,246,0.5)]
                  active:scale-95 transition-transform duration-100"
              >
                <motion.div
                  whileTap={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon />
                </motion.div>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="relative flex flex-col items-center justify-center w-16 h-14 sm:w-20 sm:h-16 rounded-2xl
                group transition-colors duration-150"
            >
              {active && (
                <motion.div
                  layoutId="active-bg"
                  className="absolute inset-0 rounded-2xl bg-violet-100"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              <motion.div
                animate={{ scale: active ? 1.08 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative z-10 transition-colors duration-150
                  ${active ? "text-violet-500" : "text-neutral-400 group-hover:text-neutral-600"}`}
              >
                <Icon />
              </motion.div>

              <div className="relative z-10 h-3.5 mt-0.5 overflow-hidden flex items-center justify-center w-full">
                <AnimatePresence mode="wait">
                  {active && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="text-[10px] font-semibold tracking-wide text-violet-500 leading-none whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- ICONS ---------------- */

function HomeIcon() {
  return (
    <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
      />
    </svg>
  );
}

function MarketIcon() {
  return (
    <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24">
      ={" "}
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9h18M3 9l1.5-4h15L21 9M3 9c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2"
      />
      ={" "}
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 11v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"
      />
      ={" "}
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 20v-5a2 2 0 0 1 4 0v5"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24">
      <path
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        d="M5 12h14m-7 7V5"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      />
    </svg>
  );
}

function ResourcesIcon() {
  return (
    <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24">
      {/* bottom book */}
      <rect x="3" y="16" width="18" height="3" rx="1" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      {/* middle book */}
      <rect x="4" y="11" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      {/* top book */}
      <rect x="5" y="6" width="14" height="3" rx="1" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M4.5 20c0-3.59 3.358-6.5 7.5-6.5s7.5 2.91 7.5 6.5"
      />
    </svg>
  );
}
