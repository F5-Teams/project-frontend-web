export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | string;

export interface ApiService {
  id: number;
  name: string;
  price: string;
  duration: number;
  description: string;
  isActive: boolean;
}

export interface ApiServiceLink {
  id: number;
  comboId: number;
  serviceId: number;
  service: ApiService;
}

export interface ApiCombo {
  id: number;
  name: string;
  price: string;
  duration: number;
  description: string;
  isActive: boolean;
  serviceLinks: ApiServiceLink[];
}

export interface ApiSlot {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: string;
  roomId: number;
}

export interface ApiRoom {
  id: number;
  name: string;
  class: string;
  price: string;
  status: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface ApiPet {
  id: number;
  name: string;
  age: number;
  species: string;
  breed: string;
  gender: boolean;
  height: string;
  weight: string;
  note: string;
  userId: number;
  recordId: number | null;
  imageUrl?: string | null;
  avatar?: string | null;
}

export interface ApiBooking {
  id: number;
  bookingDate: string;
  dropDownSlot: "MORNING" | "AFTERNOON" | "EVENING" | string;
  checkInDate: string | null;
  checkOutDate: string | null;
  status: BookingStatus;
  note: string | null;
  servicePrice: string | null;
  comboPrice: string | null;
  createdAt: string;
  comboId: number | null;
  customerId: number;
  staffId: number | null;
  groomerId: number | null;
  petId: number;
  slotId: number | null;
  roomId: number | null;
  pet: ApiPet;
  combo: ApiCombo | null;
  Room: ApiRoom | null;
  room?: ApiRoom | null;
  slot: ApiSlot | null;
}

export interface ApiFilteredBooking {
  id: number;
  status: BookingStatus;
  bookingDate: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  dropDownSlot: "MORNING" | "AFTERNOON" | "EVENING" | string;
  type?: "SPA" | "HOTEL" | string;
  totalPrice: number;
  isPaid: boolean;
  pet: {
    id: number;
    name: string;
    imageUrl?: string | null;
  };
  combo?: {
    id: number;
    name: string;
    services: {
      id: number;
      name: string;
      imageUrl?: string | null;
    }[];
  } | null;
  room?: {
    id: number;
    name: string;
    imageUrl?: string | null;
  } | null;
  slot?: {
    startDate: string;
    endDate: string;
    totalPrice: number;
  } | null;
  canLeaveFeedback?: boolean;
  hasFeedback?: boolean;
}
