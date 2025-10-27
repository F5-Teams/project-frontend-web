// Cart System Types

// Unified Booking Draft - chuẩn hóa cho tất cả loại dịch vụ
export interface BookingDraft {
  tempId: string;
  petId: number;
  bookingDate: string;
  dropDownSlot: "MORNING" | "AFTERNOON" | "EVENING";
  note?: string;
  customName?: string;
  serviceIds?: number[];
  comboId?: number; // ID của combo spa (nếu đặt combo)
  groomerId?: number;
  roomId?: number;
  startDate?: string;
  endDate?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird" | "rabbit" | "other";
  avatar: string;
  age: number;
  notes?: string;
}

export interface Groomer {
  id: string;
  name: string;
  rating: number;
  specialties: string[];
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  isAvailable: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: "spa" | "grooming" | "medical" | "training";
  duration: number; // minutes
  price: number;
  description: string;
  groomerIds: string[];
  maxPets?: number; // undefined = unlimited, 1 = single pet only
  allowCustomCombo: boolean;
}

export interface Combo {
  id: string;
  name: string;
  serviceIds: string[];
  price: number;
  benefits: string[];
  category: "spa" | "hotel" | "mixed";
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  photos: string[];
}

export interface Availability {
  spa: {
    date: string;
    timeSlots: TimeSlot[];
  }[];
  hotel: {
    date: string;
    availableRooms: string[];
  }[];
}

export interface PricingRule {
  depositPercentage: number; // 50%
  weekendSurcharge?: number; // 10%
  holidaySurcharge?: number;
}

// Cart Item Types
export type CartItemType = "single" | "combo" | "custom" | "room";

export interface BaseCartItem {
  id: string;
  type: CartItemType;
  petIds: string[];
  price: number;
  deposit: number;
  status: "draft" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface SingleServiceCartItem extends BaseCartItem {
  type: "single";
  payload: {
    serviceId: string;
    groomerId: string;
    appointmentTime: string; // ISO string
    notes?: string;
  };
}

export interface ComboCartItem extends BaseCartItem {
  type: "combo";
  payload: {
    comboId: string;
    appointmentTime?: string; // for spa combos
    notes?: string;
  };
}

export interface CustomComboCartItem extends BaseCartItem {
  type: "custom";
  payload: {
    selectedServiceIds: string[];
    groomerId?: string;
    appointmentTime?: string;
    notes?: string;
  };
}

export interface RoomCartItem extends BaseCartItem {
  type: "room";
  payload: {
    roomId: string;
    checkIn: string; // YYYY-MM-DD
    checkOut: string; // YYYY-MM-DD
    nights: number;
    notes?: string;
  };
}

export type CartItem =
  | SingleServiceCartItem
  | ComboCartItem
  | CustomComboCartItem
  | RoomCartItem;

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  totalDeposit: number;
  items: BookingDraft[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "card" | "bank_transfer" | "cash";
  isDefault?: boolean;
}

export interface CheckoutData {
  cartItems: BookingDraft[];
  paymentMethod: PaymentMethod;
  customerNotes?: string;
  totalPrice: number;
  totalDeposit: number;
}

export interface BookingConfirmation {
  bookingId: string;
  status: "pending" | "confirmed" | "cancelled";
  items: BookingDraft[];
  totalPrice: number;
  depositAmount: number;
  createdAt: string;
  estimatedConfirmationTime: string;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface SlotConflict {
  type: "groomer" | "time" | "room";
  message: string;
  conflictingItems: string[];
}

// Modal State Types
export interface SelectPetsModalState {
  isOpen: boolean;
  serviceId?: string;
  maxPets?: number;
  selectedPetIds: string[];
}

export interface BookingModalState {
  isOpen: boolean;
  type: CartItemType;
  serviceId?: string;
  comboId?: string;
  roomId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MockApiConfig {
  delay: number; // milliseconds
  shouldFail?: boolean;
  errorMessage?: string;
}
