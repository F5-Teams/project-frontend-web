import api from "@/config/axios";
import { CreateFeedbackPayload, BookingFeedback } from "./type";

export async function createBookingFeedback(
  bookingId: number,
  payload: CreateFeedbackPayload
): Promise<void> {
  await api.post(`/feedback/booking/${bookingId}`, payload);
}

export async function getBookingFeedback(
  bookingId: number
): Promise<BookingFeedback | null> {
  try {
    const { data } = await api.get<BookingFeedback>(
      `/feedback/booking/${bookingId}`
    );
    return data ?? null;
  } catch (err) {
    const e = err as { response?: { status?: number } };
    const status = e?.response?.status;
    if (status === 404) return null;
    throw err;
  }
}
