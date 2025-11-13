"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";

// Hàm này sẽ gọi API để cập nhật oneSignalPlayerId cho user
async function updateUserPlayerId(playerId: string | null, token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me/onesignal-player-id`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oneSignalPlayerId: playerId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update OneSignal Player ID:", errorData.message);
    } else {
      console.log("Successfully updated OneSignal Player ID.");
    }
  } catch (error) {
    console.error("Error updating OneSignal Player ID:", error);
  }
}

export default function OneSignalInitializer() {
  const { addNotification } = useNotifications();
  const initialized = useRef(false);

  // Lấy token từ localStorage hoặc từ AuthContext của bạn
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    if (!token) {
      // Nếu người dùng logout, ta có thể xóa playerId
      // OneSignal.removeExternalUserId(); // hoặc gọi API để xóa player id khỏi DB
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    const initOneSignal = async () => {
      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
        allowLocalhostAsSecureOrigin: true, // Cho phép test trên localhost
      });

      // Lấy player ID (OneSignal gọi là userId trong SDK mới)
      const playerId = await OneSignal.getUserId();
      if (playerId && token) {
        console.log("OneSignal Player ID:", playerId);
        // Gửi Player ID lên backend để lưu vào DB
        await updateUserPlayerId(playerId, token);
      } else {
        console.log(
          "Could not get OneSignal Player ID or user is not logged in."
        );
      }

      // Lắng nghe sự kiện khi có thông báo mới (khi user đang mở trang web)
      OneSignal.on("notificationDisplay", (event) => {
        console.log("OneSignal notification displayed:", event);
        // Tạo một đối tượng notification giả để thêm vào state
        const newNotification = {
          id: Date.now(), // Dùng timestamp làm id tạm thời
          message: event.content,
          isRead: false,
          createdAt: new Date().toISOString(),
          // Bạn có thể lấy data từ payload nếu có
          bookingId: event.data?.bookingId,
        };
        addNotification(newNotification);
      });
    };

    initOneSignal();
  }, [token, addNotification]);

  return null; // Component này không render gì cả
}
