"use client";
import { useOrderCustomer } from "@/services/orders/getOrderCustomerId/hooks";
import { OrderCustomer } from "@/services/orders/getOrderCustomerId/type";
import { useGetUser } from "@/services/users/hooks";
import { Button, Modal } from "antd";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import { X } from "lucide-react";
import { useState } from "react";
import { usePostOrderCancel } from "@/services/orders/postOrderCancel/hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const statusLabel = {
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
  APPROVED: "Đã duyệt",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  FAILED: "Thất bại",
  REFUND: "Hoàn tiền",
  REFUND_DONE: "Hoàn tiền",
};

const statusColor = {
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
  const { data: user } = useGetUser();
  const { data: orders } = useOrderCustomer(user?.id);
  const postOrderCancelMutation = usePostOrderCancel();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number>();
  const [status, setStatus] = useState<string>("ALL");

  const filteredOrders =
    status === "ALL"
      ? orders
      : status === "REFUND"
      ? orders?.filter(
          (order) => order.status === "REFUND" || order.status === "REFUND_DONE"
        )
      : orders?.filter((order) => order.status === status);

  return (
    <div className="px-20 py-6 space-y-6">
      <div className="flex gap-16 bg-white w-[85%] m-auto px-10 py-3 justify-center rounded-2xl mb-5">
        {[
          { key: "ALL", label: "Tất cả" },
          { key: "PAID", label: "Đã thanh toán" },

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

      <div className="space-y-10 px-40">
        {filteredOrders?.length ? (
          filteredOrders.map((order: OrderCustomer) => {
            const firstItem = order.orderDetails[0];
            const moreCount = order.orderDetails.length - 1;
            const firstImage =
              firstItem?.product?.images?.[0]?.imageUrl || "/placeholder.png";

            return (
              <div
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <Image
                        src={firstImage}
                        width={80}
                        height={80}
                        className="rounded-xl object-cover"
                        alt={firstItem?.product?.name || "Sản phẩm"}
                      />
                      {moreCount > 0 && (
                        <span className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                          +{moreCount}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">#{order.id}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          statusColor[order.status]
                        }`}
                      >
                        {statusLabel[order.status] || order.status}
                      </span>
                      <p className="font-medium text-gray-800">
                        {firstItem?.product?.name}
                      </p>
                      <p className="text-xs text-gray-500">HappyPaws Store</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-orange-500 font-semibold">
                        {Number(order?.payment?.amount || 0).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        đ
                      </p>
                      <span className="text-gray-400 text-lg">{`>`}</span>
                    </div>

                    {order.status === "PENDING" && (
                      <button
                        onClick={() => {
                          setOpen(true);
                          setId(order.id);
                        }}
                        className="mt-8 py-1 text-[13px] text-white rounded-xl w-full bg-pink-500 hover:bg-pink-600 cursor-pointer font-medium transition px-2"
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>

                {/* <p className="text-gray-600 mt-5 text-sm">
                  Tiền ship:{" "}
                  {Number(order?.shipping?.shippingFee || 0).toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </p> */}
                <div className="h-[0.5px] w-full mt-4 bg-gray-300"></div>
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

      <Modal
        footer={null}
        open={open}
        onCancel={() => setOpen(false)}
        centered
        width={420}
        className="rounded-xl"
      >
        <div className="space-y-5 text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image
              alt="Logo"
              src={Logo}
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="text-pink-600 font-extrabold text-lg tracking-tight">
              HappyPaws
            </span>
          </div>

          <div className="w-[60%] mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

          <div className="flex flex-col items-center justify-center gap-4 mt-2">
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

          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => setOpen(false)}
              className="border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 rounded-md px-5 py-1.5"
            >
              Huỷ
            </Button>
            <Button
              type="primary"
              danger
              loading={postOrderCancelMutation.isPending}
              onClick={() => {
                postOrderCancelMutation.mutate(
                  { id, customerId: user?.id },
                  {
                    onSuccess: () => {
                      toast.success("Hủy đơn hàng thành công!");
                      setOpen(false);
                      queryClient.invalidateQueries(["orderCancel"]);
                    },
                    onError: () => {
                      toast.error("Hủy đơn hàng thất bại!");
                    },
                  }
                );
              }}
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
