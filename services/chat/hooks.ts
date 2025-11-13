import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "./api";
import { Session } from "./types";

// Query Keys
export const CHAT_QUERY_KEYS = {
  rooms: ["chat", "rooms"] as const,
  room: (id: number) => ["chat", "room", id] as const,
  roomMessages: (id: number, page?: number, limit?: number) =>
    ["chat", "room", id, "messages", page, limit] as const,
  unassignedSessions: ["chat", "sessions", "unassigned"] as const,
  session: (id: number) => ["chat", "session", id] as const,
  unassignedRooms: ["chat", "rooms", "unassigned"] as const,
  assignedRooms: ["chat", "rooms", "assigned"] as const,
};

// Customer Hooks
export function useGetRooms() {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.rooms,
    queryFn: chatApi.getRooms,
  });
}

export function useGetRoomById(roomId: number) {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.room(roomId),
    queryFn: () => chatApi.getRoomById(roomId),
    enabled: !!roomId,
  });
}

export function useGetRoomMessages(
  roomId: number,
  page: number = 1,
  limit: number = 50
) {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.roomMessages(roomId, page, limit),
    queryFn: () => chatApi.getRoomMessages(roomId, page, limit),
    enabled: !!roomId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, title }: { roomId: number; title: string }) =>
      chatApi.createSession(roomId, title),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.rooms,
      });
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.unassignedSessions,
      });
    },
  });
}

// Staff/Admin Hooks
export function useGetUnassignedSessions() {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.unassignedSessions,
    queryFn: chatApi.getUnassignedSessions,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

export function useJoinSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) => chatApi.joinSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.unassignedSessions,
      });
    },
  });
}

export function useEndSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) => chatApi.endSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.unassignedSessions,
      });
    },
  });
}

// Rooms-based method hooks
export function useGetUnassignedRooms() {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.unassignedRooms,
    queryFn: chatApi.getUnassignedRooms,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

export function useGetAssignedRooms() {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.assignedRooms,
    queryFn: chatApi.getAssignedRooms,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

