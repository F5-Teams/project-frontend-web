"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatApi } from "@/services/chat/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CustomerConsultation() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const router = useRouter();

  // Lấy room của customer khi component mount
  useEffect(() => {
    const fetchCustomerRoom = async () => {
      // Check if user is logged in
      if (
        typeof window === "undefined" ||
        !localStorage.getItem("accessToken")
      ) {
        return;
      }

      try {
        const rooms = await chatApi.getRooms();
        if (rooms && rooms.length > 0) {
          // Customer chỉ có 1 room
          setRoomId(rooms[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch customer room:", error);
        toast.error("Không thể kết nối với hệ thống chat");
      }
    };

    fetchCustomerRoom();
  }, []);

  const handleCreateSession = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập nội dung yêu cầu tư vấn");
      return;
    }

    if (!roomId) {
      toast.error("Không tìm thấy phòng chat của bạn");
      return;
    }

    setLoading(true);
    try {
      // Tạo session tư vấn
      const session = await chatApi.createSession(roomId, title.trim());

      toast.success("Đã tạo yêu cầu tư vấn thành công!");

      // Chuyển sang trang chat
      router.push(`/chat/${roomId}?sessionId=${session.id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tạo yêu cầu tư vấn";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <CardTitle>Yêu cầu tư vấn</CardTitle>
        </div>
        <CardDescription>
          Nhập nội dung bạn cần tư vấn, đội ngũ staff sẽ hỗ trợ bạn ngay
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Nội dung yêu cầu <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              type="text"
              placeholder="VD: Tư vấn về dịch vụ spa cho chó..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleCreateSession();
                }
              }}
              disabled={loading || !roomId}
              className="w-full"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/200 ký tự
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Lưu ý:</strong> Staff sẽ tham gia tư vấn cho bạn trong
              thời gian sớm nhất. Vui lòng mô tả rõ nhu cầu của bạn để được hỗ
              trợ tốt nhất.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCreateSession}
          disabled={!title.trim() || loading || !roomId}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo yêu cầu...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Tạo yêu cầu tư vấn
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
