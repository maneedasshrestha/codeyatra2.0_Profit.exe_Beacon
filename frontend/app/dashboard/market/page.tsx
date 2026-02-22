"use client";
import { useState, useEffect } from "react";
import RoleToggle from "../../components/RoleToggle";
import ItemCard from "../../components/ItemCard";
import AddItemModal from "../../components/AddItemModal";
import BuyConfirmModal from "../../components/BuyConfirmModal";
import EmptyState from "../../components/EmptyState";
import ItemDetailModal from "../../components/ItemDetailModal";
import { AddItemForm, MarketItem, Role } from "./types";

// ── localStorage helpers ──────────────────────────────────────────────────
const LS_KEY = "marketplace_items_v1";

function loadItems(): MarketItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as MarketItem[];
  } catch { }
  return SEED_ITEMS;
}

function saveItems(items: MarketItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch { }
}

// ── Seed data ────────────────────────────────────────────────────────────────
const SEED_ITEMS: MarketItem[] = [
  {
    id: "1",
    name: "Vintage Polaroid Camera",
    description:
      "Classic instant film camera in mint condition. Great for aesthetic shots.",
    price: 1499,
    colorSeed: 0,
    createdAt: 1713800000000,
    sellerName: "Ananya Mehta",
    condition: "Like New",
    location: "Pune, MH",
  },
  {
    id: "2",
    name: "Lavender Candle Set",
    description:
      "Hand-poured soy wax candles with real lavender. Burns 40+ hrs each.",
    price: 599,
    colorSeed: 1,
    createdAt: 1713800001000,
    sellerName: "Riya Kapoor",
    condition: "New",
    location: "Bengaluru, KA",
  },
  {
    id: "3",
    name: "Pastel Mechanical Keyboard",
    description:
      "75% layout, hot-swappable, clicky switches. Purple & pink keycaps.",
    price: 3299,
    colorSeed: 7,
    createdAt: 1713800002000,
    sellerName: "Dev Sharma",
    condition: "Good",
    location: "Delhi, DL",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
let _idCounter = 100;
const genId = () => String(++_idCounter);
const genSeed = () => Math.floor(Math.random() * 8);

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MarketPage() {
  const [role, setRole] = useState<Role>("buyer");
  const [items, setItems] = useState<MarketItem[]>(SEED_ITEMS);
  const [purchased, setPurchased] = useState<MarketItem[]>([]);
  // IDs listed during this session – shown with a "New" badge in buyer view
  const [newlyListed, setNewlyListed] = useState<Set<string>>(new Set());

  // Load items from localStorage after initial hydration
  useEffect(() => {
    const storedItems = loadItems();
    setItems(storedItems);
  }, []);

  // Persist whenever items change
  useEffect(() => {
    saveItems(items);
  }, [items]);

  const [addOpen, setAddOpen] = useState(false);

  const [buyTarget, setBuyTarget] = useState<MarketItem | null>(null);
  const [buyOpen, setBuyOpen] = useState(false);

  const [detailItem, setDetailItem] = useState<MarketItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showPurchases, setShowPurchases] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [showWishlist, setShowWishlist] = useState(false);

  const wishlistedItems = items.filter((it) => wishlistIds.has(it.id));

  // Filtered items for buyer search
  const visibleItems =
    role === "buyer" && search.trim()
      ? items.filter(
        (it) =>
          it.name.toLowerCase().includes(search.toLowerCase()) ||
          it.description.toLowerCase().includes(search.toLowerCase()) ||
          it.sellerName.toLowerCase().includes(search.toLowerCase()) ||
          it.location.toLowerCase().includes(search.toLowerCase()),
      )
      : items;

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // ── Seller actions ──────────────────────────────────────────────────────
  const handleAddSubmit = (form: AddItemForm) => {
    const newItem: MarketItem = {
      id: genId(),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      colorSeed: genSeed(),
      createdAt: Date.now(),
      sellerName: form.sellerName,
      condition: form.condition,
      location: form.location,
    };
    setItems((prev) => [newItem, ...prev]);
    setNewlyListed((prev) => new Set([...prev, newItem.id]));
    showToast("Item listed — buyers can now see it");
    setAddOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setNewlyListed((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
    showToast("Item removed");
  };

  // ── Role switch ────────────────────────────────────────────────────────
  const handleRoleSwitch = (next: Role) => {
    setRole(next);
    setSearch("");
    setShowWishlist(false);
    setShowPurchases(false);
    if (next === "buyer" && newlyListed.size > 0) {
      showToast(
        `${newlyListed.size} new item${newlyListed.size > 1 ? "s" : ""} listed in the marketplace`,
      );
    }
  };

  // ── Buyer actions ────────────────────────────────────────────────────────
  const handleViewDetail = (item: MarketItem) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const handleBuyClick = (item: MarketItem) => {
    setBuyTarget(item);
    setBuyOpen(true);
  };

  const handleBuyConfirm = () => {
    if (!buyTarget) return;
    setItems((prev) => prev.filter((it) => it.id !== buyTarget.id));
    setNewlyListed((prev) => {
      const s = new Set(prev);
      s.delete(buyTarget.id);
      return s;
    });
    setWishlistIds((prev) => {
      const s = new Set(prev);
      s.delete(buyTarget.id);
      return s;
    });
    setPurchased((prev) => [buyTarget, ...prev]);
    setBuyOpen(false);
    setBuyTarget(null);
    showToast("Request sent to seller!");
  };

  const handleWishlist = (item: MarketItem) => {
    setWishlistIds((prev) => {
      const s = new Set(prev);
      if (s.has(item.id)) {
        s.delete(item.id);
        showToast("Removed from saved items");
      } else {
        s.add(item.id);
        showToast("Saved to wishlist!");
      }
      return s;
    });
  };

  return (
    <div
      className="relative min-h-screen w-full flex justify-center"
      style={{
        background:
          "linear-gradient(160deg,#f4f4f6 0%,#ececf0 40%,#f7f7f9 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none fixed -top-20 -left-15 w-64 h-64 rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle,#c084fc55,transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="pointer-events-none fixed bottom-24 -right-12.5 w-52 h-52 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle,#818cf855,transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* ── Content shell ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-103 flex flex-col h-screen">
        {/* ── Sticky header ────────────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-20 pt-6 pb-3 px-5"
          style={{
            background: "linear-gradient(180deg,#f4f4f6 70%,#f4f4f6cc 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Title row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex flex-col gap-1">
              {/* Eyebrow label */}
              <span
                className="text-[11px] font-bold tracking-widest uppercase"
                style={{ color: "#a78bfa", letterSpacing: "0.12em" }}
              >
                {role === "buyer" ? "Browse" : "Your Listings"}
              </span>

              <h1 className="text-3xl font-extrabold leading-none text-violet-900">
                Marketplace
              </h1>

              <p
                className="text-sm font-medium mt-0.5"
                style={{ color: "#9f7aea" }}
              >
                {role === "buyer"
                  ? `${visibleItems.length} item${visibleItems.length !== 1 ? "s" : ""} available`
                  : `${items.length} item${items.length !== 1 ? "s" : ""} listed by you`}
              </p>
            </div>

            {/* Right-side action buttons – buyer only */}
            {role === "buyer" && (
              <div className="flex items-center gap-2 mt-1">
                {/* Wishlist heart button */}
                <button
                  onClick={() => {
                    setShowWishlist((v) => !v);
                    setShowPurchases(false);
                  }}
                  className="relative flex flex-col items-center gap-0.5 w-12 h-12 rounded-2xl justify-center active:scale-95 transition-transform"
                  style={{
                    background: showWishlist
                      ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                      : wishlistIds.size > 0
                        ? "linear-gradient(135deg,#fde8ff,#ede9fe)"
                        : "linear-gradient(135deg,#f3f4f6,#e5e7eb)",
                    color: showWishlist
                      ? "#fff"
                      : wishlistIds.size > 0
                        ? "#7c3aed"
                        : "#9ca3af",
                    boxShadow:
                      wishlistIds.size > 0
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
                      showWishlist || wishlistIds.size > 0
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {wishlistIds.size > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center"
                      style={{ background: "#7c3aed", color: "#fff" }}
                    >
                      {wishlistIds.size}
                    </span>
                  )}
                </button>

                {/* Purchases badge */}
                {purchased.length > 0 && (
                  <button
                    onClick={() => {
                      setShowPurchases((v) => !v);
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
                    <span className="text-xs font-extrabold">
                      {purchased.length}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          <RoleToggle role={role} onToggle={handleRoleSwitch} />

          {/* Search bar – buyer only */}
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

          {/* Divider */}
          <div
            className="h-px mx-1 mt-2 rounded-full"
            style={{ background: "linear-gradient(90deg,#c4b5fd,#ddd6fe44)" }}
          />
        </div>

        {/* ── Scrollable body ────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto px-4 pt-3 pb-32"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Wishlist panel */}
          {showWishlist && role === "buyer" && (
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
                Saved Items ({wishlistIds.size})
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
          )}

          {/* My Requests panel */}
          {showPurchases && role === "buyer" && purchased.length > 0 && (
            <div
              className="mb-5 rounded-3xl p-4"
              style={{
                background: "linear-gradient(135deg,#faf5ff,#ede9fe88)",
                border: "2px solid #ddd6fe",
                boxShadow: "0 4px 20px rgba(139,92,246,0.1)",
              }}
            >
              <p className="text-sm font-extrabold text-violet-800 mb-3">
                My Requests ({purchased.length})
              </p>
              <div className="flex flex-col gap-2">
                {purchased.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-2xl"
                    style={{
                      background: "#fff",
                      border: "1.5px solid #ede9fe",
                    }}
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        {it.name}
                      </p>
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        {it.description}
                      </p>
                    </div>
                    <span
                      className="ml-3 text-xs font-extrabold px-2.5 py-1 rounded-xl shrink-0"
                      style={{ background: "#ede9fe", color: "#6d28d9" }}
                    >
                      रु{it.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items grid */}
          {visibleItems.length === 0 ? (
            <EmptyState role={role} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {visibleItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  role={role}
                  isNew={newlyListed.has(item.id)}
                  isWishlisted={wishlistIds.has(item.id)}
                  onBuy={handleBuyClick}
                  onDelete={handleDelete}
                  onViewDetail={handleViewDetail}
                  onWishlist={handleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Seller FAB ────────────────────────────────────────────────────── */}
      {role === "seller" && (
        <button
          onClick={() => {
            setAddOpen(true);
          }}
          className="fixed bottom-28 right-5 z-30 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white active:scale-90 transition-transform"
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            boxShadow: "0 6px 28px rgba(109,40,217,0.45)",
          }}
          aria-label="Add item"
        >
          +
        </button>
      )}

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <AddItemModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddSubmit}
      />

      <BuyConfirmModal
        item={buyTarget}
        open={buyOpen}
        onClose={() => {
          setBuyOpen(false);
          setBuyTarget(null);
        }}
        onConfirm={handleBuyConfirm}
      />

      <ItemDetailModal
        item={detailItem}
        open={detailOpen}
        role={role}
        onClose={() => {
          setDetailOpen(false);
          setDetailItem(null);
        }}
        onBuy={(item) => {
          setDetailOpen(false);
          setDetailItem(null);
          handleBuyClick(item);
        }}
      />

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed bottom-36 left-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-bold text-white shadow-xl"
          style={{
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            boxShadow: "0 8px 28px rgba(109,40,217,0.35)",
            animation: "popIn 0.22s cubic-bezier(.34,1.56,.64,1)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
