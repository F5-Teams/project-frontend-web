"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetUnassignedSessions,
  useJoinSession,
  useEndSession,
  useGetUnassignedRooms,
  useGetAssignedRooms,
} from "@/services/chat/hooks";
import { chatSocketService } from "@/services/chat/socket";
import { Message, Session, Room } from "@/services/chat/types";
import {
  Send,
  MessageCircle,
  Loader2,
  Users,
  X,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type ChatMode = "sessions" | "rooms";

export function StaffChat() {
  const [mode, setMode] = useState<ChatMode>("sessions");

  // Sessions state
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Rooms state
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isFirstMessage, setIsFirstMessage] = useState(false);

  // Shared state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const queryClient = useQueryClient();

  // Sessions hooks
  const { data: unassignedSessions, isLoading: isLoadingSessions } =
    useGetUnassignedSessions();
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  // Rooms hooks
  const { data: unassignedRooms, isLoading: isLoadingUnassignedRooms } =
    useGetUnassignedRooms();
  const { data: assignedRooms, isLoading: isLoadingAssignedRooms } =
    useGetAssignedRooms();

  // Get current room ID based on mode
  const getCurrentRoomId = (): number | null => {
    if (mode === "sessions" && currentSession) {
      return currentSession.roomId;
    }
    if (mode === "rooms" && currentRoom) {
      return currentRoom.id;
    }
    return null;
  };

  // Kết nối WebSocket khi có session hoặc room
  useEffect(() => {
    const roomId = getCurrentRoomId();
    if (!roomId) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    const socket = chatSocketService.connect(token);
    socketRef.current = socket;

    // Event listeners
    socket.on("connected", (data) => {
      console.log("Connected to chat server", data);
      setIsConnected(true);
      // Join room
      chatSocketService.joinRoom(roomId);
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

      // Nếu là tin nhắn đầu tiên trong unassigned room, refresh danh sách
      if (mode === "rooms" && isFirstMessage) {
        setIsFirstMessage(false);
        queryClient.invalidateQueries({
          queryKey: ["chat", "rooms", "unassigned"],
        });
        queryClient.invalidateQueries({
          queryKey: ["chat", "rooms", "assigned"],
        });
      }
    });

    socket.on("user_left", (data) => {
      console.log("User left", data);
      toast.info("Khách hàng đã rời khỏi phòng");
    });

    socket.on("error", (error) => {
      console.error("Socket error", error);
      toast.error(error.message || "Có lỗi xảy ra");
    });

    return () => {
      chatSocketService.disconnect();
      setIsConnected(false);
    };
  }, [currentSession, currentRoom, mode, isFirstMessage, queryClient]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Claim session (Sessions method)
  const handleClaimSession = async (sessionId: number) => {
    try {
      const session = await joinSessionMutation.mutateAsync(sessionId);
      setCurrentSession(session);
      setCurrentRoom(null); // Clear room when switching to session
      toast.success("Đã vào phiên tư vấn");
    } catch (error: any) {
      toast.error(error.message || "Không thể vào phiên tư vấn");
    }
  };

  // End session (Sessions method)
  const handleEndSession = async () => {
    if (!currentSession) return;

    try {
      await endSessionMutation.mutateAsync(currentSession.id);

      // Leave room
      if (socketRef.current) {
        chatSocketService.leaveRoom(currentSession.roomId);
        chatSocketService.leaveSession(currentSession.id);
        chatSocketService.disconnect();
        socketRef.current = null;
      }

      setCurrentSession(null);
      setMessages([]);
      setIsConnected(false);
      toast.success("Đã kết thúc phiên tư vấn");
    } catch (error: any) {
      toast.error(error.message || "Không thể kết thúc phiên tư vấn");
    }
  };

  // Join room (Rooms method)
  const handleJoinRoom = (room: Room) => {
    setCurrentRoom(room);
    setCurrentSession(null); // Clear session when switching to room
    setIsFirstMessage(true); // Mark that next message will be first message
    setMessages([]);
  };

  // Leave room (Rooms method)
  const handleLeaveRoom = () => {
    if (socketRef.current && currentRoom) {
      chatSocketService.leaveRoom(currentRoom.id);
      chatSocketService.disconnect();
      socketRef.current = null;
    }
    setCurrentRoom(null);
    setMessages([]);
    setIsConnected(false);
    setIsFirstMessage(false);
  };

  // Gửi tin nhắn
  const handleSendMessage = () => {
    const roomId = getCurrentRoomId();
    if (!socketRef.current || !roomId || !inputMessage.trim()) return;

    chatSocketService.sendMessage(roomId, inputMessage);
    setInputMessage("");
  };

  // Render chat interface (shared for both modes)
  const renderChatInterface = () => {
    const roomId = getCurrentRoomId();
    const title =
      mode === "sessions"
        ? currentSession?.title
        : currentRoom?.customer
        ? `${currentRoom.customer.firstName} ${currentRoom.customer.lastName}`
        : "Chat";

    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <Card className="rounded-none border-x-0 border-t-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" />
                <div>
                  <CardTitle>Đang Tư Vấn</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "outline"}>
                  {isConnected ? "Đã kết nối" : "Đang kết nối..."}
                </Badge>
                {mode === "sessions" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEndSession}
                    disabled={endSessionMutation.isPending}
                  >
                    {endSessionMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang kết thúc...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Kết thúc
                      </>
                    )}
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleLeaveRoom}>
                    <X className="h-4 w-4 mr-2" />
                    Rời khỏi
                  </Button>
                )}
              </div>
            </div>
            {(mode === "sessions" && currentSession?.customer) ||
            (mode === "rooms" && currentRoom?.customer) ? (
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  {(mode === "sessions"
                    ? currentSession?.customer
                    : currentRoom?.customer
                  )?.avatar && (
                    <AvatarImage
                      src={
                        mode === "sessions"
                          ? currentSession?.customer?.avatar
                          : currentRoom?.customer?.avatar
                      }
                    />
                  )}
                  <AvatarFallback>
                    {mode === "sessions"
                      ? `${currentSession?.customer?.firstName?.[0]}${currentSession?.customer?.lastName?.[0]}`
                      : `${currentRoom?.customer?.firstName?.[0]}${currentRoom?.customer?.lastName?.[0]}`}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {mode === "sessions"
                    ? `${currentSession?.customer?.firstName} ${currentSession?.customer?.lastName}`
                    : `${currentRoom?.customer?.firstName} ${currentRoom?.customer?.lastName}`}
                </span>
              </div>
            ) : null}
          </CardHeader>
        </Card>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
              <p>Chưa có tin nhắn nào</p>
            </div>
          ) : (
            messages.map((message) => {
              // Get current user ID from localStorage
              const userStr = localStorage.getItem("user");
              const currentUserId = userStr ? JSON.parse(userStr).id : 0;

              // Ensure both values are numbers for comparison
              const senderId =
                typeof message.sender.id === "string"
                  ? parseInt(message.sender.id)
                  : message.sender.id;
              const isOwnMessage = senderId === currentUserId;

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
            {mode === "rooms" && isFirstMessage && (
              <p className="text-xs text-muted-foreground mt-2">
                💡 Gửi tin nhắn đầu tiên để tự động được assign vào room này
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Nếu đang có session hoặc room, hiển thị chat
  if (currentSession || currentRoom) {
    return renderChatInterface();
  }

  // Hiển thị danh sách với tabs
  return (
    <div className="flex flex-col h-screen bg-background">
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5" />
            <CardTitle>Tư Vấn Khách Hàng</CardTitle>
          </div>
        </CardHeader>
      </Card>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as ChatMode)}
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sessions">
              <MessageSquare className="h-4 w-4 mr-2" />
              Qua Sessions (Khuyến nghị)
            </TabsTrigger>
            <TabsTrigger value="rooms">
              <MessageCircle className="h-4 w-4 mr-2" />
              Qua Rooms (Trực tiếp)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Sessions Tab */}
        <TabsContent
          value="sessions"
          className="flex-1 overflow-y-auto p-4 m-0"
        >
          {isLoadingSessions ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !unassignedSessions || unassignedSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mb-4 opacity-50" />
              <p>Không có phiên tư vấn nào chờ xử lý</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {unassignedSessions.map((session) => (
                <Card
                  key={session.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleClaimSession(session.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-2">
                        {session.title}
                      </CardTitle>
                      <Badge variant="outline" className="ml-2 shrink-0">
                        {session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {session.customer && (
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-8 w-8">
                          {session.customer.avatar && (
                            <AvatarImage src={session.customer.avatar} />
                          )}
                          <AvatarFallback>
                            {session.customer.firstName?.[0]}
                            {session.customer.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {session.customer.firstName}{" "}
                            {session.customer.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            @{session.customer.userName}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {new Date(session.startedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaimSession(session.id);
                      }}
                      disabled={joinSessionMutation.isPending}
                    >
                      {joinSessionMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang vào...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Vào Tư Vấn
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="flex-1 overflow-y-auto p-4 m-0">
          <div className="space-y-6">
            {/* Unassigned Rooms */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Rooms Chưa Được Assign
              </h3>
              {isLoadingUnassignedRooms ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : !unassignedRooms || unassignedRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mb-4 opacity-50" />
                  <p>Không có room nào chờ xử lý</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {unassignedRooms.map((room) => (
                    <Card
                      key={room.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleJoinRoom(room)}
                    >
                      <CardHeader>
                        <CardTitle className="text-base">
                          Room #{room.id}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {room.customer && (
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-8 w-8">
                              {room.customer.avatar && (
                                <AvatarImage src={room.customer.avatar} />
                              )}
                              <AvatarFallback>
                                {room.customer.firstName?.[0]}
                                {room.customer.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {room.customer.firstName}{" "}
                                {room.customer.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                @{room.customer.userName}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <span>Tin nhắn: {room._count?.messages || 0}</span>
                        </div>
                        <Button className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Vào Chat
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Assigned Rooms */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Rooms Đã Được Assign
              </h3>
              {isLoadingAssignedRooms ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : !assignedRooms || assignedRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mb-4 opacity-50" />
                  <p>Không có room nào đã được assign</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {assignedRooms.map((room) => (
                    <Card
                      key={room.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleJoinRoom(room)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">
                            Room #{room.id}
                          </CardTitle>
                          {room.staff && (
                            <Badge
                              variant="secondary"
                              className="ml-2 shrink-0"
                            >
                              {room.staff.firstName} {room.staff.lastName}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {room.customer && (
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-8 w-8">
                              {room.customer.avatar && (
                                <AvatarImage src={room.customer.avatar} />
                              )}
                              <AvatarFallback>
                                {room.customer.firstName?.[0]}
                                {room.customer.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {room.customer.firstName}{" "}
                                {room.customer.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                @{room.customer.userName}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <span>Tin nhắn: {room._count?.messages || 0}</span>
                        </div>
                        <Button className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Vào Chat
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
