export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  bookingId: number | null;
  userId: number;
  status?: string;
}

export interface GetNotificationsParams {
  isRead?: boolean;
  status?: string;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAsReadResponse {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  bookingId: number | null;
}

export interface MarkAllAsReadResponse {
  message: string;
  updatedCount: number;
}

export interface DeleteNotificationResponse {
  message: string;
}
