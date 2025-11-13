// Chat Types
export interface Room {
  id: number;
  customerId: number;
  staffId: number | null;
  customer?: User;
  staff?: User;
  messages?: Message[];
  _count?: {
    messages: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  id: number;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "ENDED";
  startedAt: string;
  endedAt?: string | null;
  roomId: number;
  customerId: number;
  staffId: number | null;
  room?: Room;
  customer?: User;
  staff?: User;
}

export interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  sender: User;
  roomId: number;
}

export interface RoomHistoryResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// WebSocket Event Types
export interface SocketConnectedData {
  message: string;
  userId: number;
  userRole: string;
}

export interface JoinedRoomData {
  roomId: number;
  message: string;
}

export interface SessionJoinedData {
  sessionId: number;
  roomId: number;
  staff: User;
}

export interface UserLeftData {
  roomId: number;
  userId: number;
  userName: string;
}

export interface SocketErrorData {
  message: string;
}

