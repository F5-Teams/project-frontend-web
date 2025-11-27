import api from "@/config/axios";
import { Booking } from "./types";

export async function getBookings(): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>("/bookings/me");
  return data;
}

export async function getFilteredBookings(params: {
  fromDate: string;
  toDate: string;
  type?: string;
}): Promise<Booking[]> {
  const { fromDate, toDate, type } = params;
  const { data } = await api.get<Booking[]>("/bookings/filter", {
    params: { fromDate, toDate, type },
  });
  return data;
}

export async function getBookingById(id: number): Promise<Booking> {
  const { data } = await api.get<Booking>(`/bookings/${id}`);
  return data;
}

export async function cancelBooking(id: number, note: string) {
  const { data } = await api.put(`/bookings/${id}/cancel`, { note });
  return data;
}
