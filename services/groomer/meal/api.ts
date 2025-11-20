import api from "@/config/axios";
import type {
  GetFeedingSchedulesByBookingParams,
  GetFeedingSchedulesByBookingResponse,
  GetPendingFeedingSchedulesParams,
  GetPendingFeedingSchedulesResponse,
  MarkFeedingScheduleAsFedParams,
  MarkFeedingScheduleAsFedResponse,
} from "./type";

export const getFeedingSchedulesByBooking = async (
  params: GetFeedingSchedulesByBookingParams
): Promise<GetFeedingSchedulesByBookingResponse> => {
  try {
    const response = await api.get(
      `/feeding/schedules/booking/${params.bookingId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching feeding schedules by booking:", error);
    throw error;
  }
};

export const getPendingFeedingSchedules = async (
  params?: GetPendingFeedingSchedulesParams
): Promise<GetPendingFeedingSchedulesResponse> => {
  try {
    const queryParams = params?.date ? `?date=${params.date}` : "";
    const response = await api.get(`/feeding/schedules/pending${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending feeding schedules:", error);
    throw error;
  }
};

export const markFeedingScheduleAsFed = async (
  params: MarkFeedingScheduleAsFedParams
): Promise<MarkFeedingScheduleAsFedResponse> => {
  try {
    const { id, ...body } = params;
    const response = await api.patch(`/feeding/schedules/${id}/mark-fed`, body);
    return response.data;
  } catch (error) {
    console.error("Error marking feeding schedule as fed:", error);
    throw error;
  }
};
