import api from "@/config/axios";

export interface HotelRoom {
  id: number;
  name: string;
  class: string;
  price: string;
  description?: string;
  images?: Array<{
    id: number;
    imageUrl: string;
  }>;
  // Additional fields that might be needed
  pricePerNight?: number;
  image?: string;
  category?: string;
  isAvailable?: boolean;
  capacity?: {
    maxAdult: number;
    maxChildren: number;
    standardAdult: number;
    standardChildren: number;
  };
  amenities?: string[];
  totalAvailableRooms?: number;
}

export interface HotelRoomResponse {
  success: boolean;
  data: HotelRoom[];
  message?: string;
}

export const hotelApi = {
  // Get available hotel rooms
  getAvailableRooms: async (): Promise<HotelRoom[]> => {
    try {
      const response = await api.get("/rooms/available");
      // API returns array directly, not wrapped in response.data
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching hotel rooms:", error);
      throw new Error(
        error?.response?.data?.message ||
          "Không thể tải danh sách phòng khách sạn"
      );
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
    } catch (error: any) {
      console.error("Error fetching hotel room:", error);
      throw new Error(
        error?.message || "Không thể tải thông tin phòng khách sạn"
      );
    }
  },
};
