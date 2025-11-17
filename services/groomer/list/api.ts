import api from "@/config/axios";
import { Booking } from "./type";

export async function getMyBookings(): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>("/groomer/my-bookings");
  return data;
}
