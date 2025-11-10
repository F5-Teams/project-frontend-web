"use client";

import React from "react";
import { Modal } from "antd";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import dayjs from "dayjs";
import { Car, CreditCard, ShoppingCart, User } from "lucide-react";
import { Order } from "@/services/orders/getAllOrder/type";
import { getImageUrl } from "@/utils/getImageUrl";

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
        {/* Header */}
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

        {/* Order Info */}
        <div className="border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Chi tiết đơn hàng #{order.id}
          </h2>
          <p className="text-sm text-gray-500">
            Ngày tạo: {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
          <p className="text-sm text-gray-500">Trạng thái: {order.status}</p>
        </div>

        {/* Customer Info */}
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
          </div>
        </div>

        {/* Shipping Info */}
        <div>
          <h3 className="flex gap-2 font-semibold text-gray-700 mb-2">
            <Car className="text-pink-500" /> Thông tin vận chuyển
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border text-sm space-y-1">
            <p>
              <b>Địa chỉ:</b> {order.shipping.toAddress},{" "}
              {order.shipping.toWardName}, {order.shipping.toDistrictName},{" "}
              {order.shipping.toProvinceName}
            </p>
            <p>
              <b>Phí vận chuyển:</b>{" "}
              {Number(order.shipping.shippingFee).toLocaleString("vi-VN")} đ
            </p>
            <p>
              <b>Thu hộ COD:</b>{" "}
              {Number(order.shipping.codAmount).toLocaleString("vi-VN")} đ
            </p>
            <p>
              <b>Ghi chú:</b> {order.note || order.shipping.note || "Không có"}
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div>
          <h3 className="flex gap-2 font-semibold text-gray-700 mb-2">
            <CreditCard className="text-pink-500" /> Thanh toán
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border text-sm space-y-1">
            <p>
              <b>Phương thức:</b> {order.payment.paymentMethod}
            </p>
            <p>
              <b>Trạng thái thanh toán:</b> {order.payment.status}
            </p>
            <p>
              <b>Số tiền thanh toán:</b>{" "}
              {Number(order.payment.amount).toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>

        {/* Products */}
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

        {/* Total */}
        <div className="text-right text-lg font-semibold text-pink-600">
          Tổng thanh toán: {Number(order.totalPrice).toLocaleString("vi-VN")} đ
        </div>

        {order.shipping.deliveryProofImage && (
          <img
            src={getImageUrl(order.shipping.deliveryProofImage)}
            alt="Delivery Proof"
            className="w-full max-h-[350px] object-contain rounded-md"
          />
        )}
      </div>
    </Modal>
  );
};

export default ModalViewOrder;
