export interface ImageItem {
  id: number;
  imageUrl: string;
  type?: "BEFORE" | "DURING" | "AFTER" | string | null;
}

export interface Pet {
  id: number;
  name: string;
  age: number;
  species: string;
  breed: string;
  gender: boolean;
  height?: string;
  weight?: string;
  note?: string;
  userId: number;
  recordId?: number | null;
  images: ImageItem[];
}

export interface CustomerShort {
  id: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface Service {
  id: number;
  name: string;
  price?: string;
  duration?: number;
  description?: string;
  isActive?: boolean;
}

export interface ServiceLink {
  id: number;
  comboId: number;
  serviceId: number;
  service: Service;
}

export interface Combo {
  id: number;
  name: string;
  price?: string | null;
  duration?: number | null;
  description?: string | null;
  isActive?: boolean;
  serviceLinks: ServiceLink[];
}

export interface Payment {
  id: number;
  totalAmount?: string | number;
  status?: string;
  date?: string;
  paymentMethodId?: number;
  bookingId?: number;
  paymentMethod?: {
    id: number;
    name?: string;
  } | null;
}

export type Slot = "MORNING" | "AFTERNOON" | "EVENING" | string;

export interface Booking {
  id: number;
  bookingDate: string;
  dropDownSlot: Slot;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  type?: string | null;
  status: string;
  note?: string;
  servicePrice?: string | null;
  comboPrice?: string | null;
  createdAt: string;
  comboId?: number | null;
  roomId?: number | null;
  customerId?: number;
  groomerId?: number;
  petId?: number;
  pet?: Pet | null;
  customer?: CustomerShort | null;
  combo?: Combo | null;
  room?: {
    id: number;
    name: string;
    class?: string;
    price?: string | null;
    status?: string | null;
    description?: string | null;
    size?: string | null;
    images?: ImageItem[] | null;
  } | null;
  Image?: ImageItem[];
  payments?: Payment[];
}
