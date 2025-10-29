import api from "@/config/axios";
import { ApiBooking } from "./types";

export async function getBookings(): Promise<ApiBooking[]> {
  const { data } = await api.get<ApiBooking[]>("/bookings");
  return data;
}
