"use client";

import { useProductCartStore } from "@/stores/productCart.store";
import { Button, Drawer, Checkbox } from "antd";
import Image from "next/image";
import { Trash2, X } from "lucide-react";
import { ReactNode, useState, useMemo } from "react";
import BuyModal from "./BuyModal";

interface BagDrawerProps {
  children: ReactNode;
}

export function BagDrawer({ children }: BagDrawerProps) {
  const [open, setOpen] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const { items, removeProduct, clearCart } = useProductCartStore();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Tính tổng chỉ dựa trên sản phẩm được chọn
  const selectedTotal = useMemo(
    () =>
      items
        .filter((item) => selectedItems.includes(String(item.productId)))
        .reduce((acc, cur) => acc + cur.price * cur.quantity, 0),
    [items, selectedItems]
  );

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectedProducts = items.filter((item) =>
    selectedItems.includes(String(item.productId))
  );

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      <Drawer
        placement="right"
        width={384}
        open={open}
        onClose={() => setOpen(false)}
        closable={false}
        title={
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#ec4899"
                  fillRule="evenodd"
                  d="M5.174 3h5.652a1.5 1.5 0 0 1 1.49 1.328l.808 7A1.5 1.5 0 0 1 11.634 13H4.366a1.5 1.5 0 0 1-1.49-1.672l.808-7A1.5 1.5 0 0 1 5.174 3m-2.98 1.156A3 3 0 0 1 5.174 1.5h5.652a3 3 0 0 1 2.98 2.656l.808 7a3 3 0 0 1-2.98 3.344H4.366a3 3 0 0 1-2.98-3.344zM5 5.25a.75.75 0 0 1 1.5 0v.25a1.5 1.5 0 1 0 3 0v-.25a.75.75 0 0 1 1.5 0v.25a3 3 0 0 1-6 0z"
                />
              </svg>
              <span className="font-semibold text-sm sm:text-base">
                Giỏ của tôi
              </span>
            </div>
            {items.length > 1 && (
              <button
                onClick={clearCart}
                className="text-white bg-pink-500 px-3 py-1 mr-2 rounded-md hover:bg-pink-600 cursor-pointer"
              >
                Xóa hết
              </button>
            )}
          </div>
        }
        extra={
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        }
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center h-full text-center text-gray-500">
            <p className="font-semibold text-lg mb-1">Giỏ hàng đang trống!</p>
            <p className="text-gray-400">Thêm sản phẩm vào giỏ hàng ngay!</p>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <div className="overflow-y-auto pr-1 max-h-[70vh]">
              {items.map((item) => {
                const isSelected = selectedItems.includes(
                  String(item.productId)
                );
                return (
                  <div
                    key={item.productId}
                    className={`flex items-center justify-between mb-4 border-b pb-3 ${
                      isSelected ? "bg-pink-50 rounded-xl p-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleSelect(String(item.productId))}
                      />
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {item.price.toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>
                    </div>

                    <Button
                      type="text"
                      size="small"
                      onClick={() => removeProduct(item.productId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-7 w-7 flex-shrink-0"
                    >
                      <Trash2 color="red" className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-pink-300 pt-4 mt-4 space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>Đã chọn ({selectedItems.length}):</span>
                <span>{selectedTotal.toLocaleString("vi-VN")} VNĐ</span>
              </div>

              <div className="flex justify-between text-sm font-medium">
                <span>Đặt cọc (10%):</span>
                <span>{(selectedTotal / 10).toLocaleString("vi-VN")} VNĐ</span>
              </div>

              <div className="border-t border-pink-400 my-2" />

              <div className="flex justify-between items-center">
                <span className="font-semibold text-base">Tổng giá:</span>
                <span className="text-green-600 font-bold text-lg">
                  {selectedTotal.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 cursor-pointer rounded-xl border border-pink-500 text-pink-600 font-semibold hover:bg-pink-50 transition"
                >
                  Tiếp tục mua sắm
                </button>

                <button
                  disabled={selectedItems.length === 0}
                  onClick={() => setOpenBuy(true)}
                  className={`flex-1 py-2 cursor-pointer rounded-xl font-semibold transition ${
                    selectedItems.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-pink-500 hover:bg-pink-600 text-white"
                  }`}
                >
                  Mua
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <BuyModal
        isOpen={openBuy}
        isCancel={() => setOpenBuy(false)}
        items={selectedProducts}
        clearCart={clearCart}
      />
    </>
  );
}
