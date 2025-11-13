// Export all chat types from services/chat/api.ts
export type {
  User,
  Message,
  Session,
  Room,
  RoomHistory,
} from "@/services/chat/api";

// Re-import for use in this file
import type { User, Message, Session, Room } from "@/services/chat/api";

// Additional WebSocket event types
export interface SocketEvents {
  // Client to Server
  join_room: { roomId: number };
  leave_room: { roomId: number };
  send_message: { roomId: number; content: string };

  // Server to Client
  connected: { userId: number; socketId: string };
  joined_room: { roomId: number; userId: number };
  room_history: { messages: Message[]; room: Room };
  new_message: Message;
  session_joined: { session: Session; staff: User };
  session_ended: { sessionId: number; endedAt: string };
  error: { message: string; code?: string };
}

// Chat component props
export interface ChatPageProps {
  params: {
    roomId: string;
  };
  searchParams: {
    sessionId?: string;
  };
}

export interface SessionListProps {
  initialSessions?: Session[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface ConsultationFormProps {
  onSuccess?: (session: Session) => void;
  onError?: (error: Error) => void;
}
