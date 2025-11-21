import api from "@/config/axios";

export interface CreateFeedbackPayload {
  rating: number;
  comment: string;
}

export async function createBookingFeedback(
  bookingId: number,
  payload: CreateFeedbackPayload
): Promise<void> {
  await api.post(`/feedback/booking/${bookingId}`, payload);
}

export interface BookingFeedback {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  booking?: unknown;
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
