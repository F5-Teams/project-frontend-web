export interface ServiceImage {
  id?: number;
  imageUrl: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  isActive: boolean;
  images: ServiceImage[];
}
