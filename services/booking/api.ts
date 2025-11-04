import api from "@/config/axios";

export interface BulkBookingRequest {
  paymentMethod: "WALLET" | "CASH";
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
  bookingIds?: number[];
  errors?: string[];
  error?: string;
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
