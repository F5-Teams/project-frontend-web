import { useEffect, useState, useCallback, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { Message } from "@/services/chat/api";
import { toast } from "sonner";

interface UseChatOptions {
  roomId: number;
  onNewMessage?: (message: Message) => void;
  onError?: (error: Error) => void;
  autoScrollOnNewMessage?: boolean;
}

export function useChat({
  roomId,
  onNewMessage,
  onError,
  autoScrollOnNewMessage = true,
}: UseChatOptions) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (autoScrollOnNewMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [autoScrollOnNewMessage]);

  // Join room
  useEffect(() => {
    if (!socket || !isConnected || !roomId) return;

    setLoading(true);
    console.log(
      `📣 useChat emitting join_room (roomId: ${roomId}) socketId: ${socket.id}`
    );
    socket.emit("join_room", { roomId });

    socket.on("joined_room", () => {
      console.log("✅ Joined room:", roomId);
      setLoading(false);
    });

    socket.on("room_history", (data) => {
      setMessages(data.messages || []);
      setLoading(false);
    });

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      if (onNewMessage) {
        onNewMessage(message);
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      const err = new Error(error.message || "Socket error");
      if (onError) {
        onError(err);
      } else {
        toast.error(error.message);
      }
    });

    return () => {
      socket.emit("leave_room", { roomId });
      socket.off("joined_room");
      socket.off("room_history");
      socket.off("new_message");
      socket.off("error");
    };
  }, [socket, isConnected, roomId, onNewMessage, onError]);

  // Re-emit join_room when socket reconnects
  useEffect(() => {
    if (!socket) return;
    const onConnect = () => {
      if (!roomId) return;
      console.log(
        `🔌 useChat socket reconnected - re-emit join_room: ${roomId}`
      );
      socket.emit("join_room", { roomId });
    };
    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
    };
  }, [socket, roomId]);

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!socket || !content.trim() || sending) {
        return false;
      }

      setSending(true);
      try {
        socket.emit("send_message", {
          roomId,
          content: content.trim(),
        });
        return true;
      } catch (error) {
        console.error("Failed to send message:", error);
        toast.error("Không thể gửi tin nhắn");
        return false;
      } finally {
        setSending(false);
      }
    },
    [socket, roomId, sending]
  );

  return {
    messages,
    loading,
    sending,
    isConnected,
    sendMessage,
    messagesEndRef,
    scrollToBottom,
  };
}
