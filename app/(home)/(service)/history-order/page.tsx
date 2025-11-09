"use client";
import { useOrderCustomer } from "@/services/orders/getOrderCustomerId/hooks";
import { OrderCustomer } from "@/services/orders/getOrderCustomerId/type";
import { useGetUser } from "@/services/users/hooks";
import Image from "next/image";
import Link from "next/link";

const statusLabel = {
  PENDING: "Chờ xác nhận",
  APPROVED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
};

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default function HistoryOrder() {
  const { data: user } = useGetUser();
  const { data: orders } = useOrderCustomer(user?.id);

  // const total =
  //   Number(orders?.totalPrice) + Number(orders?.shipping.shippingFee);

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
              {/* LEFT */}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
