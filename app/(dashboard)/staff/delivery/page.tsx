"use client";

import { useGetProvince } from "@/services/delivery/getProvince/hooks";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Loader2,
  AlertCircle,
  Search,
  MapPinHouse,
} from "lucide-react";

const DeliveryPage = () => {
  const { data: provinces, isLoading, error } = useGetProvince();
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        <span>Đang tải danh sách tỉnh...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>Lỗi khi tải dữ liệu!</span>
      </div>
    );

  const filteredProvinces = provinces?.filter((p) =>
    p.ProvinceName.toLowerCase().includes(search.toLowerCase())
  );

  const selected =
    provinces?.find((p) => p.ProvinceID === selectedProvince) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <MapPin className="w-7 h-7 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Theo dõi đơn hàng
        </h1>
      </div>
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="">
            <label className="block flex gap-2 text-gray-700 mb-2 font-medium">
              <Search /> Tìm kiếm tỉnh / thành
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập tên tỉnh/thành..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block flex gap-1.5 text-gray-700 mb-2 font-medium">
              <MapPinHouse /> Chọn tỉnh / thành phố
            </label>
            <select
              onChange={(e) => setSelectedProvince(Number(e.target.value))}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              defaultValue=""
            >
              <option value="" disabled>
                -- Chọn tỉnh / thành phố --
              </option>
              {filteredProvinces?.map((province) => (
                <option key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.ProvinceID}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 rounded-2xl p-6 shadow-inner"
            >
              <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Thông tin chi tiết
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700">
                <div>
                  <p className="font-medium">Mã tỉnh:</p>
                  <p>{selected.ProvinceID}</p>
                </div>
                <div>
                  <p className="font-medium">Mã code:</p>
                  <p>{selected.Code}</p>
                </div>
                <div>
                  <p className="font-medium">Region ID:</p>
                  <p>{selected.RegionID}</p>
                </div>
                <div>
                  <p className="font-medium">Region CPN:</p>
                  <p>{selected.RegionCPN}</p>
                </div>
                <div>
                  <p className="font-medium">Trạng thái:</p>
                  <p
                    className={`font-semibold ${
                      selected.Status === 1 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {selected.Status === 1 ? "Hoạt động" : "Không hoạt động"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Cập nhật bởi:</p>
                  <p>{selected.UpdatedEmployee ?? "—"}</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="font-medium mb-2">Tên mở rộng:</p>
                <div className="flex flex-wrap gap-2">
                  {selected.NameExtension.map((name, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-gray-700 text-sm border border-gray-300 px-3 py-1 rounded-full shadow-sm hover:bg-blue-100 transition"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeliveryPage;
