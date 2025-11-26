export interface RefundImage {
  id: number;
  imageUrl: string;
}

export interface RefundCustomer {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
}

export interface RefundBooking {
  id: number;
  bookingCode: string;
  bookingDate: string;
  dropDownSlot: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  status: string;
  note: string | null;
  servicePrice: string;
  comboPrice: string | null;
  isPaid: boolean;
  cancelledBy: string | null;
  cancelledAt: string | null;
  createdAt: string;
  orderBookingId: number;
  scheduledStartDate: string;
  scheduledEndDate: string;
  scheduledTotalPrice: string;
  comboId: number | null;
  customerId: number;
  staffId: number | null;
  groomerId: number | null;
  petId: number | null;
  slotId: number | null;
  roomId: number | null;
}

export interface RefundItem {
  id: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  amount: string;
  refundedAmount: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;

  customerId: number;
  reviewedByName: string | null;
  bookingId: number;
  transactionId: string | null;

  customer: RefundCustomer;
  booking: RefundBooking;
  images: RefundImage[];
}
