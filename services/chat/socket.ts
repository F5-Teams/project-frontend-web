import { io, Socket } from "socket.io-client";
import {
  SocketConnectedData,
  JoinedRoomData,
  RoomHistoryResponse,
  Message,
  SessionJoinedData,
  UserLeftData,
  SocketErrorData,
} from "./types";

class ChatSocketService {
  private socket: Socket | null = null;
  private apiUrl: string;

  constructor() {
    this.apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
      "http://localhost:8080";
  }

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(`${this.apiUrl}/chat`, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join room
  joinRoom(roomId: number) {
    if (this.socket) {
      this.socket.emit("join_room", { roomId });
    }
  }

  // Leave room
  leaveRoom(roomId: number) {
    if (this.socket) {
      this.socket.emit("leave_room", { roomId });
    }
  }

  // Send message
  sendMessage(roomId: number, content: string) {
    if (this.socket) {
      this.socket.emit("send_message", { roomId, content });
    }
  }

  // Join session (for staff/admin)
  joinSession(sessionId: number) {
    if (this.socket) {
      this.socket.emit("join_session", { sessionId });
    }
  }

  // Leave session
  leaveSession(sessionId: number) {
    if (this.socket) {
      this.socket.emit("leave_session", { sessionId });
    }
  }

  // Event Listeners
  onConnected(callback: (data: SocketConnectedData) => void) {
    this.socket?.on("connected", callback);
  }

  onJoinedRoom(callback: (data: JoinedRoomData) => void) {
    this.socket?.on("joined_room", callback);
  }

  onRoomHistory(callback: (data: RoomHistoryResponse) => void) {
    this.socket?.on("room_history", callback);
  }

  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on("new_message", callback);
  }

  onSessionJoined(callback: (data: SessionJoinedData) => void) {
    this.socket?.on("session_joined", callback);
  }

  onUserLeft(callback: (data: UserLeftData) => void) {
    this.socket?.on("user_left", callback);
  }

  onError(callback: (error: SocketErrorData) => void) {
    this.socket?.on("error", callback);
  }

  // Remove listeners
  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const chatSocketService = new ChatSocketService();

