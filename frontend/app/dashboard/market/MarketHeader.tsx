import RoleToggle from "../../components/RoleToggle";
import { Role } from "./types";

interface MarketHeaderProps {
  role: Role;
  visibleItemsCount: number;
  itemsCount: number;
  wishlistIdsCount: number;
  purchasedCount: number;
  showWishlist: boolean;
  showPurchases: boolean;
  search: string;
  setSearch: (v: string) => void;
  setShowWishlist: (v: boolean) => void;
  setShowPurchases: (v: boolean) => void;
  handleRoleSwitch: (next: Role) => void;
}

const MarketHeader = ({
  role,
  visibleItemsCount,
  itemsCount,
  wishlistIdsCount,
  purchasedCount,
  showWishlist,
  showPurchases,
  search,
  setSearch,
  setShowWishlist,
  setShowPurchases,
  handleRoleSwitch,
}: MarketHeaderProps) => (
  <div
    className="sticky top-0 z-20 pt-6 pb-3 px-5"
    style={{
      background: "linear-gradient(180deg,#f4f4f6 70%,#f4f4f6cc 100%)",
      backdropFilter: "blur(20px)",
    }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex flex-col gap-1">
        <span
          className="text-[11px] font-bold tracking-widest uppercase"
          style={{ color: "#a78bfa", letterSpacing: "0.12em" }}
        >
          {role === "buyer" ? "Browse" : "Your Listings"}
        </span>
        <h1 className="text-3xl font-extrabold leading-none text-violet-900">
          Marketplace
        </h1>
        <p className="text-sm font-medium mt-0.5" style={{ color: "#9f7aea" }}>
          {role === "buyer"
            ? `${visibleItemsCount} item${visibleItemsCount !== 1 ? "s" : ""} available`
            : `${itemsCount} item${itemsCount !== 1 ? "s" : ""} listed by you`}
        </p>
      </div>
      {role === "buyer" && (
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => {
              setShowWishlist(!showWishlist);
              setShowPurchases(false);
            }}
            className="relative flex flex-col items-center gap-0.5 w-12 h-12 rounded-2xl justify-center active:scale-95 transition-transform"
            style={{
              background: showWishlist
                ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                : wishlistIdsCount > 0
                  ? "linear-gradient(135deg,#fde8ff,#ede9fe)"
                  : "linear-gradient(135deg,#f3f4f6,#e5e7eb)",
              color: showWishlist
                ? "#fff"
                : wishlistIdsCount > 0
                  ? "#7c3aed"
                  : "#9ca3af",
              boxShadow:
                wishlistIdsCount > 0
                  ? "0 4px 16px rgba(124,58,237,0.25)"
                  : "none",
              display: "flex",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={
                showWishlist || wishlistIdsCount > 0 ? "currentColor" : "none"
              }
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistIdsCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center"
                style={{ background: "#7c3aed", color: "#fff" }}
              >
                {wishlistIdsCount}
              </span>
            )}
          </button>
          {purchasedCount > 0 && (
            <button
              onClick={() => {
                setShowPurchases(!showPurchases);
                setShowWishlist(false);
              }}
              className="flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-2xl font-bold active:scale-95 transition-transform"
              style={{
                background: showPurchases
                  ? "linear-gradient(135deg,#8b5cf6,#6d28d9)"
                  : "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                color: showPurchases ? "#fff" : "#6d28d9",
                boxShadow: "0 4px 16px rgba(139,92,246,0.22)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="text-xs font-extrabold">{purchasedCount}</span>
            </button>
          )}
        </div>
      )}
    </div>
    <RoleToggle role={role} onToggle={handleRoleSwitch} />
    {role === "buyer" && (
      <div className="relative mt-3 flex items-center">
        <span className="absolute left-3.5 text-violet-400 pointer-events-none">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search items, sellers, locations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 rounded-2xl text-sm font-medium outline-none"
          style={{
            background: "#fff",
            border: "1.5px solid #ddd6fe",
            color: "#1e1b4b",
            boxShadow: "0 2px 10px rgba(139,92,246,0.08)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 text-violet-300 hover:text-violet-500 transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    )}
    <div
      className="h-px mx-1 mt-2 rounded-full"
      style={{ background: "linear-gradient(90deg,#c4b5fd,#ddd6fe44)" }}
    />
  </div>
);

export default MarketHeader;
