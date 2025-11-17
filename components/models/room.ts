export type RoomStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "INACTIVE";

export type RoomClass =
  | "STANDARD"
  | "VIP"
  | "PREMIUM"
  | "DELUXE"
  | "EXECUTIVE";

export interface RoomImage {
  id?: number;
  imageUrl: string;
}

export interface Room {
  id?: number;
  name: string;
  class: RoomClass;   
  price: number;
  status: RoomStatus;
  description: string;
  images: RoomImage[];
}
