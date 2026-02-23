import { MarketItem } from "./types";

interface WishlistPanelProps {
  wishlistedItems: MarketItem[];
  wishlistIdsCount: number;
  handleViewDetail: (item: MarketItem) => void;
  handleWishlist: (item: MarketItem) => void;
  setShowWishlist: (v: boolean) => void;
}

const WishlistPanel = ({
  wishlistedItems,
  wishlistIdsCount,
  handleViewDetail,
  handleWishlist,
  setShowWishlist,
}: WishlistPanelProps) => (
  <div
    className="mb-5 rounded-3xl p-4"
    style={{
      background: "linear-gradient(135deg,#fdf4ff,#ede9fe88)",
      border: "2px solid #e9d5ff",
      boxShadow: "0 4px 20px rgba(124,58,237,0.12)",
    }}
  >
    <p className="text-sm font-extrabold text-violet-800 mb-3 flex items-center gap-2">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "#7c3aed" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      Saved Items ({wishlistIdsCount})
    </p>
    {wishlistedItems.length === 0 ? (
      <p className="text-xs text-gray-400 text-center py-3">
        Tap the heart on any item to save it here.
      </p>
    ) : (
      <div className="flex flex-col gap-2">
        {wishlistedItems.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-transform"
            style={{
              background: "#fff",
              border: "1.5px solid #ede9fe",
            }}
            onClick={() => {
              handleViewDetail(it);
              setShowWishlist(false);
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">
                {it.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {it.sellerName} · {it.location}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <span
                className="text-xs font-extrabold px-2.5 py-1 rounded-xl"
                style={{ background: "#ede9fe", color: "#6d28d9" }}
              >
                रु{it.price.toLocaleString("en-IN")}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlist(it);
                }}
                className="text-violet-500 hover:text-violet-700 transition-colors"
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
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default WishlistPanel;
