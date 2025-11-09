"use client";
import { useOrderCustomer } from "@/services/orders/getOrderCustomerId/hooks";
import { OrderCustomer } from "@/services/orders/getOrderCustomerId/type";
import { useGetUser } from "@/services/users/hooks";
import {
  Truck,
  ClipboardCheck,
  PackageCheck,
  Clock,
  ArrowLeftToLine,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const statusSteps = [
  { key: "PENDING", label: "Chờ xác nhận", icon: Clock },
  { key: "APPROVED", label: "Đã xác nhận", icon: ClipboardCheck },
  { key: "SHIPPING", label: "Đang giao hàng", icon: Truck },
  { key: "DELIVERED", label: "Hoàn thành", icon: PackageCheck },
];

export default function OrderDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: user } = useGetUser();
  const { data: orders } = useOrderCustomer(user?.id);

  const filter = orders?.find((item) => item.id === id);
  const order = filter;
  console.log("OO", filter);
  console.log("id", id);

  if (!order)
    return (
      <p className="text-center p-10 text-gray-500">Đang tải đơn hàng...</p>
    );

  const currentStep = statusSteps.findIndex((s) => s.key === order?.status);

  return (
    <>
      <div className="px-20  py-5 flex gap-2 items-center">
        <ArrowLeftToLine size={20} />
        <Link className="hover:underline" href={"/history-order"}>
          Quay lại
        </Link>
      </div>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-medium mb-1">Theo dõi đơn hàng</h1>
        <p className="text-gray-500">Mã đơn: #{order.id}</p>

        <div className="flex justify-between bg-white p-5 rounded-2xl shadow-sm relative">
          <div className="absolute top-1/2 left-12 right-12 h-1 bg-gray-300 -z-10"></div>

          <div
            className="absolute top-1/2 left-12 h-1 bg-pink-500 transition-all -z-10"
            style={{
              width: `${currentStep * (100 / (statusSteps.length - 1))}%`,
            }}
          ></div>

          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const active = index <= currentStep;
            return (
              <div
                key={step.key}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-full text-white shadow-md transition-all
                ${active ? "bg-pink-500" : "bg-gray-300"}`}
                >
                  <Icon size={26} />
                </div>
                <p className="text-sm mt-2">{step.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="font-medium text-lg mb-2">Sản phẩm</p>

          {order.orderDetails.map((d) => {
            const img = d.product.images?.[0]?.imageUrl || "/placeholder.png";

            return (
              <div
                key={d.id}
                className="flex justify-between items-center py-4 border-b last:border-none"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={img}
                    width={60}
                    height={60}
                    className="rounded-xl object-cover"
                    alt={d.product.name}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {d.product.name}
                    </span>
                    <span className="text-gray-500 text-sm">x{d.quantity}</span>
                  </div>
                </div>

                <span className="text-pink-500 font-semibold">
                  {Number(d.product.price).toLocaleString()} đ
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="font-medium text-lg mb-1">Thông tin giao hàng</p>
          <p>{order.shipping.toName}</p>
          <p className="text-gray-600 text-sm">
            Số điện thoại: {order.shipping.toPhone}
          </p>
          <p className="text-gray-600 text-sm">{order.shipping.toAddress}</p>
        </div>
      </div>
    </>
  );
}
