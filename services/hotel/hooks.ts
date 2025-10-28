import { useState, useEffect } from "react";
import { hotelApi, HotelRoom } from "./api";

export const useHotelRooms = () => {
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const roomsData = await hotelApi.getAvailableRooms();
      setRooms(roomsData || []);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách phòng khách sạn");
      console.error("Error fetching hotel rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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

  const fetchRoom = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const roomData = await hotelApi.getRoomById(id);
      setRoom(roomData);
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin phòng khách sạn");
      console.error("Error fetching hotel room:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  return {
    room,
    loading,
    error,
    refetch: fetchRoom,
  };
};
