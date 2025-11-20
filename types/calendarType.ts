export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Onservice"
  | "Completed"
  | "Cancelled";

export interface BookingMeta {
  bookingDate?: string;
  startDate?: string;
  endDate?: string;
  pet?: string;
  room?: string;
}

export type CalendarBooking = {
  id: number | string;
  title: string;
  color: string;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  bookingDate?: string | null;
  dropDownSlot?: string | null;
  totalPrice?: number | null;
  isPaid?: boolean | null;
  slot?: {
    id?: number;
    startDate?: string | null;
    endDate?: string | null;
    totalPrice?: string | null;
    roomId?: number | null;
  } | null;

  pet?: {
    id?: number;
    name?: string;
    imageUrl?: string | null;
    avatar?: string | null;
    age?: number;
    species?: string;
    breed?: string;
    gender?: boolean | null;
  } | null;

  room?: {
    id?: number;
    name?: string;
    class?: string;
    price?: string;
    status?: string;
    description?: string | null;
    imageUrl?: string | null;
  } | null;

  Room?: {
    id?: number;
    name?: string;
    class?: string;
    price?: string;
    status?: string;
    description?: string | null;
    imageUrl?: string | null;
  } | null;

  combo?: {
    id?: number;
    name?: string;
    price?: string;
    duration?: number | null;
    description?: string | null;
    serviceLinks?: Array<{
      id?: number;
      comboId?: number;
      serviceId?: number;
      service?: { id?: number; name?: string; imageUrl?: string | null } | null;
    }>;
  } | null;

  meta?: {
    pet?: string | null;
    room?: string | null;
    bookingDate?: string | null;
    startDate?: string | null;
    endDate?: string | null;
  } | null;
};
