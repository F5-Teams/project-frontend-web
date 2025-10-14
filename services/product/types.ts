export interface Order {
  id: number;
  status: string;
  createdAt: string;
}

export interface OrderDetails {
  id: number;
  quantity: number;
  order: Order;
}

export interface Images {
  id: number;
  imageUrl: string;
  type: null;
}

export interface Product {
  id: number;
  name: string;
  stocks: number;
  createdAt: string;
  note: string;
}

export type GetAllProductResponse = Product[];
