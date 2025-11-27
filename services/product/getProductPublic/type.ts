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
  price: string | number;
  stocks: number;
  type: string;
  createAt?: string;
  note?: string;
  images: Images[];
  orderDetails?: Order;
  weight: string;
  inStock: boolean;
  availabilityStatus: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllProductResponse {
  data: Product[];
  pagination: Pagination;
}
