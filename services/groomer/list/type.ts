export interface ImageItem {
  id: number;
  imageUrl: string;
  type?: "BEFORE" | "DURING" | "AFTER" | string | null;
}

export interface Pet {
  id: number;
  name?: string;
  age?: number | null;
  species?: string | null;
  breed?: string | null;
  gender?: boolean | null;
  height?: string | null;
  weight?: string | null;
  note?: string | null;
  images?: ImageItem[] | null;
}

export interface CustomerShort {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
}

export interface Combo {
  id: number;
  name?: string | null;
  price?: string | null;
  duration?: number | null;
  description?: string | null;
  isActive?: boolean | null;
}

export interface Booking {
  id: number;
  bookingDate?: string | null;
  dropDownSlot?: string | null;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  type?: string | null;
  status?: string | null;
  note?: string | null;
  servicePrice?: string | null;
  comboPrice?: string | null;
  createdAt?: string | null;
  comboId?: number | null;
  roomId?: number | null;
  customerId?: number | null;
  groomerId?: number | null;
  petId?: number | null;
  pet?: Pet | null;
  customer?: CustomerShort | null;
  combo?: Combo | null;
  room?: {
    id: number;
    name: string;
    class?: string | null;
    price?: string | null;
    status?: string | null;
    description?: string | null;
    size?: string | null;
    images?: ImageItem[] | null;
  } | null;
  Image?: ImageItem[] | null;
  payments?: unknown[] | null;
}
