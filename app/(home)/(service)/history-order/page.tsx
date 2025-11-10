"use client";
import { useOrderCustomer } from "@/services/orders/getOrderCustomerId/hooks";
import { OrderCustomer } from "@/services/orders/getOrderCustomerId/type";
import { useGetUser } from "@/services/users/hooks";
import { Button, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import { X } from "lucide-react";
import { useState } from "react";
import { usePostOrderCancel } from "@/services/orders/postOrderCancel/hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const statusLabel = {
  PENDING: "Chờ xác nhận",
  CANCELLED: "Đã hủy",
  APPROVED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
};

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  APPROVED: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default function HistoryOrder() {
  const { data: user } = useGetUser();
  const { data: orders } = useOrderCustomer(user?.id);
  const postOrderCancelMutation = usePostOrderCancel();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number>();
  const queryClient = useQueryClient();
  return (
    <div className="px-20 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Đơn hàng của tôi</h1>
      <p className="text-gray-500">Tổng {orders?.length || 0} đơn hàng</p>

      <div className="space-y-10 px-40">
        {orders?.map((order: OrderCustomer) => {
          const firstItem = order.orderDetails[0];
          const moreCount = order.orderDetails.length - 1;
          const firstImage =
            firstItem?.product?.images?.[0]?.imageUrl || "/placeholder.png";
          return (
            <Link
              href={`/history-order/${order.id}`}
              key={order.id}
              className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Image
                    src={firstImage}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover"
                    alt={firstItem.product.name}
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
                    {statusLabel[order.status]}
                  </span>

                  <p className="font-medium text-gray-800">
                    {firstItem.product.name}
                  </p>
                  <p className="text-xs text-gray-500">HappyPaws Store</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <p className="text-orange-500 font-semibold">
                    {(
                      Number(order.totalPrice) +
                      Number(order.shipping.shippingFee)
                    ).toLocaleString("vi-VN")}{" "}
                    đ
                  </p>
                  <span className="text-gray-400 text-lg">{`>`}</span>
                </div>
                {order.status === "PENDING" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(true);
                      setId(order.id);
                    }}
                    className="mt-8 py-1 text-[13px] text-white rounded-xl w-[100%] bg-pink-500 hover:bg-pink-600 cursor-pointer font-medium transition px-2 "
                  >
                    Hủy đơn
                  </button>
                )}
              </div>
            </Link>
          );
        })}
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
              onClick={() => {
                postOrderCancelMutation.mutate(id, {
                  onSuccess: () => {
                    toast.success("Hủy đơn thành công!");
                    setOpen(false);
                    queryClient.invalidateQueries(["orderCancel"]);
                  },
                  onError: () => {
                    toast.error("Hủy đơn thất bại!");
                  },
                });
              }}
              className="rounded-md! px-5! py-1.5! font-mediu!m bg-pink-500! hover:bg-pink-600! transition-all"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
