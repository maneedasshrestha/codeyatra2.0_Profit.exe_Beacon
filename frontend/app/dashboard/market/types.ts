export type Role = "buyer" | "seller";

export type Condition = "New" | "Like New" | "Good" | "Fair" | "Poor";

export interface MarketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  colorSeed: number;
  createdAt: number;
  sellerName: string;
  condition: Condition;
  location: string;
  imageUrl?: string;
}

export interface AddItemForm {
  name: string;
  description: string;
  price: string;
  sellerName: string;
  condition: Condition;
  location: string;
  imageUrl?: string;
}