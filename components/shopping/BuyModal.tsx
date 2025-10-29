import { Modal, Radio } from "antd";
import React, { useState } from "react";

interface CartItem {
  productId: number;
  price: number;
  imageUrl?: string;
  name: string;
  quantity: number;
}

interface DataProps {
  isOpen: boolean;
  isCancel: () => void;
  items: CartItem[];
}

const BuyModal = ({ isOpen, isCancel, items }: DataProps) => {
  const [selectedBank, setSelectedBank] = useState<string>("");

  // Tính tổng tiền
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Modal
      open={isOpen}
      onCancel={isCancel}
      footer={null}
      width={600}
      title={<span className="font-semibold text-lg">🛒 Order Summary</span>}
    >
      {/* Danh sách sản phẩm */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border rounded-lg p-2 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="text-left">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {item.price.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
            <div className="font-semibold text-pink-600">
              {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
            </div>
          </div>
        ))}
      </div>

      {/* Tổng cộng */}
      <div className="border-t mt-4 pt-3">
        <div className="flex justify-between text-sm font-medium">
          <span>Items ({items.length}):</span>
          <span>{total.toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className="flex justify-between text-sm font-medium mt-1">
          <span>Total Deposit:</span>
          <span>{(total / 2).toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className="border-t border-gray-200 my-2" />
        <div className="flex justify-between items-center">
          <span className="font-semibold text-base">Total:</span>
          <span className="text-green-600 font-bold text-lg">
            {total.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>
      </div>

      {/* Chọn ngân hàng */}
      <div className="mt-5">
        <p className="font-semibold mb-2">Chọn ngân hàng thanh toán:</p>
        <Radio.Group
          onChange={(e) => setSelectedBank(e.target.value)}
          value={selectedBank}
          className="flex flex-wrap gap-3"
        >
          <Radio.Button value="VCB">Vietcombank</Radio.Button>
          <Radio.Button value="ACB">ACB</Radio.Button>
          <Radio.Button value="TPB">TPBank</Radio.Button>
          <Radio.Button value="MBB">MB Bank</Radio.Button>
          <Radio.Button value="VPB">VPBank</Radio.Button>
        </Radio.Group>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={isCancel}
          className="flex-1 py-2 rounded-xl border border-pink-500 text-pink-600 font-semibold hover:bg-pink-50 transition"
        >
          Hủy
        </button>

        <button
          disabled={!selectedBank}
          className={`flex-1 py-2 rounded-xl font-semibold transition ${
            selectedBank
              ? "bg-pink-500 hover:bg-pink-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Thanh toán
        </button>
      </div>
    </Modal>
  );
};

export default BuyModal;
