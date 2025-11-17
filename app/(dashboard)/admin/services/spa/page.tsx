"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import { Service } from "@/components/models/service";
import api from "@/config/axios";
import ServiceForm from "@/components/service/ServiceForm";
import { toast } from "sonner";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách dịch vụ.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success("Đã xóa dịch vụ thành công!");
      fetchServices();
    } catch (err) {
      toast.error("Xóa dịch vụ thất bại!");
      console.error(err);
    }
  };

  const formatPrice = (value: number) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Quản lý dịch vụ
        </h1>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-full bg-gradient-to-r from-pink-300 to-pink-500 hover:opacity-90 text-white px-6 py-2 shadow-md transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm dịch vụ
        </Button>
      </div>

      {/* Form thêm / sửa */}
      {showForm && (
        <ServiceForm
          onClose={() => {
            setShowForm(false);
            fetchServices();
          }}
          editing={editing}
        />
      )}

      {/* Danh sách dịch vụ */}
      {loading ? (
        <p className="text-center text-gray-600">Đang tải...</p>
      ) : services.length === 0 ? (
        <p className="text-center text-gray-500 poppins">
          Chưa có dịch vụ nào được thêm.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-pink-100/50 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={service.images?.[0]?.imageUrl || "/placeholder.png"}
                  alt={service.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  fill
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      service.isActive
                        ? "bg-green-500/90 text-white"
                        : "bg-yellow-500/90 text-white"
                    }`}
                  >
                    {service.isActive ? "Đang hoạt động" : "Tạm dừng"}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-4">
                <h2 className="font-semibold text-xl text-gray-800 mb-2 line-clamp-1">
                  {service.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Price and Duration */}
                <div className="flex items-center justify-between mb-4 border-t border-gray-100 pt-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Giá dịch vụ</span>
                    <span className="text-lg font-semibold text-pink-500">
                      {formatPrice(service.price)} VNĐ
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500">Thời gian</span>
                    <span className="text-sm font-medium text-gray-700">
                      ⏱ {service.duration} phút
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-50 transition-all"
                    onClick={() => {
                      setEditing(service);
                      setShowForm(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Sửa
                  </Button>

                  <Button
                    size="sm"
                    className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-all"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Xóa
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
