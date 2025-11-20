import api from "@/config/axios";
import type { GetFeedingLogsByBookingResponse } from "./type";

export const getFeedingLogsByBooking = async (
  bookingId: number
): Promise<GetFeedingLogsByBookingResponse> => {
  try {
    const response = await api.get(`/feeding/logs/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feeding logs by booking:", error);
    throw error;
  }
};
