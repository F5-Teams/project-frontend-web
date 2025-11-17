export interface PatchProduct {
  name: string;
  description: string;
  price: number;
  stocks: number;
  type: string;
  note: string;
}

export interface PatchProductParams {
  id: number;
  body: PatchProduct;
}
