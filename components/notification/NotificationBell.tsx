"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import {
  useUnreadCount,
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "@/services/notification/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import gsap from "gsap";
import { CustomeScrolling } from "@/components/shared/CustomeScrolling";

export default function NotificationBell() {
  const { data: unreadCount = 0, refetch } = useUnreadCount();
  const { data: notifications = [], refetch: refetchNotifications } =
    useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();
  const [open, setOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const bellRef = useRef<HTMLButtonElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/sound/noti.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.load();

    // Enable audio on first user interaction
    const enableAudio = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current!.pause();
            audioRef.current!.currentTime = 0;
          })
          .catch(() => {
            console.log("Audio autoplay prevented");
          });
      }
    };

    // Try to enable audio on any user interaction
    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("keydown", enableAudio, { once: true });

    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };
  }, []);

  // Polling: Refetch notifications every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      refetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch, refetchNotifications]);

  // Detect new notifications and play animation + sound
  useEffect(() => {
    if (unreadCount > prevCount && prevCount !== 0) {
      // Play notification sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.warn("Cannot play notification sound:", error);
          // Fallback: Try to play on next user interaction
          const playOnClick = () => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
            document.removeEventListener("click", playOnClick);
          };
          document.addEventListener("click", playOnClick, { once: true });
        });
      }

      // Bell shake animation
      if (bellRef.current) {
        gsap.fromTo(
          bellRef.current,
          { rotation: 0 },
          {
            rotation: 15,
            duration: 0.1,
            yoyo: true,
            repeat: 5,
            ease: "power2.inOut",
          }
        );
      }

      // Badge pop animation
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { scale: 0, opacity: 0 },
          {
            scale: 1.3,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
            onComplete: () => {
              gsap.to(badgeRef.current, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
              });
            },
          }
        );
      }

      // Show toast notification
      toast.info("Bạn có thông báo mới!", {
        duration: 3000,
      });
    }
    setPrevCount(unreadCount);
  }, [unreadCount, prevCount]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          ref={bellRef}
          className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Bell size={24} className="text-slate-600" />
          {unreadCount > 0 && (
            <span
              ref={badgeRef}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0" sideOffset={5}>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-poppins-regular text-[16px]">Thông báo</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                markAllAsRead.mutate(undefined, {
                  onSuccess: () => toast.success("Đã đánh dấu tất cả"),
                  onError: () => toast.error("Có lỗi xảy ra"),
                });
              }}
              disabled={markAllAsRead.isPending}
            >
              {/* <Check className="w-4 h-4 mr-1" /> */}
              Đánh dấu tất cả
            </Button>
          )}
        </div>

        <CustomeScrolling axis="y" className="max-h-[280px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-poppins-light">Không có thông báo mới</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 border-b hover:bg-slate-50 transition-colors ${
                  !notif.isRead ? "bg-blue-50/50" : "bg-slate-100/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p
                      className={`font-poppins-regular text-sm mb-1 ${
                        notif.isRead ? "text-slate-500" : "text-slate-900"
                      }`}
                    >
                      {notif.message}
                    </p>
                    <div className="flex justify-between">
                      <p className="font-poppins-light text-xs text-slate-500">
                        {new Date(notif.createdAt).toLocaleString("vi-VN")}
                      </p>
                      {notif.bookingId && (
                        <p className="font-poppins-light text-xs text-primary mt-1">
                          Booking #{notif.bookingId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!notif.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          markAsRead.mutate(notif.id, {
                            onSuccess: () =>
                              toast.success("Đã đánh dấu đã đọc"),
                            onError: () => toast.error("Có lỗi xảy ra"),
                          });
                        }}
                        disabled={markAsRead.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => {
                        deleteNotification.mutate(notif.id, {
                          onSuccess: () => toast.success("Đã xóa thông báo"),
                          onError: () => toast.error("Có lỗi xảy ra"),
                        });
                      }}
                      disabled={deleteNotification.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CustomeScrolling>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
