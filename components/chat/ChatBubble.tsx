"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { chatApi, Message, Session } from "@/services/chat/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  CheckCheck,
  Clock,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // For creating consultation request
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  // For chat
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [staffJoined, setStaffJoined] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user ID
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

  // Check if user already has an active session
  useEffect(() => {
    const checkExistingSession = async () => {
      // Check if user is logged in
      if (
        typeof window === "undefined" ||
        !localStorage.getItem("accessToken")
      ) {
        return;
      }

      try {
        // 1. Lấy room của customer
        const rooms = await chatApi.getRooms();
        if (rooms && rooms.length > 0) {
          const room = rooms[0];
          setRoomId(room.id);

          // 2. Gọi API mới để check session hiện tại
          const currentSession = await chatApi.getCurrentSession();

          if (currentSession) {
            // Có session đang hoạt động → Join chat luôn
            setHasSession(true);
            setCurrentSession(currentSession);
            setStaffJoined(
              currentSession.status === "ACTIVE" && !!currentSession.staff
            );
            console.log("✅ Found current session:", currentSession);
          } else {
            // Không có session → Hiển thị form tạo mới
            setHasSession(false);
            setCurrentSession(null);
            console.log("ℹ️ No active session, show create form");
          }
        }
      } catch (error) {
        console.error("Failed to check existing session:", error);
      }
    };

    checkExistingSession();
  }, []);

  // Setup WebSocket for chat
  useEffect(() => {
    if (!socket || !isConnected || !roomId || !hasSession) return;

    console.log("📣 ChatBubble emitting join_room", { roomId, socketId: socket.id });
    socket.emit("join_room", { roomId });

    socket.on("joined_room", (data) => {
      console.log("✅ Joined room:", data);
    });

    socket.on("room_history", (data) => {
      setMessages(data.messages || []);
      // Count unread messages when bubble is closed
      if (!isOpen && data.messages) {
        const unread = data.messages.filter(
          (m: Message) => !m.isRead && m.sender.id !== currentUserId
        ).length;
        setUnreadCount(unread);
      }
    });

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);

      // Increment unread if bubble is closed and message is not from current user
      if (!isOpen && message.sender.id !== currentUserId) {
        setUnreadCount((prev) => prev + 1);
      }

      // Show toast if message is from staff and bubble is closed
      if (!isOpen && currentUserId && message.sender.id !== currentUserId) {
        toast.info(`Tin nhắn mới từ staff`);
      }
    });

    socket.on("session_joined", (data) => {
      console.log("👨‍💼 Staff joined:", data);
      setStaffJoined(true);
      setCurrentSession((prev) =>
        prev ? { ...prev, staff: data.staff, status: "ACTIVE" } : null
      );
      toast.success(`Staff đã vào tư vấn!`);
    });

    socket.on("session_ended", (data) => {
      console.log("🔚 Session ended:", data);
      setCurrentSession((prev) =>
        prev ? { ...prev, status: "CLOSED" } : null
      );
      toast.info("Phiên tư vấn đã kết thúc");
      // KHÔNG disconnect để còn nhận tin nhắn kết thúc từ staff
    });

    return () => {
      // Chỉ cleanup event listeners, KHÔNG leave room
      socket.off("joined_room");
      socket.off("room_history");
      socket.off("new_message");
      socket.off("session_joined");
      socket.off("session_ended");
    };
  }, [socket, isConnected, roomId, hasSession, isOpen, currentUserId]);

  // Re-emit join_room on reconnect
  useEffect(() => {
    if (!socket || !roomId) return;
    const onConnect = () => {
      console.log("🔌 ChatBubble socket reconnected - re-emitting join_room", { roomId });
      socket.emit("join_room", { roomId });
    };
    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
    };
  }, [socket, roomId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create consultation request
  const handleCreateSession = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập nội dung yêu cầu tư vấn");
      return;
    }

    // Check if user is logged in
    if (typeof window === "undefined" || !localStorage.getItem("accessToken")) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    if (!roomId) {
      // Try to get room first
      try {
        const rooms = await chatApi.getRooms();
        if (rooms && rooms.length > 0) {
          setRoomId(rooms[0].id);
        } else {
          toast.error("Không tìm thấy phòng chat của bạn");
          return;
        }
      } catch {
        toast.error("Không thể kết nối với hệ thống chat");
        return;
      }
    }

    setCreating(true);
    try {
      const session = await chatApi.createSession(roomId!, title.trim());

      setHasSession(true);
      setCurrentSession(session);
      setTitle("");

      toast.success("Đã tạo yêu cầu tư vấn! Đang chờ staff...");
    } catch (error) {
      console.error("Failed to create session:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tạo yêu cầu tư vấn";
      toast.error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!socket || !inputMessage.trim() || sending || !roomId) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    try {
      socket.emit("send_message", {
        roomId,
        content: messageContent,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Không thể gửi tin nhắn");
      setInputMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasSession) {
        sendMessage();
      } else {
        handleCreateSession();
      }
    }
  };

  // Reset về form tạo phiên mới
  const handleResetToCreateNew = async () => {
    setHasSession(false);
    setCurrentSession(null);
    setMessages([]);
    setTitle("");
    setStaffJoined(false);
    toast.success("Hãy tạo yêu cầu tư vấn mới");
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Clear unread count when opening
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chat Bubble */}
      <div className="fixed bottom-2 right-1 z-50">
        {!isOpen && (
          <button
            onClick={toggleOpen}
            className="relative bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-110 animate-bounce-slow"
          >
            <MessageSquare className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-poppins font-semibold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className="w-[380px] h-[600px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {hasSession ? "Chat tư vấn" : "Yêu cầu tư vấn"}
                </h3>
                <div className="flex items-center gap-2 text-xs mt-1">
                  {hasSession ? (
                    staffJoined ? (
                      <>
                        <CheckCheck className="h-3 w-3" />
                        <span>Staff đang tư vấn</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        <span>Đang chờ staff...</span>
                      </>
                    )
                  ) : (
                    <span>Nhập yêu cầu của bạn</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleOpen}
                  className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleOpen}
                  className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {!hasSession ? (
                // Create Consultation Form
                <div className="flex-1 p-4 flex flex-col">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Nhập nội dung bạn cần tư vấn, đội ngũ staff sẽ hỗ trợ bạn
                      ngay
                    </p>
                    <Input
                      type="text"
                      placeholder="VD: Tư vấn về dịch vụ spa cho chó..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={creating}
                      className="w-full"
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {title.length}/200 ký tự
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm">
                    <p className="text-blue-800 dark:text-blue-200">
                      💡 <strong>Lưu ý:</strong> Staff sẽ tham gia tư vấn cho
                      bạn trong thời gian sớm nhất.
                    </p>
                  </div>

                  <Button
                    onClick={handleCreateSession}
                    disabled={!title.trim() || creating}
                    className="w-full mt-auto"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Tạo yêu cầu tư vấn
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                // Chat Messages
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Chưa có tin nhắn</p>
                        <p className="text-xs mt-1">Bắt đầu trò chuyện!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = currentUserId === msg.sender.id;

                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-2",
                              isOwn ? "flex-row-reverse" : "flex-row"
                            )}
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(
                                  msg.sender.firstName,
                                  msg.sender.lastName
                                )}
                              </AvatarFallback>
                            </Avatar>

                            <div
                              className={cn(
                                "flex flex-col",
                                isOwn ? "items-end" : "items-start"
                              )}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-xs font-medium">
                                  {msg.sender.firstName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(msg.createdAt)}
                                </span>
                              </div>

                              <div
                                className={cn(
                                  "px-3 py-2 rounded-2xl text-sm max-w-[250px]",
                                  isOwn
                                    ? "bg-pink-500 text-white rounded-tr-none"
                                    : "bg-gray-100 dark:bg-gray-800 rounded-tl-none"
                                )}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {msg.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input hoặc Create New Session */}
                  <div className="border-t p-3">
                    {currentSession?.status === "CLOSED" ? (
                      // Hiển thị button tạo phiên mới khi session kết thúc
                      <Button
                        onClick={handleResetToCreateNew}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Tạo phiên tư vấn mới
                      </Button>
                    ) : (
                      // Input tin nhắn bình thường
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Nhập tin nhắn..."
                          disabled={sending || !isConnected}
                          className="flex-1"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={
                            !inputMessage.trim() || sending || !isConnected
                          }
                          size="icon"
                          className="bg-pink-500 hover:bg-pink-600"
                        >
                          {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        )}
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
