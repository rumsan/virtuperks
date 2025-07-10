import type { Redemption } from "./redemption.type";

export interface Reward {
  cuid: string;
  title: string;
  description: string;
  tokens: bigint;
  category?: string;
  isActive: boolean;
  imageUrl?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
  redemptions?: Redemption[]; 
}
