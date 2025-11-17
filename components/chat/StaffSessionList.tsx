"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/contexts/SocketContext";
import { chatApi, Session } from "@/services/chat/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Loader2, RefreshCw, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function StaffSessionList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  // Lấy danh sách sessions
  const fetchSessions = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setRefreshing(true);

    try {
      const data = await chatApi.getUnassignedSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách yêu cầu tư vấn";
      toast.error(errorMessage);
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  };

  // Load initial sessions
  useEffect(() => {
    fetchSessions();
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.play().catch((err) => {
        console.error("Failed to play notification sound:", err);
      });
    } catch (error) {
      console.error("Notification sound error:", error);
    }
  };

  // Claim session
  const handleClaimSession = useCallback(
    async (sessionId: number, roomId: number) => {
      setClaimingId(sessionId);

      try {
        await chatApi.joinSession(sessionId);

        toast.success("Đã nhận yêu cầu tư vấn thành công!");

        // Chuyển sang trang chat
        router.push(`/staff/chat/${roomId}?sessionId=${sessionId}`);
      } catch (error) {
        console.error("Failed to claim session:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Không thể nhận session này. Có thể đã có staff khác nhận rồi.";

        toast.error(errorMessage);

        // Refresh lại danh sách
        fetchSessions(false);
      } finally {
        setClaimingId(null);
      }
    },
    [router]
  );

  // Listen for new sessions via WebSocket
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Lắng nghe session mới
    socket.on("new_session", (newSession: Session) => {
      console.log("🔔 New consultation request received:", newSession);

      // Thêm session mới vào đầu danh sách
      setSessions((prev) => {
        // Kiểm tra xem session đã tồn tại chưa để tránh duplicate
        const exists = prev.some((s) => s.id === newSession.id);
        if (exists) return prev;
        return [newSession, ...prev];
      });

      // Play notification sound (optional)
      playNotificationSound();

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification("Yêu cầu tư vấn mới", {
          body: `${newSession.customer.firstName} ${newSession.customer.lastName} cần hỗ trợ`,
          icon: "/logo/logo.png",
          tag: `session-${newSession.id}`,
        });
      }

      // Get roomId từ newSession.room.id hoặc newSession.roomId
      const roomId = newSession.room?.id || newSession.roomId;

      // Show toast notification
      toast.info(
        `🔔 Yêu cầu tư vấn mới từ ${newSession.customer.firstName} ${newSession.customer.lastName}`,
        {
          duration: 5000,
          action: {
            label: "Xem ngay",
            onClick: () => {
              if (roomId) {
                handleClaimSession(newSession.id, roomId);
              } else {
                console.error("Missing roomId in new_session event");
                toast.error("Không thể xem session này");
              }
            },
          },
        }
      );
    });

    return () => {
      socket.off("new_session");
    };
  }, [socket, isConnected, handleClaimSession]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "Vừa xong";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-poppins font-semibold tracking-tight">
            Yêu cầu tư vấn
          </h2>
          <p className="text-muted-foreground">
            Danh sách các yêu cầu tư vấn đang chờ xử lý
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <MessageSquare className="h-4 w-4 mr-2" />
            {sessions.length} yêu cầu
          </Badge>

          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchSessions(false)}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">
                Không có yêu cầu nào đang chờ
              </p>
              <p className="text-sm mt-1">
                Danh sách sẽ tự động cập nhật khi có yêu cầu mới
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getInitials(
                          session.customer.firstName,
                          session.customer.lastName
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-2">
                        {session.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        {session.customer.firstName} {session.customer.lastName}
                      </CardDescription>
                    </div>
                  </div>

                  <Badge variant="outline" className="shrink-0">
                    {session.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{getTimeAgo(session.startedAt)}</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Username: @{session.customer.userName}</p>
                  {session.customer.phoneNumber && (
                    <p>SĐT: {session.customer.phoneNumber}</p>
                  )}
                </div>

                <Button
                  onClick={() => {
                    // Get roomId từ session.room.id hoặc session.roomId
                    const roomId = session.room?.id || session.roomId;
                    if (roomId) {
                      handleClaimSession(session.id, roomId);
                    } else {
                      console.error("Missing roomId in session:", session);
                      toast.error("Không thể nhận session này - thiếu roomId");
                    }
                  }}
                  disabled={claimingId === session.id}
                  className="w-full"
                  size="sm"
                >
                  {claimingId === session.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Nhận tư vấn
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
