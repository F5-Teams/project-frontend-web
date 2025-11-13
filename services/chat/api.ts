import api from "@/config/axios";
import { Room, Session, Message, RoomHistoryResponse } from "./types";

// Customer APIs
export const chatApi = {
  // Get customer rooms
  getRooms: async (): Promise<Room[]> => {
    const { data } = await api.get<Room[]>("/chat/rooms");
    return data;
  },

  // Get room by id
  getRoomById: async (roomId: number): Promise<Room> => {
    const { data } = await api.get<Room>(`/chat/rooms/${roomId}`);
    return data;
  },

  // Get room messages
  getRoomMessages: async (
    roomId: number,
    page: number = 1,
    limit: number = 50
  ): Promise<RoomHistoryResponse> => {
    const { data } = await api.get<RoomHistoryResponse>(
      `/chat/rooms/${roomId}/messages`,
      {
        params: { page, limit },
      }
    );
    return data;
  },

  // Create session (customer)
  createSession: async (
    roomId: number,
    title: string
  ): Promise<Session> => {
    const { data } = await api.post<Session>(
      `/chat/rooms/${roomId}/sessions`,
      { title }
    );
    return data;
  },

  // Staff/Admin APIs
  // Get unassigned sessions
  getUnassignedSessions: async (): Promise<Session[]> => {
    const { data } = await api.get<Session[]>("/chat/sessions/unassigned");
    return data;
  },

  // Join session (claim session)
  joinSession: async (sessionId: number): Promise<Session> => {
    const { data } = await api.post<Session>(
      `/chat/sessions/${sessionId}/join`
    );
    return data;
  },

  // End session
  endSession: async (sessionId: number): Promise<Session> => {
    const { data } = await api.post<Session>(
      `/chat/sessions/${sessionId}/end`
    );
    return data;
  },

  // Rooms-based method (Direct)
  // Get unassigned rooms
  getUnassignedRooms: async (): Promise<Room[]> => {
    const { data } = await api.get<Room[]>("/chat/rooms/unassigned");
    return data;
  },

  // Get assigned rooms
  getAssignedRooms: async (): Promise<Room[]> => {
    const { data } = await api.get<Room[]>("/chat/rooms/assigned");
    return data;
  },
};

