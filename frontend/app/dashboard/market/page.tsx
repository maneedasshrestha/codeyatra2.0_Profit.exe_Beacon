"use client";
import { useState, useEffect } from "react";
import ItemCard from "../../components/ItemCard";
import AddItemModal from "../../components/AddItemModal";
import BuyConfirmModal from "../../components/BuyConfirmModal";
import EmptyState from "../../components/EmptyState";
import ItemDetailModal from "../../components/ItemDetailModal";
import { MarketItem, Role } from "./types";
import BackgroundGlowBlobs from "../../components/market/BackgroundGlowBlobs";
import MarketHeader from "../../components/market/MarketHeader";
import WishlistPanel from "../../components/market/WishlistPanel";
import PurchasesPanel from "../../components/market/PurchasesPanel";
import AddItemFAB from "../../components/market/AddItemFAB";
import {
  showToast,
  handleAddSubmit,
  handleDelete,
  handleRoleSwitch,
  handleViewDetail,
  handleBuyClick,
  handleBuyConfirm,
  handleWishlist,
  apiListingToMarketItem,
} from "./marketUtils";
import { getListings, getAuthToken } from "../../lib/marketplaceApi";

export default function MarketPage() {
  const [role, setRole] = useState<Role>("buyer");
  const [items, setItems] = useState<MarketItem[]>([]);
  const [purchased, setPurchased] = useState<MarketItem[]>([]);
  const [newlyListed, setNewlyListed] = useState<Set<string>>(new Set());
  const [loadingItems, setLoadingItems] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  // Fetch listings from backend on mount
  useEffect(() => {
    let cancelled = false;
    setLoadingItems(true);
    setFetchError(null);
    getListings()
      .then((listings) => {
        if (cancelled) return;
        setItems(listings.map((l) => apiListingToMarketItem(l)));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setFetchError(
          err instanceof Error ? err.message : "Failed to load listings"
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingItems(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <div
      className="relative min-h-screen w-full flex justify-center"
      style={{
        background:
          "linear-gradient(160deg,#f4f4f6 0%,#ececf0 40%,#f7f7f9 100%)",
      }}
    >
      <BackgroundGlowBlobs />
      <div className="relative z-10 w-full max-w-103 flex flex-col h-screen">
        <MarketHeader
          role={role}
          visibleItemsCount={visibleItems.length}
          itemsCount={items.length}
          wishlistIdsCount={wishlistIds.size}
          purchasedCount={purchased.length}
          showWishlist={showWishlist}
          showPurchases={showPurchases}
          search={search}
          setSearch={setSearch}
          setShowWishlist={setShowWishlist}
          setShowPurchases={setShowPurchases}
          handleRoleSwitch={(next) =>
            handleRoleSwitch(
              next,
              setRole,
              setSearch,
              setShowWishlist,
              setShowPurchases,
              newlyListed,
              (msg) => showToast(setToast, msg),
            )
          }
        />
        <div
          className="flex-1 overflow-y-auto px-4 pt-3 pb-32"
          style={{ scrollbarWidth: "none" }}
        >
          {showWishlist && role === "buyer" && (
            <WishlistPanel
              wishlistedItems={wishlistedItems}
              wishlistIdsCount={wishlistIds.size}
              handleViewDetail={(item) =>
                handleViewDetail(item, setDetailItem, setDetailOpen)
              }
              handleWishlist={(item) =>
                handleWishlist(item, setWishlistIds, (msg) =>
                  showToast(setToast, msg),
                )
              }
              setShowWishlist={setShowWishlist}
            />
          )}
          {showPurchases && role === "buyer" && purchased.length > 0 && (
            <PurchasesPanel purchased={purchased} />
          )}
          {loadingItems && (
            <div className="flex justify-center items-center py-20">
              <div
                className="w-8 h-8 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin"
              />
            </div>
          )}
          {fetchError && !loadingItems && (
            <p className="text-center text-sm text-red-400 py-10">{fetchError}</p>
          )}
          {!loadingItems && !fetchError && visibleItems.length === 0 ? (
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
                  onBuy={(item) =>
                    handleBuyClick(item, setBuyTarget, setBuyOpen)
                  }
                  onDelete={(id) =>
                    handleDelete(id, setItems, setNewlyListed, (msg) =>
                      showToast(setToast, msg),
                    )
                  }
                  onViewDetail={(item) =>
                    handleViewDetail(item, setDetailItem, setDetailOpen)
                  }
                  onWishlist={(item) =>
                    handleWishlist(item, setWishlistIds, (msg) =>
                      showToast(setToast, msg),
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {role === "seller" && <AddItemFAB onClick={() => setAddOpen(true)} />}
      <AddItemModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(form) =>
          handleAddSubmit(
            form,
            getAuthToken(),
            setItems,
            setNewlyListed,
            setAddOpen,
            (msg) => showToast(setToast, msg),
            setAddLoading,
          )
        }
      />
      <BuyConfirmModal
        item={buyTarget}
        open={buyOpen}
        onClose={() => {
          setBuyOpen(false);
          setBuyTarget(null);
        }}
        onConfirm={() =>
          handleBuyConfirm(
            buyTarget,
            setItems,
            setNewlyListed,
            setWishlistIds,
            setPurchased,
            setBuyOpen,
            setBuyTarget,
            (msg) => showToast(setToast, msg),
          )
        }
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
          handleBuyClick(item, setBuyTarget, setBuyOpen);
        }}
      />
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
