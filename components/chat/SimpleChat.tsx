"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleChatProps {
  roomId: number;
  currentUserId: number;
  className?: string;
}

/**
 * Component chat đơn giản sử dụng useChat hook
 * Dễ dàng tái sử dụng ở nhiều nơi
 */
export default function SimpleChat({
  roomId,
  currentUserId,
  className,
}: SimpleChatProps) {
  const [inputMessage, setInputMessage] = useState("");

  const {
    messages,
    loading,
    sending,
    isConnected,
    sendMessage,
    messagesEndRef,
  } = useChat({ roomId });

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const success = await sendMessage(inputMessage);
    if (success) {
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Connection Status */}
      <div className="flex justify-end p-2">
        <Badge
          variant={isConnected ? "default" : "destructive"}
          className="text-xs"
        >
          {isConnected ? "● Đã kết nối" : "○ Mất kết nối"}
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Chưa có tin nhắn nào</p>
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

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-3">
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
            onClick={handleSend}
            disabled={!inputMessage.trim() || sending || !isConnected}
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
