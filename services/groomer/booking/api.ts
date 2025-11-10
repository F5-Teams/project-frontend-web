import api from "@/config/axios";
import { Booking } from "./type";

export async function getConfirmedBookings(): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>("/groomer/my-bookings/confirmed");
  return data;
}

export async function startBookingOnService(bookingId: number): Promise<void> {
  await api.put(`/groomer/my-bookings/${bookingId}/onservice`);
}

export interface UploadBookingPhotosPayload {
  imageUrls: string[];
  imageType: "BEFORE" | "DURING" | "AFTER"; // kept for BEFORE flow, AFTER completion will use 'AFTER'
  note?: string;
}

// Previous endpoint for incremental photo upload (still used for BEFORE images)
export async function uploadBookingPhotos(
  bookingId: number,
  payload: UploadBookingPhotosPayload
): Promise<void> {
  await api.put(`/groomer/my-bookings/${bookingId}/photos`, payload);
}

// New complete service endpoint: marks booking COMPLETED and stores provided photos
export interface CompleteBookingPayload {
  imageUrls: string[]; // before or after photos (API requires at least one)
  note?: string;
  imageType?: "BEFORE" | "AFTER"; // optional, backend example shows AFTER
}

export async function completeBooking(
  bookingId: number,
  payload: CompleteBookingPayload
): Promise<void> {
  await api.put(`/groomer/my-bookings/${bookingId}/complete`, payload);
}
