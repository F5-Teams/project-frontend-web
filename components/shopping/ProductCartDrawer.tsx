"use client";

import { Drawer } from "antd";
import { useProductCartDrawer } from "@/stores/productCartDrawer.store";
import { useProductCartStore } from "@/stores/productCart.store";

export default function ProductCartDrawer() {
  const { isOpen, close } = useProductCartDrawer();
  const items = useProductCartStore((state) => state.items);

  return (
    <Drawer
      title={`Product Cart (${items.length})`}
      open={isOpen}
      onClose={close}
      placement="right"
      width={420}
      styles={{
        body: { padding: 0 },
      }}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M3 3h2l3.6 7.59a1 1 0 0 0 .9.55H17a1 1 0 0 1 0 2H9.5"
            />
          </svg>
          <p className="text-lg font-medium mt-4">Your product cart is empty</p>
          <p className="text-sm text-gray-400 mt-1">
            Add some products to continue!
          </p>
        </div>
      ) : (
        <div className="max-h-[calc(100vh-140px)] overflow-auto p-4 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-3 border-b pb-4">
              <img
                src={item.imageUrl}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} x {item.price.toLocaleString()}₫
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}
