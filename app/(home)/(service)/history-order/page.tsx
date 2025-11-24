/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import { Button, Modal } from "antd";
import { Eye, X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import Logo from "@/public/logo/HappyPaws Logo.svg";
import BuyModal from "@/components/shopping/BuyModal";

// Store + API hooks
import { useOrderCustomer } from "@/services/orders/getOrderCustomerId/hooks";
import { OrderCustomer } from "@/services/orders/getOrderCustomerId/type";
import { useGetUser } from "@/services/users/hooks";
import { usePostOrderCancel } from "@/services/orders/postOrderCancel/hooks";
import { useProductCartStore } from "@/stores/productCart.store";
import { usePostRegenerateOrder } from "@/services/orders/regenerateOrder/hook";

/* --------------------------------------------------
 🏷️ Status mapping: label + color  
-------------------------------------------------- */
const statusLabel = {
  ON_PROGRESSING: "Chờ thanh toán",
  PAID: "Đang chờ duyệt",
  CANCELLED: "Đã hủy",
  APPROVED: "Đã duyệt",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  FAILED: "Thất bại",
  REFUND: "Hoàn tiền",
  REFUND_DONE: "Hoàn tiền",
};

const statusColor = {
  ON_PROGRESSING: "bg-pink-100 text-pink-700",
  PAID: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  APPROVED: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  FAILED: "bg-orange-100 text-orange-700",
  REFUND: "bg-orange-100 text-orange-700",
  REFUND_DONE: "bg-orange-100 text-orange-700",
};

export default function HistoryOrder() {
  /* --------------------------------------------------
    Lấy dữ liệu User + Orders
  -------------------------------------------------- */
  const { data: user } = useGetUser();
  const { data: orders } = useOrderCustomer(user?.id);

  /* --------------------------------------------------
    React state
  -------------------------------------------------- */
  const [status, setStatus] = useState<string>("ALL"); // Tab filter
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>();

  const [openBuy, setOpenBuy] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderCustomer>();

  const clearCart = useProductCartStore((s) => s.clearCart);

  const queryClient = useQueryClient();
  const router = useRouter();
  const cancelMutation = usePostOrderCancel();
  const { mutate: postRegenerateOrder } = usePostRegenerateOrder();

  /* --------------------------------------------------
    Filter đơn hàng theo trạng thái
  -------------------------------------------------- */
  const filteredOrders =
    status === "ALL"
      ? orders
      : status === "REFUND"
      ? orders?.filter(
          (o) => o.status === "REFUND" || o.status === "REFUND_DONE"
        )
      : orders?.filter((o) => o.status === status);

  /* --------------------------------------------------
    Handler: mở modal thanh toán lại
  -------------------------------------------------- */
  const handleRePay = (order: OrderCustomer) => {
    setSelectedOrder(order);
    setSelectedOrderId(order.id);
    setOpenBuy(true);
  };

  /* --------------------------------------------------
    Handler: mở modal hủy đơn
  -------------------------------------------------- */
  const handleCancelOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenCancelModal(true);
  };

  const handleRegeneratePayment = (orderId: number) => {
    postRegenerateOrder(orderId, {
      onSuccess: (data) => {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          toast.error("Không tìm thấy đường dẫn thanh toán.");
        }
      },
      onError: () => {
        toast.error("Tạo lại đường dẫn thanh toán thất bại.");
      },
    });
  };

  /* Gửi request HỦY đơn hàng*/
  const confirmCancelOrder = () => {
    if (!selectedOrderId || !user?.id) {
      toast.error("Không có đơn hàng để hủy.");
      return;
    }

    cancelMutation.mutate(
      { id: selectedOrderId, customerId: user.id },
      {
        onSuccess: () => {
          toast.success("Hủy đơn hàng thành công!");
          setOpenCancelModal(false);

          // Refresh lại danh sách đơn
          queryClient.invalidateQueries(["orderCancel"] as any);
          queryClient.invalidateQueries(["orderCustomer"] as any);
        },
        onError: () => toast.error("Hủy đơn hàng thất bại!"),
      }
    );
  };

  return (
    <div className="px-20 py-6 space-y-6">
      {/* Thanh chọn trạng thái (Filter)*/}
      <div className="flex gap-16 bg-white w-[85%] m-auto px-10 py-3 justify-center rounded-2xl mb-5">
        {[
          { key: "ALL", label: "Tất cả" },
          { key: "ON_PROGRESSING", label: "Chờ thanh toán" },
          { key: "PAID", label: "Đang chờ duyệt" },
          { key: "APPROVED", label: "Đã duyệt" },
          { key: "SHIPPING", label: "Vận chuyển" },
          { key: "COMPLETED", label: "Hoàn thành" },
          { key: "CANCELLED", label: "Đã hủy" },
          { key: "REFUND", label: "Trả hàng/hoàn tiền" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatus(item.key)}
            className={`cursor-pointer hover:text-pink-500 transition-colors ${
              status === item.key ? "text-pink-500 font-semibold" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng*/}
      <div className="space-y-10 px-40">
        {filteredOrders?.length ? (
          filteredOrders.map((order: OrderCustomer) => {
            const firstItem = order.orderDetails[0];
            const moreCount = order.orderDetails.length - 1;

            return (
              <div
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Thông tin sản phẩm */}
                  <div className="flex items-center gap-5">
                    {/* Ảnh sản phẩm + badge số lượng */}
                    <div className="relative">
                      <Image
                        src={
                          firstItem?.product?.images?.[0]?.imageUrl ||
                          "/placeholder.png"
                        }
                        width={80}
                        height={80}
                        className="rounded-xl object-cover"
                        alt={firstItem?.product?.name || "Sản phẩm"}
                      />

                      {moreCount > 0 && (
                        <span className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-xs px-2 rounded-full">
                          +{moreCount}
                        </span>
                      )}
                    </div>

                    {/* Thông tin đơn */}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">#{order.id}</p>

                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          statusColor[order.status as keyof typeof statusColor]
                        }`}
                      >
                        {statusLabel[order.status as keyof typeof statusLabel]}
                      </span>

                      <p className="font-medium text-gray-800">
                        {firstItem?.product?.name}
                      </p>

                      <p className="text-gray-500 text-sm">
                        Ngày tạo:{" "}
                        {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </div>
                  </div>

                  {/* Nút thao tác */}
                  <div>
                    {/* Tổng tiền */}
                    <div className="flex items-center gap-3">
                      <p className="text-orange-500 font-semibold">
                        {Number(order?.payment?.amount || 0).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        đ
                      </p>
                      <span className="text-gray-400 text-lg">{">"}</span>
                    </div>

                    {/* Xem chi tiết */}
                    <button
                      className="flex gap-2 items-center px-2 mt-2 py-1 text-[13px] text-white rounded-xl w-full bg-blue-400 hover:bg-blue-600 transition"
                      onClick={() => router.push(`/history-order/${order.id}`)}
                    >
                      <Eye size={16} />
                      Xem chi tiết
                    </button>

                    {/* Hủy đơn  */}
                    {order.status === "PAID" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="mt-2 py-1 text-[13px] text-white rounded-xl w-full bg-pink-500 hover:bg-pink-600 transition"
                      >
                        Hủy đơn
                      </button>
                    )}

                    {/* Thanh toán lại (ON_PROGRESSING) */}
                    {order.status === "ON_PROGRESSING" && (
                      <button
                        onClick={() => handleRegeneratePayment(order.id)}
                        className="mt-2 py-1 text-[13px] text-white rounded-xl w-full bg-pink-500 hover:bg-pink-600 transition"
                      >
                        Thanh toán lại
                      </button>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[0.5px] w-full mt-4 bg-gray-300"></div>

                {/* Tổng cộng */}
                <div className="flex justify-between mt-5 font-medium">
                  <p>Tổng cộng:</p>
                  <p className="text-green-600">
                    {Number(order?.payment?.amount || 0).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    đ
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Không có đơn hàng nào
          </p>
        )}
      </div>

      {/*Modal thanh toán lại */}
      <BuyModal
        isOpen={openBuy}
        isCancel={() => setOpenBuy(false)}
        items={
          selectedOrder
            ? selectedOrder.orderDetails.map((od) => ({
                productId: od.product?.id ?? od.productId,
                name: od.product?.name ?? "Sản phẩm",
                price: Number((od as any).price ?? od.product?.price ?? 0),
                quantity: od.quantity,
                weight: od.product?.weight ?? "0",
                imageUrl: od.product?.images?.[0]?.imageUrl || "",
              }))
            : []
        }
        clearCart={clearCart}
      />

      {/* Modal xác nhận hủy đơn*/}
      <Modal
        footer={null}
        open={openCancelModal}
        onCancel={() => setOpenCancelModal(false)}
        centered
        width={420}
        className="rounded-xl"
      >
        <div className="space-y-5 text-center py-4">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image alt="Logo" src={Logo} width={48} height={48} />
            <span className="text-pink-600 font-extrabold text-lg">
              HappyPaws
            </span>
          </div>

          <div className="w-[60%] mx-auto h-[1px] bg-gray-300"></div>

          {/* Icon + Text */}
          <div className="flex flex-col items-center gap-4 mt-2">
            <div className="bg-red-50 p-3 rounded-full border border-red-100">
              <X className="w-8 h-8 text-red-500" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Xác nhận hủy đơn hàng?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Hành động này{" "}
                <span className="font-medium text-red-500">
                  không thể hoàn tác
                </span>{" "}
                sau khi xác nhận.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => setOpenCancelModal(false)}
              className="border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 rounded-md px-5 py-1.5"
            >
              Huỷ
            </Button>

            <Button
              type="primary"
              danger
              loading={cancelMutation.isPending}
              onClick={confirmCancelOrder}
              className="rounded-md px-5 py-1.5 font-medium bg-pink-500 hover:bg-pink-600 transition-all"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
