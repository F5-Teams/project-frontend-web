"use client";

import React from "react";
import { Modal, Button } from "antd";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import { Trash2 } from "lucide-react";

interface ModalDeleteOrderProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ModalDeleteOrder: React.FC<ModalDeleteOrderProps> = ({
  open,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={420}
      maskClosable={!loading}
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
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Xác nhận xoá đơn hàng?
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
            onClick={onCancel}
            disabled={loading}
            className="!border-gray-300 !text-gray-700 hover:!border-gray-400 hover:!text-gray-900 rounded-md px-5 py-1.5"
          >
            Huỷ
          </Button>
          <Button
            type="primary"
            danger
            loading={loading}
            onClick={onConfirm}
            className="rounded-md px-5 py-1.5 font-medium bg-red-500 hover:!bg-red-600 transition-all"
          >
            Xoá
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeleteOrder;
