import { AddItemForm, MarketItem, Role, Condition, Category } from "./types";
import { genSeed } from "./mockData";
import {
  createListing as apiCreateListing,
  deleteListing as apiDeleteListing,
  ApiListing,
  getAuthToken,
} from "../../lib/marketplaceApi";

/** Convert a backend ApiListing into the frontend MarketItem shape */
export function apiListingToMarketItem(
  listing: ApiListing,
  sellerName = "Unknown"
): MarketItem {
  return {
    id: listing.id,
    name: listing.title,
    description: listing.description ?? "",
    price: listing.price,
    colorSeed: genSeed(),
    createdAt: listing.created_at
      ? new Date(listing.created_at).getTime()
      : Date.now(),
    sellerName,
    condition: (listing.condition as Condition) ?? "Good",
    location: listing.college ?? "",
    image_url: listing.image_url,
    category: (listing.category as Category) ?? null,
    user_id: listing.user_id,
  };
}

export function showToast(setToast: (msg: string | null) => void, msg: string | null) {
  if (msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }
}

export async function handleAddSubmit(
  form: AddItemForm,
  token: string | null,
  setItems: React.Dispatch<React.SetStateAction<MarketItem[]>>,
  setNewlyListed: React.Dispatch<React.SetStateAction<Set<string>>>,
  setAddOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setToast: (msg: string | null) => void,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!token) {
    showToast(setToast, "You must be logged in to list an item");
    return;
  }

  setLoading?.(true);
  try {
    const listing = await apiCreateListing(
      {
        title: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category || undefined,
        condition: form.condition,
        college: form.location,
        image: form.image ?? null,
      },
      token
    );

    const newItem = apiListingToMarketItem(listing, form.sellerName);
    setItems((prev) => [newItem, ...prev]);
    setNewlyListed((prev) => new Set([...prev, newItem.id]));
    showToast(setToast, "Item listed — buyers can now see it");
    setAddOpen(false);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create listing";
    showToast(setToast, msg);
  } finally {
    setLoading?.(false);
  }
}

export async function handleDelete(
  id: string,
  setItems: React.Dispatch<React.SetStateAction<MarketItem[]>>,
  setNewlyListed: React.Dispatch<React.SetStateAction<Set<string>>>,
  setToast: (msg: string | null) => void
) {
  const token = getAuthToken();
  if (!token) {
    showToast(setToast, "You must be logged in to delete a listing");
    return;
  }
  try {
    await apiDeleteListing(id, token);
    setItems((prev) => prev.filter((it) => it.id !== id));
    setNewlyListed((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
    showToast(setToast, "Item removed");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete listing";
    showToast(setToast, msg);
  }
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
  setToast: (msg: string | null) => void,
  sendOrderToSeller?: (sellerId: string, orderText: string) => void
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

  // Send order message to seller's chat if seller ID is known
  if (sendOrderToSeller && buyTarget.user_id) {
    const orderNumber = String(Date.now());
    const orderData = {
      orderNumber,
      productName: buyTarget.name,
      productImage: buyTarget.image_url ?? null,
      price: buyTarget.price,
    };
    sendOrderToSeller(buyTarget.user_id, `__ORDER__:${JSON.stringify(orderData)}`);
  }

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
