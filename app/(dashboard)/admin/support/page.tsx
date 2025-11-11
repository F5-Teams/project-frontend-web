"use client";

import { useEffect, useState } from "react";
import {
  withdrawalService,
  WithdrawalRequest,
} from "@/services/wallets/withdrawal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  User,
  DollarSign,
  Calendar,
  Building2,
  CreditCard,
} from "lucide-react";

export default function CustomerSupportPage() {
  const [pendingRequests, setPendingRequests] = useState<WithdrawalRequest[]>(
    []
  );
  const [transferredRequests, setTransferredRequests] = useState<
    WithdrawalRequest[]
  >([]);
  const [failedRequests, setFailedRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawalRequest | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<"TRANSFERRED" | "FAILED" | null>(
    null
  );
  const [adminNote, setAdminNote] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const fetchWithdrawalRequests = async () => {
    try {
      setLoading(true);
      const [pending, transferred, failed] = await Promise.all([
        withdrawalService.getWithdrawalRequests("PENDING"),
        withdrawalService.getWithdrawalRequests("TRANSFERRED"),
        withdrawalService.getWithdrawalRequests("FAILED"),
      ]);
      setPendingRequests(pending);
      setTransferredRequests(transferred);
      setFailedRequests(failed);
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      toast.error("Không thể tải danh sách yêu cầu rút tiền");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setShowDetailDialog(true);
  };

  const handleActionClick = (type: "TRANSFERRED" | "FAILED") => {
    setActionType(type);
    setShowDetailDialog(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      setProcessing(true);
      await withdrawalService.updateWithdrawalStatus(selectedRequest.id, {
        status: actionType,
        adminNote: adminNote.trim() || undefined,
      });

      toast.success(
        actionType === "TRANSFERRED"
          ? "Đã duyệt yêu cầu rút tiền thành công"
          : "Đã từ chối yêu cầu rút tiền"
      );

      // Refresh the list
      fetchWithdrawalRequests();

      // Reset state
      setShowConfirmDialog(false);
      setSelectedRequest(null);
      setActionType(null);
      setAdminNote("");
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-full mx-auto">
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200 max-w-7xl mx-auto">
          <h1 className="text-3xl font-poppins-regular text-gray-900">
            Hỗ trợ khách hàng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý các yêu cầu rút tiền từ khách hàng
          </p>
        </div>

        {/* PENDING Section */}
        <div className="mb-12">
          <div className="max-w-7xl mx-auto mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Chờ xử lý</h2>
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-2 border-yellow-600 font-semibold px-3 py-1">
                {pendingRequests.length}
              </Badge>
            </div>
          </div>
          {pendingRequests.length === 0 ? (
            <div className="max-w-7xl mx-auto">
              <Card className="bg-white shadow-sm">
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-gray-500">
                    Không có yêu cầu nào đang chờ xử lý
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 px-4 min-h-[450px] flex items-center">
              <div className="flex gap-4 min-w-max">
                {pendingRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400 bg-white overflow-hidden w-80 flex-shrink-0"
                    onClick={() => handleCardClick(request)}
                  >
                    <CardHeader className="py-4 px-5 bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-50 border-b-2 border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="bg-yellow-500 p-2 rounded-full">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <CardTitle className="text-lg text-gray-900 font-bold m-0">
                            ID: #{request.customerId}
                          </CardTitle>
                        </div>
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-2 border-yellow-600 font-semibold px-3 py-1 shadow-md">
                          PENDING
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 pb-5 bg-white space-y-3">
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg border border-pink-200">
                        <div className="flex items-start gap-2">
                          <User className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                              Người dùng:
                            </p>
                            <p className="font-bold text-gray-900 text-base truncate">
                              {request.customer.firstName}{" "}
                              {request.customer.lastName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-start gap-2">
                          <div className="bg-green-500 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                              Số tiền rút:
                            </p>
                            <p className="font-bold text-green-600 text-lg">
                              {formatCurrency(request.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                              Ngày gửi đơn:
                            </p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {new Date(request.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TRANSFERRED Section */}
        <div className="mb-12">
          <div className="max-w-7xl mx-auto mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Đã chuyển tiền
              </h2>
              <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white border-2 border-green-600 font-semibold px-3 py-1">
                {transferredRequests.length}
              </Badge>
            </div>
          </div>
          {transferredRequests.length === 0 ? (
            <div className="max-w-7xl mx-auto">
              <Card className="bg-white shadow-sm">
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-gray-500">
                    Không có yêu cầu nào đã được chuyển tiền
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 px-4 min-h-[450px] flex items-center">
              <div className="flex gap-4 min-w-max">
                {transferredRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-green-200 hover:border-green-400 bg-white overflow-hidden w-80 flex-shrink-0"
                    onClick={() => handleCardClick(request)}
                  >
                    <CardHeader className="py-4 px-5 bg-gradient-to-br from-green-100 via-green-50 to-green-50 border-b-2 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="bg-green-500 p-2 rounded-full">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <CardTitle className="text-lg text-gray-900 font-bold m-0">
                            ID: #{request.customerId}
                          </CardTitle>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white border-2 border-green-600 font-semibold px-3 py-1 shadow-md">
                          TRANSFERRED
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 pb-5 bg-white space-y-3">
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg border border-pink-200">
                        <div className="flex items-start gap-2">
                          <User className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                              Người dùng:
                            </p>
                            <p className="font-bold text-gray-900 text-base truncate">
                              {request.customer.firstName}{" "}
                              {request.customer.lastName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-start gap-2">
                          <div className="bg-green-500 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                              Số tiền rút:
                            </p>
                            <p className="font-bold text-green-600 text-lg">
                              {formatCurrency(request.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                              Ngày gửi đơn:
                            </p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {new Date(request.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAILED Section */}
        <div className="mb-12">
          <div className="max-w-7xl mx-auto mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Thất bại</h2>
              <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white border-2 border-red-600 font-semibold px-3 py-1">
                {failedRequests.length}
              </Badge>
            </div>
          </div>
          {failedRequests.length === 0 ? (
            <div className="max-w-7xl mx-auto">
              <Card className="bg-white shadow-sm">
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-gray-500">Không có yêu cầu nào thất bại</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="overflow-x-auto px-4 min-h-[450px] flex items-center">
              <div className="flex gap-4 min-w-max">
                {failedRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-red-200 hover:border-red-400 bg-white overflow-hidden w-80 flex-shrink-0"
                    onClick={() => handleCardClick(request)}
                  >
                    <CardHeader className="py-4 px-5 bg-gradient-to-br from-red-100 via-red-50 to-red-50 border-b-2 border-red-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="bg-red-500 p-2 rounded-full">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <CardTitle className="text-lg text-gray-900 font-bold m-0">
                            ID: #{request.customerId}
                          </CardTitle>
                        </div>
                        <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white border-2 border-red-600 font-semibold px-3 py-1 shadow-md">
                          FAILED
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 pb-5 bg-white space-y-3">
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg border border-pink-200">
                        <div className="flex items-start gap-2">
                          <User className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                              Người dùng:
                            </p>
                            <p className="font-bold text-gray-900 text-base truncate">
                              {request.customer.firstName}{" "}
                              {request.customer.lastName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-start gap-2">
                          <div className="bg-green-500 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                              Số tiền rút:
                            </p>
                            <p className="font-bold text-green-600 text-lg">
                              {formatCurrency(request.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                              Ngày gửi đơn:
                            </p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {new Date(request.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader className="bg-white">
            <DialogTitle className="text-gray-900">
              Chi tiết yêu cầu rút tiền
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Thông tin chi tiết về yêu cầu rút tiền từ khách hàng
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600 font-medium">
                    ID Yêu cầu
                  </Label>
                  <p className="font-semibold text-gray-900">
                    #{selectedRequest.id}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600 font-medium">
                    Trạng thái
                  </Label>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 border border-yellow-200"
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <User className="w-5 h-5 text-pink-500" />
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">
                      ID Khách hàng
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {selectedRequest.customerId}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">
                      Tên khách hàng
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {selectedRequest.customer.firstName}{" "}
                      {selectedRequest.customer.lastName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">
                      Username
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {selectedRequest.customer.userName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  Thông tin ngân hàng
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">
                      Tên ngân hàng
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {selectedRequest.bankName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">
                      Số tài khoản
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {selectedRequest.bankNumber}
                    </p>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-gray-600 font-medium">
                      Chủ tài khoản
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {selectedRequest.bankUserName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  Thông tin giao dịch
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">
                      Số tiền rút
                    </Label>
                    <p className="font-bold text-green-600 text-xl">
                      {formatCurrency(selectedRequest.amount)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">
                      Ngày tạo
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedRequest.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 bg-white border-t border-gray-200 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDetailDialog(false)}
              className="bg-white hover:bg-gray-100"
            >
              Đóng
            </Button>
            {selectedRequest?.status === "PENDING" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleActionClick("FAILED")}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Từ chối
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleActionClick("TRANSFERRED")}
                >
                  Xác nhận
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-white">
          <DialogHeader className="bg-white">
            <DialogTitle className="text-gray-900">
              {actionType === "TRANSFERRED"
                ? "Xác nhận chuyển tiền"
                : "Xác nhận từ chối"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {actionType === "TRANSFERRED"
                ? "Bạn có chắc chắn muốn duyệt và chuyển tiền cho yêu cầu này?"
                : "Bạn có chắc chắn muốn từ chối yêu cầu rút tiền này?"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 bg-white">
            <div className="space-y-2">
              <Label htmlFor="admin-note" className="text-gray-700 font-medium">
                Ghi chú{" "}
                {actionType === "FAILED" && (
                  <span className="text-red-500">(bắt buộc)</span>
                )}
              </Label>
              <Textarea
                id="admin-note"
                placeholder={
                  actionType === "TRANSFERRED"
                    ? "Nhập ghi chú (không bắt buộc)..."
                    : "Vui lòng nhập lý do từ chối..."
                }
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={4}
                className="bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-500 text-gray-900"
              />
            </div>
          </div>

          <DialogFooter className="bg-white border-t border-gray-200 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setShowDetailDialog(true);
                setAdminNote("");
              }}
              disabled={processing}
              className="bg-white hover:bg-gray-100"
            >
              Quay lại
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={
                processing || (actionType === "FAILED" && !adminNote.trim())
              }
              className={
                actionType === "TRANSFERRED"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : actionType === "TRANSFERRED" ? (
                "Xác nhận chuyển tiền"
              ) : (
                "Xác nhận từ chối"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
