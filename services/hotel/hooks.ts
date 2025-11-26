import { useState, useEffect, useCallback } from "react";
import { hotelApi } from "./api";
import type { HotelRoom } from "./types";

export const useHotelRooms = (
  checkInDate?: Date | null,
  checkOutDate?: Date | null
) => {
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    // Only fetch if both dates are selected
    if (!checkInDate || !checkOutDate) {
      setRooms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const roomsData = await hotelApi.getAvailableRooms(
        checkInDate,
        checkOutDate
      );
      setRooms(roomsData || []);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách phòng khách sạn";
      setError(errorMessage);
      console.error("Error fetching hotel rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
  };
};

export const useHotelRoom = (id: string) => {
  const [room, setRoom] = useState<HotelRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const roomData = await hotelApi.getRoomById(id);
      setRoom(roomData);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Không thể tải thông tin phòng khách sạn";
      setError(errorMessage);
      console.error("Error fetching hotel room:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  return {
    room,
    loading,
    error,
    refetch: fetchRoom,
  };
};
