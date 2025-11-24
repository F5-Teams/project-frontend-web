"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { chatApi, Message, Session, Room } from "@/services/chat/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCheck,
  X,
  User,
  Phone,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function StaffChatPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const router = useRouter();

  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [ending, setEnding] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Lấy thông tin room (session sẽ được lấy từ socket event room_history)
  useEffect(() => {
    const fetchData = async () => {
      if (!roomId) return;

      try {
        const roomData = await chatApi.getRoomById(Number(roomId));
        setRoom(roomData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Không thể tải thông tin chat");
      }
    };

    fetchData();
  }, [roomId]);

  // Setup WebSocket
  useEffect(() => {
    if (!socket || !isConnected || !roomId) return;

    setLoading(true);

    console.log(
      "📣 Emitting join_room for roomId:",
      roomId,
      "socketId:",
      socket.id
    );
    socket.emit("join_room", { roomId: Number(roomId) });

    socket.on("joined_room", (data) => {
      console.log("✅ Staff joined room:", data);
      setLoading(false);
    });

    socket.on("room_history", (data) => {
      console.log("📜 Room history:", data);
      setMessages(data.messages || []);

      // Set session từ room history nếu có
      if (data.currentSession) {
        setSession(data.currentSession);
      }

      setLoading(false);
    });

    socket.on("new_message", (message: Message) => {
      console.log("💬 New message:", message);
      setMessages((prev) => [...prev, message]);

      if (currentUserId && message.sender.id !== currentUserId) {
        toast.info(`Tin nhắn mới từ khách hàng`);
      }
    });

    socket.on("session_ended", (data) => {
      console.log("🔚 Session ended:", data);
      setSession((prev) =>
        prev ? { ...prev, status: "CLOSED", endedAt: data.endedAt } : null
      );
      toast.success("Đã kết thúc session tư vấn");

      setTimeout(() => {
        router.push("/staff/sessions");
      }, 2000);
    });

    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    });

    return () => {
      socket.emit("leave_room", { roomId: Number(roomId) });
      socket.off("joined_room");
      socket.off("room_history");
      socket.off("new_message");
      socket.off("session_ended");
      socket.off("error");
    };
  }, [socket, isConnected, roomId, currentUserId, router]);

  // Re-emit join_room when socket reconnects to help debug cases where
  // join was attempted while socket was not fully connected
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      if (!roomId) return;
      console.log("🔌 Socket reconnected - re-emitting join_room", {
        roomId,
        socketId: socket.id,
      });

      socket.emit("join_room", { roomId: Number(roomId) });
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, roomId]);

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
      setInputMessage(messageContent);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;

    setEnding(true);
    try {
      await chatApi.endSession(Number(sessionId));
      setShowEndDialog(false);
      // Toast sẽ được hiển thị từ socket event "session_ended"
      // Không cần toast ở đây để tránh duplicate
    } catch (error) {
      console.error("Failed to end session:", error);
      toast.error("Không thể kết thúc session");
    } finally {
      setEnding(false);
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

  const isSystemMessage = (msg: Message) => {
    const first = msg.sender.firstName?.toLowerCase() || "";
    const username = msg.sender.userName?.toLowerCase() || "";
    return (
      username === "system" ||
      first === "hệ thống" ||
      first === "he thong" ||
      first === "he-thong"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const customer = room?.customer || session?.customer;

  return (
    <div className="flex flex-col min-h-[calc(100vh-88px)] h-[calc(100vh-88px)] min-h-0 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg rounded-b-2xl">
        <div className="w-full h-20 max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 h-full">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/staff/sessions")}
                className="text-white hover:bg-white/15 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-white text-green-600 font-semibold">
                  {customer &&
                    getInitials(customer.firstName, customer.lastName)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-xl font-semibold leading-tight">
                  {customer
                    ? `${customer.firstName} ${customer.lastName}`
                    : "Khách hàng"}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />@{customer?.userName}
                  </span>
                  {customer?.phoneNumber && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {customer.phoneNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-white/15 text-white border-0 px-3 py-2 rounded-full"
              >
                {isConnected ? (
                  <>
                    <CheckCheck className="h-3.5 w-3.5 mr-1" />
                    Đã kết nối
                  </>
                ) : (
                  "Mất kết nối"
                )}
              </Badge>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowEndDialog(true)}
                disabled={session?.status === "CLOSED"}
                className="bg-white text-emerald-700 hover:bg-white/90 rounded-full"
              >
                <X className="h-4 w-4 mr-2" />
                Kết thúc
              </Button>
            </div>
          </div>

          {/* Session Info */}
          {session && (
            <div className="mt-3 p-3 bg-white/15 rounded-lg backdrop-blur">
              <p className="text-sm font-medium">{session.title}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-white/90">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full",
                    session.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : session.status === "CLOSED"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  )}
                >
                  {session.status}
                </Badge>
                <span className="opacity-90">
                  Bắt đầu: {new Date(session.startedAt).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 px-2 sm:px-4 py-4">
        <div className="h-full overflow-y-auto w-full max-w-7xl mx-auto space-y-4 bg-transparent">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có tin nhắn nào</p>
              <p className="text-sm">Bắt đầu tư vấn cho khách hàng</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = currentUserId === msg.sender.id;
              const isSystem = isSystemMessage(msg);
              const initials = getInitials(
                msg.sender.firstName,
                msg.sender.lastName
              );

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="flex flex-col items-center max-w-5xl w-full">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span className="font-semibold text-gray-800">
                          Hệ Thống
                        </span>
                        <span>{formatTime(msg.createdAt)}</span>
                      </div>
                      <Card className="w-full bg-amber-50 border-amber-200 text-amber-900 rounded-2xl shadow-sm">
                        <div className="flex items-start gap-2 p-3">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-3",
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  {!isOwn && (
                    <Avatar className="h-9 w-9 shadow-sm">
                      <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                        {initials || "KH"}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "space-y-1 max-w-5xl",
                      isOwn ? "items-end text-right" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2 text-xs text-muted-foreground",
                        isOwn ? "justify-end" : "justify-start"
                      )}
                    >
                      <span className="font-semibold text-gray-800">
                        {`${msg.sender.firstName} ${msg.sender.lastName}`}
                      </span>
                      <span>{formatTime(msg.createdAt)}</span>
                    </div>

                    <Card
                      className={cn(
                        "p-3 shadow-sm border rounded-2xl",
                        isOwn
                          ? "bg-emerald-50 border-emerald-100 text-emerald-900"
                          : "bg-white border-gray-200 text-gray-900"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </Card>
                  </div>

                  {isOwn && (
                    <Avatar className="h-9 w-9 shadow-sm">
                      <AvatarFallback className="bg-emerald-500 text-white font-semibold">
                        {initials || "NV"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur border-t p-4 shadow-lg">
        <div className="w-full max-w-7xl mx-auto flex gap-3">
          <Input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              session?.status === "CLOSED"
                ? "Session đã kết thúc"
                : "Nhập tin nhắn tư vấn..."
            }
            disabled={sending || !isConnected || session?.status === "CLOSED"}
            className="flex-1 rounded-xl shadow-sm"
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
            className="bg-emerald-600 hover:bg-emerald-700 rounded-full shadow"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* End Session Dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Kết thúc session tư vấn?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn kết thúc session tư vấn này không? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={ending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEndSession}
              disabled={ending}
              className="bg-red-600 hover:bg-red-700"
            >
              {ending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Kết thúc"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
