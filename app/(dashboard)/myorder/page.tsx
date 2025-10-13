/* app/orders/page.tsx */
"use client";

import { useState } from "react";
import Header from "@/components/shared/Header";
import {
  Scissors,
  Home,
  ShoppingBag,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

type Order = {
  id: number;
  category: "Grooming" | "Hotel" | "Products";
  name: string;
  provider?: string;
  date: string;
  status: "Completed";
  price?: string;
};

const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    category: "Grooming",
    name: "Grooming toàn diện - Gói Deluxe",
    provider: "Salon Happy Paws",
    date: "2024-09-01",
    status: "Completed",
    price: "450.000₫",
  },
  {
    id: 2,
    category: "Hotel",
    name: "Lưu trú qua đêm - Phòng Tiêu chuẩn",
    provider: "Khách sạn thú cưng Paradise",
    date: "2024-08-12",
    status: "Completed",
    price: "850.000₫",
  },
  {
    id: 3,
    category: "Products",
    name: "Thức ăn hạt cao cấp cho chó (5kg)",
    date: "2024-07-05",
    status: "Completed",
    price: "550.000₫",
  },
];

const CATEGORIES = [
  {
    id: "Grooming",
    title: "Spa & Grooming",
    desc: "Dịch vụ cắt tỉa, tắm & spa",
    icon: <Scissors className="w-6 h-6" />,
  },
  {
    id: "Hotel",
    title: "Khách sạn thú cưng",
    desc: "Dịch vụ khách sạn & trông giữ",
    icon: <Home className="w-6 h-6" />,
  },
  {
    id: "Products",
    title: "Sản phẩm ",
    desc: "Sản phẩm cho thú cưng",
    icon: <ShoppingBag className="w-6 h-6" />,
  },
];

export default function MyOrder() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const ordersByCategory = (catId: string) =>
    MOCK_ORDERS.filter((o) => o.category === catId);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-poppins-semibold text-foreground mb-2">
          Đơn hàng của tôi
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Chọn 1 mục để xem đơn hàng đã hoàn thành theo từng loại dịch vụ
        </p>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {CATEGORIES.map((cat) => {
            const id = cat.id;
            const selected = selectedCategory === id;
            const count = ordersByCategory(id).length;
            return (
              <button
                key={id}
                onClick={() => setSelectedCategory(selected ? null : id)}
                className={`flex items-center justify-between gap-4 p-5 rounded-2xl shadow-md transition hover:-translate-y-1
                  ${
                    selected
                      ? "bg-card border ring-2 ring-primary/30"
                      : "bg-card hover:bg-pink-50"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">{cat.icon}</div>
                  <div className="text-left">
                    <div className="font-poppins-semibold text-primary">
                      {cat.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {cat.desc}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Tổng số đơn: {count}
                    </div>
                  </div>
                </div>
                <div className="text-muted-foreground">
                  <ChevronRight />
                </div>
              </button>
            );
          })}
        </div>

        {/* Details */}
        <div>
          {!selectedCategory ? (
            <div className="bg-card rounded-2xl shadow p-8 text-center text-muted-foreground">
              Chọn một mục ở trên để xem chi tiết đơn hàng đã hoàn thành.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-poppins-semibold text-primary">
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.title}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {ordersByCategory(selectedCategory).length} đơn
                </span>
              </div>

              <div className="bg-card border rounded-2xl shadow-sm divide-y">
                {ordersByCategory(selectedCategory).map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between px-4 py-4"
                  >
                    {/* Thông tin bên trái */}
                    <div>
                      <div className="font-poppins-medium text-foreground">
                        {o.name}
                      </div>
                      {o.provider && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {o.provider}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Ngày đặt: {o.date}
                      </div>
                    </div>

                    {/* Thông tin bên phải */}
                    <div className="text-right">
                      <div className="text-sm font-poppins-semibold text-foreground">
                        {o.price}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-success text-xs mt-2">
                        <CheckCircle className="w-4 h-4" />
                        Hoàn thành
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
