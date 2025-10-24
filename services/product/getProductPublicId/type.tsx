export interface Images {
  id: number;
  imageUrl: string;
}

export interface ProductById {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  stocks: number;
  images: Images[];
}
