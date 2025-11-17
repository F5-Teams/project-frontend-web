import api from "@/config/axios";

export interface BulkBookingRequest {
  paymentMethod: "WALLET" | "VNPAY" | "MOMO";
  bookings: Array<{
    type: "SPA" | "HOTEL";
    petId: number;
    bookingDate: string;
    note: string;
    dropDownSlot: string;
    comboId?: number; // For SPA combo bookings
    serviceIds?: number[]; // For custom SPA service bookings
    roomId?: number; // For HOTEL bookings
    startDate?: string; // For HOTEL bookings
    endDate?: string; // For HOTEL bookings
  }>;
}

export interface BulkBookingResponse {
  success: boolean;
  createdCount?: number;
  bookingIds?: string[];
  errors?: string[];
  error?: string;
  message?: string;
  paymentMethod?: string;
  paymentUrl?: string;
  orderBookingId?: number;
  totalAmount?: number;
  allPaid?: boolean;
  newWalletBalance?: number;
}

export const bookingApi = {
  // Create bulk bookings
  createBulkBookings: async (
    data: BulkBookingRequest
  ): Promise<BulkBookingResponse> => {
    try {
      const response = await api.post("/bookings/bulk", data);
      return {
        success: response.data.success || true,
        createdCount: response.data.createdCount,
        bookingIds: response.data.bookingIds || [],
        errors: response.data.errors || [],
        message: response.data.message,
        paymentMethod: response.data.paymentMethod,
        paymentUrl: response.data.paymentUrl,
        orderBookingId: response.data.orderBookingId,
        totalAmount: response.data.totalAmount,
        allPaid: response.data.allPaid,
        newWalletBalance: response.data.newWalletBalance,
      };
    } catch (error) {
      console.error("Error creating bulk bookings:", error);
      const apiError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        error: apiError?.response?.data?.message || "Không thể tạo booking",
      };
    }
  },
};
