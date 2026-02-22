"use client";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    label: "Home",
    path: "/dashboard/home",
    icon: (
      <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
        />
      </svg>
    ),
  },
  {
    label: "Wallet",
    path: "/dashboard/market",
    icon: (
      <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"
        />
      </svg>
    ),
  },
  {
    label: "New",
    path: "/dashboard/new",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="2" d="M5 12h14m-7 7V5" />
      </svg>
    ),
  },
  {
    label: "Filter",
    path: "/dashboard/chat",
    icon: (
      <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/dashboard/account",
    icon: (
      <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
  },
];

const BottomNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);
  return (
    <div className="fixed z-50 w-full h-20 max-w-lg -translate-x-1/2 bg-white/30 backdrop-blur-md border border-default rounded-full bottom-4 left-1/2">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {navItems.map((item, idx) => (
          <button
            key={item.path}
            type="button"
            className={`inline-flex flex-col items-center justify-center px-5 ${
              idx === 0
                ? "rounded-s-full"
                : idx === navItems.length - 1
                  ? "rounded-e-full"
                  : ""
            } hover:bg-neutral-secondary-medium group ${
              isActive(item.path) ? "bg-blue-800 text-white" : ""
            }`}
            onClick={() => router.push(item.path)}
          >
            {item.icon}
            <span className="sr-only">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavBar;
