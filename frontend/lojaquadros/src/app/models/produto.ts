// src/app/models/produto.ts
export interface Produto {
  id?: number;
  name: string;
  descr?: string;
  value: number;
  promo?: number;
  qt?: number;
  contrast?: number;
  keywords?: string;
  imageUrl?: string; // <-- novo campo opcional
}
