"use client";

import React from "react";
import { Modal } from "antd";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import dayjs from "dayjs";
import { Car, CreditCard, ShoppingCart, User } from "lucide-react";
import { Order } from "@/services/orders/getAllOrder/type";

interface ModalViewOrderProps {
  order?: Order;
  open: boolean;
  onClose: () => void;
}

const ModalViewOrder: React.FC<ModalViewOrderProps> = ({
  order,
  open,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={750}
      centered
      className="rounded-xl"
    >
      <div className="space-y-6">
        <div className="text-lg font-bold flex items-center gap-3">
          <Image
            alt="Logo"
            src={Logo}
            className="object-contain"
            width={55}
            height={55}
            style={{ maxHeight: "56px" }}
          />
          <span className="text-pink-600">HappyPaws</span>
        </div>

        <div className="w-[80%] mx-auto h-px bg-gray-300"></div>

        <div className="border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Chi tiết đơn hàng #{order.id}
          </h2>
          <p className="text-sm text-gray-500">
            Ngày tạo: {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
        </div>

        {/* Khách hàng */}
        <div>
          <h3 className="flex gap-2 font-semibold text-gray-700 mb-2">
            <User className="text-pink-500" /> Thông tin khách hàng
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border text-sm space-y-1">
            <p>
              <b>Họ tên:</b> {order.customer.firstName}{" "}
              {order.customer.lastName}
            </p>
            <p>
              <b>Số điện thoại:</b> {order.shipping.toPhone}
            </p>
            <p>
              <b>Địa chỉ:</b> {order.shipping.toAddress}
            </p>
          </div>
        </div>

        {/* Vận chuyển */}
        <div>
          <h3 className="flex gap-2 font-semibold text-gray-700 mb-2">
            <Car className="text-pink-500" /> Thông tin vận chuyển
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border text-sm space-y-1">
            <p>
              <b>Phí vận chuyển:</b>{" "}
              {Number(order.shipping.shippingFee).toLocaleString("vi-VN")} đ
            </p>
            <p>
              <b>Thu hộ COD:</b>{" "}
              {Number(order.shipping.codAmount).toLocaleString("vi-VN")} đ
            </p>
            <p>
              <b>Ghi chú:</b> {order.note || "Không có"}
            </p>
          </div>
        </div>

        {/* Thanh toán */}
        <div>
          <h3 className="flex gap-2 font-semibold text-gray-700 mb-2">
            <CreditCard className="text-pink-500" /> Thanh toán
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border text-sm">
            <p>
              <b>Phương thức:</b> {order.payment.paymentMethod}
            </p>
          </div>
        </div>

        {/* Sản phẩm */}
        <div>
          <h3 className="flex gap-2 font-semibold text-gray-700 mb-2">
            <ShoppingCart className="text-pink-500" /> Sản phẩm
          </h3>
          <div className="bg-gray-50 rounded-lg border text-sm">
            {order.orderDetails.map((item: any, index: number) => (
              <div
                key={item.id}
                className="flex justify-between px-4 py-3 border-b last:border-none"
              >
                <span>
                  {index + 1}. {item.product.name}{" "}
                  <span className="text-gray-500">× {item.quantity}</span>
                </span>
                <span className="font-medium">
                  {Number(item.product.price).toLocaleString("vi-VN")} đ
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right text-lg font-semibold text-pink-600">
          Tổng thanh toán: {Number(order.totalPrice).toLocaleString("vi-VN")} đ
        </div>
      </div>
    </Modal>
  );
};

export default ModalViewOrder;
