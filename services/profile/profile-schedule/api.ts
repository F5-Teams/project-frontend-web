import api from "@/config/axios";
import { ApiBooking, ApiFilteredBooking } from "./types";

export async function getBookings(): Promise<ApiBooking[]> {
  const { data } = await api.get<ApiBooking[]>("/bookings");
  return data;
}

export async function getFilteredBookings(params: {
  fromDate: string;
  toDate: string;
  type?: string;
}): Promise<ApiFilteredBooking[]> {
  const { fromDate, toDate, type } = params;
  const { data } = await api.get<ApiFilteredBooking[]>("/bookings/filter", {
    params: { fromDate, toDate, type },
  });
  return data;
}
