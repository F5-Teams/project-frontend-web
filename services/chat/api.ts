import api from "@/config/axios";

// ============= TYPES =============
export interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
}

export interface Message {
  id: number;
  content: string;
  sender: User;
  createdAt: string;
  isRead: boolean;
}

export interface Session {
  id: number;
  title: string;
  roomId: number;
  customer: User;
  staff?: User;
  status: "ACTIVE" | "CLOSED" | "WAITING";
  startedAt: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Fields for new_session WebSocket event
  room?: {
    id: number;
    customerId: number;
    customer: User;
  };
}

export interface Room {
  id: number;
  customer: User;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface RoomHistory {
  room: Room;
  messages: Message[];
  currentSession?: Session;
}

// ============= API FUNCTIONS =============
export const chatApi = {
  // ========== ROOM MANAGEMENT ==========

  /**
   * Lấy danh sách rooms của user hiện tại
   * Customer: Chỉ có 1 room
   * Staff: Có thể có nhiều rooms
   */
  getRooms: async (): Promise<Room[]> => {
    try {
      const response = await api.get("/chat/rooms");
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching rooms:", error);
      throw new Error("Không thể tải danh sách phòng chat");
    }
  },

  /**
   * Lấy thông tin chi tiết của 1 room
   */
  getRoomById: async (roomId: number): Promise<Room> => {
    try {
      const response = await api.get(`/chat/rooms/${roomId}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching room:", error);
      throw new Error("Không thể tải thông tin phòng chat");
    }
  },

  /**
   * Lấy lịch sử tin nhắn của room
   */
  getRoomHistory: async (roomId: number): Promise<RoomHistory> => {
    try {
      const response = await api.get(`/chat/rooms/${roomId}/history`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching room history:", error);
      throw new Error("Không thể tải lịch sử chat");
    }
  },

  // ========== SESSION MANAGEMENT ==========

  /**
   * CUSTOMER: Tạo session tư vấn mới
   */
  createSession: async (roomId: number, title: string): Promise<Session> => {
    try {
      const response = await api.post(`/chat/rooms/${roomId}/sessions`, {
        title,
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating session:", error);
      throw new Error("Không thể tạo yêu cầu tư vấn");
    }
  },

  /**
   * STAFF: Lấy danh sách sessions chưa được claim
   */
  getUnassignedSessions: async (): Promise<Session[]> => {
    try {
      const response = await api.get("/chat/sessions/unassigned");
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching unassigned sessions:", error);
      throw new Error("Không thể tải danh sách yêu cầu tư vấn");
    }
  },

  /**
   * STAFF: Lấy danh sách sessions đang IN_PROGRESS
   * Staff: Chỉ thấy sessions của mình
   * Admin: Thấy tất cả sessions
   */
  getInProgressSessions: async (): Promise<Session[]> => {
    try {
      const response = await api.get("/chat/sessions/in-progress");
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching in-progress sessions:", error);
      throw new Error("Không thể tải danh sách phiên chat đang xử lý");
    }
  },

  /**
   * STAFF: Nhận (claim) một session để tư vấn
   */
  joinSession: async (sessionId: number): Promise<Session> => {
    try {
      const response = await api.post(`/chat/sessions/${sessionId}/join`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error joining session:", error);
      throw new Error(
        "Không thể nhận yêu cầu tư vấn. Có thể đã có staff khác nhận rồi."
      );
    }
  },

  /**
   * STAFF: Kết thúc session tư vấn
   */
  endSession: async (sessionId: number): Promise<Session> => {
    try {
      const response = await api.post(`/chat/sessions/${sessionId}/end`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error ending session:", error);
      throw new Error("Không thể kết thúc session tư vấn");
    }
  },

  /**
   * Lấy danh sách sessions của user hiện tại
   */
  getMySessions: async (): Promise<Session[]> => {
    try {
      const response = await api.get("/chat/sessions/my-sessions");
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching my sessions:", error);
      throw new Error("Không thể tải danh sách sessions của bạn");
    }
  },

  /**
   * CUSTOMER: Lấy session hiện tại đang hoạt động
   * Trả về session nếu có (OPEN hoặc IN_PROGRESS)
   * Trả về null nếu không có hoặc đã ENDED
   */
  getCurrentSession: async (): Promise<Session | null> => {
    try {
      const response = await api.get("/chat/sessions/current");
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching current session:", error);
      return null; // Trả về null nếu không có session
    }
  },

  // ========== MESSAGE MANAGEMENT ==========

  /**
   * Lấy danh sách tin nhắn trong room
   * Sử dụng pagination để tải tin nhắn cũ hơn
   */
  getMessages: async (
    roomId: number,
    page: number = 1,
    limit: number = 50
  ): Promise<{ messages: Message[]; total: number; hasMore: boolean }> => {
    try {
      const response = await api.get(
        `/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching messages:", error);
      throw new Error("Không thể tải tin nhắn");
    }
  },

  /**
   * Đánh dấu tin nhắn đã đọc
   */
  markMessageAsRead: async (messageId: number): Promise<void> => {
    try {
      await api.patch(`/chat/messages/${messageId}/read`);
    } catch (error: unknown) {
      console.error("Error marking message as read:", error);
      // Không throw error vì đây không phải chức năng quan trọng
    }
  },

  /**
   * Đánh dấu tất cả tin nhắn trong room đã đọc
   */
  markAllMessagesAsRead: async (roomId: number): Promise<void> => {
    try {
      await api.patch(`/chat/rooms/${roomId}/read-all`);
    } catch (error: unknown) {
      console.error("Error marking all messages as read:", error);
    }
  },
};
