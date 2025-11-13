"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetRooms, useCreateSession } from "@/services/chat/hooks";
import { chatSocketService } from "@/services/chat/socket";
import { Message, Session, Room } from "@/services/chat/types";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CustomerChat() {
  const [room, setRoom] = useState<Room | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  const { data: rooms, isLoading: isLoadingRooms } = useGetRooms();
  const createSessionMutation = useCreateSession();

  // Lấy room của customer
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setRoom(rooms[0]);
    }
  }, [rooms]);

  // Kết nối WebSocket
  useEffect(() => {
    if (!room) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để sử dụng chat");
      return;
    }

    const socket = chatSocketService.connect(token);
    socketRef.current = socket;

    // Event listeners
    socket.on("connected", (data) => {
      console.log("Connected to chat server", data);
      setIsConnected(true);
      // Join room
      chatSocketService.joinRoom(room.id);
    });

    socket.on("joined_room", (data) => {
      console.log("Joined room", data);
    });

    socket.on("room_history", (data) => {
      console.log("Room history", data);
      setMessages(data.messages || []);
    });

    socket.on("new_message", (message: Message) => {
      console.log("New message", message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on("session_joined", (data) => {
      console.log("Staff joined session", data);
      toast.success(`Nhân viên ${data.staff.firstName} ${data.staff.lastName} đã vào tư vấn`);
      // Refresh session info if needed
    });

    socket.on("user_left", (data) => {
      console.log("User left", data);
      toast.info("Nhân viên đã rời khỏi phòng");
    });

    socket.on("error", (error) => {
      console.error("Socket error", error);
      toast.error(error.message || "Có lỗi xảy ra");
    });

    return () => {
      chatSocketService.disconnect();
      setIsConnected(false);
    };
  }, [room]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Tạo session khi bấm "Tư vấn"
  const handleStartConsultation = async () => {
    if (!room || !topic.trim()) {
      toast.error("Vui lòng nhập chủ đề tư vấn");
      return;
    }

    setIsLoading(true);
    try {
      const newSession = await createSessionMutation.mutateAsync({
        roomId: room.id,
        title: topic,
      });
      setSession(newSession);
      setShowTopicInput(false);
      setTopic("");
      toast.success("Đã tạo phiên tư vấn. Vui lòng chờ nhân viên vào tư vấn.");
    } catch (error: any) {
      toast.error(error.message || "Không thể tạo phiên tư vấn");
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (!socketRef.current || !room || !inputMessage.trim()) return;

    chatSocketService.sendMessage(room.id, inputMessage);
    setInputMessage("");
  };

  if (isLoadingRooms) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Bạn chưa có phòng chat. Vui lòng liên hệ admin.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5" />
              <CardTitle>Chat Tư Vấn</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "outline"}>
                {isConnected ? "Đã kết nối" : "Đang kết nối..."}
              </Badge>
              {session && (
                <Badge variant="secondary">
                  {session.status === "OPEN" && "Chờ nhân viên"}
                  {session.status === "IN_PROGRESS" && "Đang tư vấn"}
                  {session.status === "ENDED" && "Đã kết thúc"}
                </Badge>
              )}
            </div>
          </div>
          {session && (
            <p className="text-sm text-muted-foreground mt-1">
              Chủ đề: {session.title}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
            <p>Chưa có tin nhắn nào</p>
            {!session && (
              <p className="text-sm mt-2">Bấm "Bắt đầu tư vấn" để bắt đầu</p>
            )}
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage =
              message.sender.id === room.customerId ||
              (room.customer && message.sender.id === room.customer.id);
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  isOwnMessage ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.sender.avatar && (
                    <AvatarImage src={message.sender.avatar} />
                  )}
                  <AvatarFallback>
                    {message.sender.firstName?.[0]}
                    {message.sender.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col max-w-[70%] ${
                    isOwnMessage ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(message.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <Card className="rounded-none border-x-0 border-b-0">
        <CardContent className="p-4">
          {!session && !showTopicInput && (
            <div className="flex justify-center">
              <Button
                onClick={() => setShowTopicInput(true)}
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Bắt đầu tư vấn
              </Button>
            </div>
          )}

          {showTopicInput && !session && (
            <div className="space-y-3">
              <Input
                placeholder="Nhập chủ đề tư vấn (ví dụ: Tư vấn về dịch vụ chăm sóc thú cưng)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleStartConsultation();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTopicInput(false);
                    setTopic("");
                  }}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleStartConsultation}
                  disabled={isLoading || !topic.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo phiên tư vấn"
                  )}
                </Button>
              </div>
            </div>
          )}

          {session && (
            <div className="flex gap-2">
              <Input
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={!isConnected}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!isConnected || !inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

