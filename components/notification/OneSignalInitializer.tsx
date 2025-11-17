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
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    if (!token) {
      // Nếu người dùng logout, ta có thể xóa playerId
      // OneSignal.removeExternalUserId(); // hoặc gọi API để xóa player id khỏi DB
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    const initOneSignal = async () => {
      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
      if (!appId) {
        console.error("Missing NEXT_PUBLIC_ONESIGNAL_APP_ID env variable");
        return;
      }

      await OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true, // Cho phép test trên localhost
      });

      // Lấy player ID (device token)
      // @ts-expect-error: SDK versions differ; getUserId exists on some builds
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
      const handler = (e: unknown) => {
        const event = e as {
          content?: string;
          data?: { bookingId?: string | number };
        };
        console.log("OneSignal notification displayed:", event);
        const newNotification = {
          id: Date.now(),
          message: event.content || "Bạn có thông báo mới",
          isRead: false,
          createdAt: new Date().toISOString(),
          bookingId: event?.data?.bookingId
            ? Number(event.data.bookingId)
            : undefined,
        };
        addNotification(newNotification);
      };
      // Đăng ký listener theo API v16 (foregroundWillDisplay)
      OneSignal.Notifications.addEventListener(
        "foregroundWillDisplay",
        handler
      );

      // Trả về cleanup để gọi khi unmount (nếu SDK hỗ trợ off)
      return () => {
        try {
          OneSignal.Notifications.removeEventListener(
            "foregroundWillDisplay",
            handler
          );
        } catch {}
      };
    };

    let cleanup: (() => void) | undefined;
    initOneSignal().then((fn) => {
      if (typeof fn === "function") cleanup = fn;
    });

    return () => {
      if (cleanup) {
        try {
          cleanup();
        } catch {}
      }
    };
  }, [token, addNotification]);

  return null; // Component này không render gì cả
}
