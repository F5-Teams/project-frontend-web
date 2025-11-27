// trạng thái booking
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "ON_SERVICE"
  | "COMPLETED"
  | string;

// loại booking
export type BookingType = "SPA" | "HOTEL" | string;

// khung giờ
export type TimeSlot = "MORNING" | "AFTERNOON" | "EVENING";

export interface Booking {
  id: number;
  bookingCode: string;
  status: BookingStatus;
  bookingDate: string;
  createdAt: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  dropDownSlot: TimeSlot;
  type: BookingType;
  totalPrice: number;
  isPaid: boolean;
  note: string;

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

  imagesBooking?: Array<{
    id: number;
    imageUrl: string;
    type: "BEFORE" | "AFTER";
  }>;

  paymentSummary?: {
    id: number;
    status: string;
    totalAmount: number;
    method: string;
    date: string;
  };

  groomer?: {
    id: number;
    name: string;
  };
  canLeaveFeedback?: boolean;
  hasFeedback?: boolean;
}

export interface CalendarEvent {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  type: BookingType;
  status: BookingStatus;
  booking: Booking;
}

export const TIME_SLOTS = {
  MORNING: { hour: 7, minute: 0, duration: 270 }, // 7:00 - 11:30 (4.5 hours)
  AFTERNOON: { hour: 12, minute: 30, duration: 240 }, // 12:30 - 16:30 (4 hours)
  EVENING: { hour: 17, minute: 0, duration: 120 }, // 17:00 - 19:00 (2 hours)
} as const;
