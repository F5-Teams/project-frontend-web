"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { chatApi, Session } from "@/services/chat/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  User,
  Clock,
  Loader2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";

export default function StaffInProgressList() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const data = await chatApi.getInProgressSessions();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching in-progress sessions:", error);
      toast.error("Không thể tải danh sách phiên chat");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    // Auto refresh mỗi 15 giây
    const interval = setInterval(() => {
      fetchSessions(false);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinChat = (session: Session) => {
    router.push(`/staff/chat/${session.roomId}?sessionId=${session.id}`);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-semibold text-gray-900 dark:text-white">
            Phiên chat đang xử lý
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sessions.length} phiên chat đang hoạt động
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchSessions(false)}
          disabled={refreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Chưa có phiên chat nào đang xử lý
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Các phiên chat bạn đang tư vấn sẽ hiển thị ở đây
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handleJoinChat(session)}
            >
              {/* Header với gradient background */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-3 border-white ring-2 ring-green-300">
                      <AvatarFallback className="bg-white text-green-700 font-semibold text-base">
                        {getInitials(
                          session.customer.firstName,
                          session.customer.lastName
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-poppins font-semibold text-base text-white">
                        {session.customer.firstName} {session.customer.lastName}
                      </p>
                      <p className="font-poppins text-xs text-green-100 flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />@{session.customer.userName}
                      </p>
                    </div>
                  </div>
                  <Badge className="font-poppins bg-white/90 text-green-700 font-medium text-xs border-0 shadow-sm">
                    Đang xử lý
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Title */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="font-poppins text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-relaxed">
                    {session.title}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="space-y-2">
                  {/* Staff Info */}
                  {session.staff && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      <span className="font-poppins font-normal">
                        Phụ trách: {session.staff.firstName}{" "}
                        {session.staff.lastName}
                      </span>
                    </div>
                  )}

                  {/* Time */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-md">
                    <Clock className="h-3.5 w-3.5 text-orange-600" />
                    <span className="font-poppins font-normal">
                      Bắt đầu{" "}
                      {formatDistanceToNow(new Date(session.startedAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="font-poppins w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinChat(session);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Vào chat ngay
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
