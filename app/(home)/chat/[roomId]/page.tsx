"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useParams, useRouter } from "next/navigation";
import { chatApi, Message, Session } from "@/services/chat/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCheck,
  Clock,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CustomerChatPage() {
  const { roomId } = useParams();
  const router = useRouter();

  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [staffJoined, setStaffJoined] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Lấy thông tin user hiện tại
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch (error) {
        console.error("Failed to parse user:", error);
      }
    }
  }, []);

  // Lấy thông tin session hiện tại
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Sử dụng API getCurrentSession thay vì getSessionById
        const sessionData = await chatApi.getCurrentSession();
        if (sessionData) {
          setSession(sessionData);
          setStaffJoined(
            sessionData.status === "ACTIVE" && !!sessionData.staff
          );
        } else {
          // Không có session hiện tại
          toast.error("Không tìm thấy phiên chat");
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        toast.error("Không thể tải thông tin session");
      }
    };

    fetchSession();
  }, [router]);

  // Setup WebSocket
  useEffect(() => {
    if (!socket || !isConnected || !roomId) return;

    setLoading(true);

    // Join room
    socket.emit("join_room", { roomId: Number(roomId) });

    // Lắng nghe khi join thành công
    socket.on("joined_room", (data) => {
      console.log("✅ Joined room:", data);
      setLoading(false);
    });

    // Lắng nghe lịch sử tin nhắn
    socket.on("room_history", (data) => {
      console.log("📜 Room history:", data);
      setMessages(data.messages || []);
      setLoading(false);
    });

    // Lắng nghe tin nhắn mới
    socket.on("new_message", (message: Message) => {
      console.log("💬 New message:", message);
      setMessages((prev) => [...prev, message]);

      // Nếu tin nhắn không phải của mình thì hiển thị toast
      if (currentUserId && message.sender.id !== currentUserId) {
        toast.info(
          `${message.sender.firstName}: ${message.content.substring(0, 50)}...`
        );
      }
    });

    // Lắng nghe khi staff vào
    socket.on("session_joined", (data) => {
      console.log("👨‍💼 Staff joined:", data);
      setStaffJoined(true);
      setSession((prev) =>
        prev ? { ...prev, staff: data.staff, status: "ACTIVE" } : null
      );

      toast.success(
        `Staff ${data.staff?.firstName || "Unknown"} đã vào tư vấn!`,
        { duration: 5000 }
      );
    });

    // Lắng nghe khi session kết thúc
    socket.on("session_ended", (data) => {
      console.log("🔚 Session ended:", data);
      setSession((prev) =>
        prev ? { ...prev, status: "CLOSED", endedAt: data.endedAt } : null
      );

      toast.info("Session tư vấn đã kết thúc", { duration: 5000 });
    });

    // Lắng nghe lỗi
    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    });

    return () => {
      socket.emit("leave_room", { roomId: Number(roomId) });
      socket.off("joined_room");
      socket.off("room_history");
      socket.off("new_message");
      socket.off("session_joined");
      socket.off("session_ended");
      socket.off("error");
    };
  }, [socket, isConnected, roomId, currentUserId]);

  const sendMessage = async () => {
    if (!socket || !inputMessage.trim() || sending) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    try {
      socket.emit("send_message", {
        roomId: Number(roomId),
        content: messageContent,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Không thể gửi tin nhắn");
      setInputMessage(messageContent); // Restore message
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-lg font-semibold">
                {session?.title || "Chat hỗ trợ"}
              </h1>
              <div className="flex items-center gap-2">
                {staffJoined ? (
                  <>
                    <Badge variant="default" className="text-xs">
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Staff đang tư vấn
                    </Badge>
                    {session?.staff && (
                      <span className="text-xs text-muted-foreground">
                        {session.staff.firstName} {session.staff.lastName}
                      </span>
                    )}
                  </>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Đang chờ staff...
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Đã kết nối" : "Mất kết nối"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có tin nhắn nào</p>
              <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = currentUserId === msg.sender.id;

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    isOwn ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(msg.sender.firstName, msg.sender.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={cn(
                      "flex flex-col",
                      isOwn ? "items-end" : "items-start"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">
                        {msg.sender.firstName} {msg.sender.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    <Card
                      className={cn(
                        "p-3 max-w-md",
                        isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-white dark:bg-gray-800"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </Card>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              session?.status === "CLOSED"
                ? "Session đã kết thúc"
                : "Nhập tin nhắn..."
            }
            disabled={sending || !isConnected || session?.status === "CLOSED"}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={
              !inputMessage.trim() ||
              sending ||
              !isConnected ||
              session?.status === "CLOSED"
            }
            size="icon"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
