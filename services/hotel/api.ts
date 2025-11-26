import api from "@/config/axios";
import type { HotelRoom, HotelRoomResponse } from "./types";

export const hotelApi = {
  // Get available hotel rooms with optional date filtering
  getAvailableRooms: async (
    checkInDate?: Date | null,
    checkOutDate?: Date | null
  ): Promise<HotelRoom[]> => {
    try {
      let url = "/rooms/available";

      // Add date query parameters if both dates are provided
      if (checkInDate && checkOutDate) {
        // Format dates to ISO string but preserve the local date (avoid timezone shift)
        // Create new Date at midnight UTC with the same year/month/day as local date
        const checkInUTC = new Date(
          Date.UTC(
            checkInDate.getFullYear(),
            checkInDate.getMonth(),
            checkInDate.getDate(),
            0,
            0,
            0,
            0
          )
        );
        const checkOutUTC = new Date(
          Date.UTC(
            checkOutDate.getFullYear(),
            checkOutDate.getMonth(),
            checkOutDate.getDate(),
            0,
            0,
            0,
            0
          )
        );

        const checkInISO = checkInUTC.toISOString();
        const checkOutISO = checkOutUTC.toISOString();
        url += `?checkInDate=${checkInISO}&checkOutDate=${checkOutISO}`;
      }

      const response = await api.get(url);
      // API returns array directly, not wrapped in response.data
      return response.data || [];
    } catch (error: unknown) {
      console.error("Error fetching hotel rooms:", error);
      let errorMessage = "Không thể tải danh sách phòng khách sạn";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      throw new Error(errorMessage);
    }
  },

  // Get hotel room by ID from available rooms
  getRoomById: async (id: string): Promise<HotelRoom> => {
    try {
      // Get all available rooms and find the one with matching ID
      const rooms = await hotelApi.getAvailableRooms();
      const room = rooms.find((room) => room.id.toString() === id);

      if (!room) {
        throw new Error(`Phòng với ID ${id} không tồn tại hoặc không khả dụng`);
      }

      return room;
    } catch (error: unknown) {
      console.error("Error fetching hotel room:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể tải thông tin phòng khách sạn";
      throw new Error(errorMessage);
    }
  },
};
