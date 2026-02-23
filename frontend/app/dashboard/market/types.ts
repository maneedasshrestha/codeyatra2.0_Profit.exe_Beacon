export type Role = "buyer" | "seller";

export type Condition = "New" | "Like New" | "Good" | "Fair" | "Poor";

export type Category =
  | "Electronics"
  | "Clothing"
  | "Books"
  | "Stationery"
  | "Furniture"
  | "Sports"
  | "Food"
  | "Other";

export interface MarketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  colorSeed: number;
  createdAt: number;
  sellerName: string;
  condition: Condition;
  /** College/campus name (maps to `college` in the backend) */
  location: string;
  /** Optional — present when fetched from backend */
  image_url?: string | null;
  category?: Category | null;
  /** Backend user_id of the seller */
  user_id?: string;
}

export interface AddItemForm {
  name: string;
  description: string;
  price: string;
  sellerName: string;
  condition: Condition;
  location: string;
  category: Category | "";
  /** File selected for upload */
  image?: File | null;
}