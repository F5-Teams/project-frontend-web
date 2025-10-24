/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import api from "@/config/axios";
import { User } from "@/components/models/register";
import { UserRound, Phone, MapPin, Search, VenusAndMars } from "lucide-react";

export default function Customers() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formError, setFormError] = useState<string>("");

  const perPage = 5;

  const fullName = (u: User) =>
    `${(u.firstName || "").trim()} ${(u.lastName || "").trim()}`.trim() ||
    u.userName ||
    `#${u.id}`;

  const initials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase() || "U";
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<User[]>("/user/all");
      setData(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tải người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((u) => {
      const name = fullName(u).toLowerCase();
      const username = (u.userName || "").toLowerCase();
      return (
        name.includes(search.toLowerCase()) ||
        username.includes(search.toLowerCase())
      );
    });
  }, [data, search]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  if (loading)
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-6 text-sm text-muted-foreground">
        Đang tải người dùng…
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-6 text-sm text-red-600">
        {error}
      </div>
    );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-gray-800">
          Danh sách người dùng
        </h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 text-sm rounded-full pl-9 pr-4 py-2.5 
                       focus:outline-none focus:ring-2 focus:ring-pink-400 w-64"
            />
          </div>
        </div>
      </div>

      {/* Banner lỗi từ server (nếu có) */}
      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm font-medium border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">
                <UserRound className="inline-block w-4 h-4 mr-2 text-pink-500" />
                Họ và tên
              </th>
              <th className="px-6 py-3 text-left font-semibold">
                <Phone className="inline-block w-4 h-4 mr-2 text-pink-500" />
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left font-semibold">
                <MapPin className="inline-block w-4 h-4 mr-2 text-pink-500" />
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left font-semibold">
                <VenusAndMars className="inline-block w-4 h-4 mr-2 text-pink-500" />
                Giới tính
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((u) => {
              const name = fullName(u);
              const genderLabel =
                u.gender === true ? "Nam" : u.gender === false ? "Nữ" : "—";
              const genderColor =
                u.gender === true
                  ? "text-blue-600 bg-blue-50"
                  : u.gender === false
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-500 bg-gray-50";
              const avatar = (u.avatar || "").trim();

              return (
                <tr
                  key={u.id}
                  className="hover:bg-pink-50/50 transition-all cursor-pointer border-b last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {avatar ? (
                        <Image
                          src={avatar}
                          alt={name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 text-white grid place-content-center text-sm font-semibold shadow-sm">
                          {initials(name)}
                        </div>
                      )}
                      <div className="leading-tight">
                        <div className="font-semibold text-gray-800 text-base">
                          {name}
                        </div>
                        <div className="text-xs text-gray-500">
                          @{u.userName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {u.phoneNumber || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {u.address || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${genderColor}`}
                    >
                      {genderLabel}
                    </span>
                  </td>
                </tr>
              );
            })}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  {search
                    ? "Không tìm thấy người dùng nào khớp."
                    : "Chưa có người dùng nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-full border border-gray-300 
                       hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>

          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-full border border-gray-300 
                       hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
