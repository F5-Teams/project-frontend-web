export interface Images {
  id: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  quantity: number;
  order: {
    id: number;
    status: string;
    createAt: string;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stocks: number;
  type: string;
  createAt: string;
  note: string;
  images: Images;
  orderDetails: Order;
  weight: string;
}

export type GetAllProductResponse = Product[];
