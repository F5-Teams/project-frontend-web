export interface imageProduct {
  id: number;
  imageUrl: string;
}

export interface productPublic {
  id: number;
  name: string;
  description: string;
  price: string;
  type: string;
  images: imageProduct;
}
