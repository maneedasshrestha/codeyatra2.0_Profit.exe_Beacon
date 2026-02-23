import { AddItemForm, MarketItem, Role } from "./types";
import { genId, genSeed } from "./mockData";

export function showToast(setToast: (msg: string | null) => void, msg: string | null) {
  if (msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }
}

export function handleAddSubmit(
  form: AddItemForm,
  setItems: React.Dispatch<React.SetStateAction<MarketItem[]>>,
  setNewlyListed: React.Dispatch<React.SetStateAction<Set<string>>>,
  setAddOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setToast: (msg: string | null) => void
) {
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
  showToast(setToast, "Item listed — buyers can now see it");
  setAddOpen(false);
}

export function handleDelete(
  id: string,
  setItems: React.Dispatch<React.SetStateAction<MarketItem[]>>,
  setNewlyListed: React.Dispatch<React.SetStateAction<Set<string>>>,
  setToast: (msg: string | null) => void
) {
  setItems((prev) => prev.filter((it) => it.id !== id));
  setNewlyListed((prev) => {
    const s = new Set(prev);
    s.delete(id);
    return s;
  });
  showToast(setToast, "Item removed");
}

export function handleRoleSwitch(
  next: Role,
  setRole: React.Dispatch<React.SetStateAction<Role>>,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  setShowWishlist: React.Dispatch<React.SetStateAction<boolean>>,
  setShowPurchases: React.Dispatch<React.SetStateAction<boolean>>,
  newlyListed: Set<string>,
  setToast: (msg: string | null) => void
) {
  setRole(next);
  setSearch("");
  setShowWishlist(false);
  setShowPurchases(false);
  if (next === "buyer" && newlyListed.size > 0) {
    showToast(
      setToast,
      `${newlyListed.size} new item${newlyListed.size > 1 ? "s" : ""} listed in the marketplace`
    );
  }
}

export function handleViewDetail(
  item: MarketItem,
  setDetailItem: React.Dispatch<React.SetStateAction<MarketItem | null>>,
  setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  setDetailItem(item);
  setDetailOpen(true);
}

export function handleBuyClick(
  item: MarketItem,
  setBuyTarget: React.Dispatch<React.SetStateAction<MarketItem | null>>,
  setBuyOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  setBuyTarget(item);
  setBuyOpen(true);
}

export function handleBuyConfirm(
  buyTarget: MarketItem | null,
  setItems: React.Dispatch<React.SetStateAction<MarketItem[]>>,
  setNewlyListed: React.Dispatch<React.SetStateAction<Set<string>>>,
  setWishlistIds: React.Dispatch<React.SetStateAction<Set<string>>>,
  setPurchased: React.Dispatch<React.SetStateAction<MarketItem[]>>,
  setBuyOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setBuyTarget: React.Dispatch<React.SetStateAction<MarketItem | null>>,
  setToast: (msg: string | null) => void
) {
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
  showToast(setToast, "Request sent to seller!");
}

export function handleWishlist(
  item: MarketItem,
  setWishlistIds: React.Dispatch<React.SetStateAction<Set<string>>>,
  setToast: (msg: string | null) => void
) {
  setWishlistIds((prev) => {
    const s = new Set(prev);
    if (s.has(item.id)) {
      s.delete(item.id);
      showToast(setToast, "Removed from saved items");
    } else {
      s.add(item.id);
      showToast(setToast, "Saved to wishlist!");
    }
    return s;
  });
}
