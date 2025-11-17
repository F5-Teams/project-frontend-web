import api from "@/config/axios";
import type {
  Notification,
  GetNotificationsParams,
  UnreadCountResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
  DeleteNotificationResponse,
} from "./type";

// Get all notifications with optional filters
export async function getNotifications(
  params?: GetNotificationsParams
): Promise<Notification[]> {
  const { data } = await api.get<Notification[]>("/notifications", { params });
  return data;
}

// Get unread notification count
export async function getUnreadCount(): Promise<number> {
  const { data } = await api.get<UnreadCountResponse>(
    "/notifications/unread-count"
  );
  return data.count;
}

// Mark a notification as read
export async function markNotificationAsRead(
  id: number
): Promise<MarkAsReadResponse> {
  const { data } = await api.patch<MarkAsReadResponse>(
    `/notifications/${id}/read`
  );
  return data;
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<MarkAllAsReadResponse> {
  const { data } = await api.post<MarkAllAsReadResponse>(
    "/notifications/read-all"
  );
  return data;
}

// Delete a notification
export async function deleteNotification(
  id: number
): Promise<DeleteNotificationResponse> {
  const { data } = await api.delete<DeleteNotificationResponse>(
    `/notifications/${id}`
  );
  return data;
}
