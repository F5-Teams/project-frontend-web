/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import api from "@/config/axios";
import { User } from "@/components/models/register";
import { CreateUser } from "@/components/models/create-staff";
import Pagination from "@/components/shared/Pagination";
import {
  UserRound,
  Phone,
  MapPin,
  Search,
  VenusAndMars,
  X,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

export default function Customers() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formError, setFormError] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [filterGender, setFilterGender] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const defaultUser: CreateUser = {
    role: "staff",
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    gender: true,
  };
  const [newUser, setNewUser] = useState<CreateUser>(defaultUser);

  const perPage = 5;

  const fullName = (u: User) =>
    `${(u.firstName || "").trim()} ${(u.lastName || "").trim()}`.trim() ||
    u.userName ||
    `#${u.id}`;

  const initials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase() || "U";
  };

  const roleMeta: Record<number, { label: string; cls: string }> = {
    1: { label: "Admin", cls: "text-purple-700 bg-purple-50" },
    2: { label: "Staff", cls: "text-emerald-700 bg-emerald-50" },
    3: { label: "Groomer", cls: "text-amber-700 bg-amber-50" },
    4: { label: "Customer", cls: "text-gray-700 bg-gray-100" },
  };

  const roleDisplay = (roleId?: number) =>
    roleMeta[roleId ?? 0] ?? { label: "—", cls: "text-gray-500 bg-gray-50" };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Backend chỉ hỗ trợ pagination, không hỗ trợ filter
      // Fetch tất cả users và filter ở frontend
      const res = await api.get("/users", {
        params: {
          page: 1,
          limit: 1000, // Lấy nhiều để có thể filter
        },
      });

      let allUsers = res.data?.data || [];

      // Filter by search
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        allUsers = allUsers.filter((u: User) => {
          const name = fullName(u).toLowerCase();
          const username = (u.userName || "").toLowerCase();
          return name.includes(searchLower) || username.includes(searchLower);
        });
      }

      // Filter by gender
      if (filterGender !== "all") {
        allUsers = allUsers.filter((u: User) => {
          if (filterGender === "male") return u.gender === true;
          if (filterGender === "female") return u.gender === false;
          return true;
        });
      }

      // Filter by role
      if (filterRole !== "all") {
        const roleMap: Record<string, number> = {
          admin: 1,
          staff: 2,
          groomer: 3,
          customer: 4,
        };
        const targetRoleId = roleMap[filterRole];
        allUsers = allUsers.filter((u: User) => u.roleId === targetRoleId);
      }

      // Calculate pagination for filtered data
      const total = allUsers.length;
      const totalPagesCalculated = Math.ceil(total / perPage);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedUsers = allUsers.slice(startIndex, endIndex);

      setData(paginatedUsers);
      setTotalPages(totalPagesCalculated);
      setTotalUsers(total);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tải người dùng");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, filterGender, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async () => {
    try {
      setCreating(true);
      setFormError("");
      const res = await api.post("/user", newUser);
      if (res.status === 201 || res.status === 200) {
        toast("Tạo thành công", {
          description: `${
            newUser.role === "staff" ? "Nhân viên" : "Thợ"
          } đã được thêm.`,
        });
        setNewUser(defaultUser);
        setOpenModal(false);
        fetchUsers();
      }
    } catch (err: any) {
      toast("Lỗi khi tạo người dùng", {
        description: err.response?.data?.message || "Vui lòng thử lại.",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewUser(defaultUser);
    setFormError("");
  };

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
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">
            Danh sách người dùng
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng số: {totalUsers} người dùng
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Button tạo mới */}
          <button
            onClick={() => setOpenModal(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-sm transition"
          >
            + Tạo mới
          </button>

          {/* Bộ lọc */}
          <div className="relative">
            <details className="group">
              <summary className="cursor-pointer bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium px-4 py-2 rounded-full text-sm shadow-sm">
                Bộ lọc
              </summary>
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-3 z-10">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={filterGender}
                    onChange={(e) => {
                      setFilterGender(e.target.value);
                      setPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="all">Tất cả</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Vai trò
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => {
                      setFilterRole(e.target.value);
                      setPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="all">Tất cả</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="groomer">Groomer</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
              </div>
            </details>
          </div>

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
              <th className="px-6 py-3 text-left font-semibold">
                <UserCog className="inline-block w-4 h-4 mr-2 text-pink-500" />
                Vai trò
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((u) => {
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
                  <td className="px-6 py-4">
                    {(() => {
                      const { label, cls } = roleDisplay(u.roleId);
                      return (
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${cls}`}
                        >
                          {label}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  {search || filterGender !== "all" || filterRole !== "all"
                    ? "Không tìm thấy người dùng nào khớp."
                    : "Chưa có người dùng nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalUsers}
        itemsPerPage={perPage}
        onPageChange={setPage}
        loading={loading}
      />

      {/* Modal tạo mới */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-lg p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Tạo mới nhân viên
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={newUser.userName}
                required
                onChange={(e) =>
                  setNewUser({ ...newUser, userName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={newUser.password}
                required
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Họ"
                  value={newUser.firstName}
                  required
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
                />
                <input
                  type="text"
                  placeholder="Tên"
                  value={newUser.lastName}
                  required
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                  className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <input
                type="text"
                placeholder="Số điện thoại"
                value={newUser.phoneNumber}
                required
                onChange={(e) =>
                  setNewUser({ ...newUser, phoneNumber: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="Địa chỉ"
                value={newUser.address}
                required
                onChange={(e) =>
                  setNewUser({ ...newUser, address: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
              />

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Giới tính:</label>
                <select
                  value={newUser.gender ? "true" : "false"}
                  required
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      gender: e.target.value === "true",
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-pink-400"
                >
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>

                <label className="text-sm text-gray-600">Vai trò:</label>
                <select
                  value={newUser.role}
                  required
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as "staff" | "groomer",
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-pink-400"
                >
                  <option value="staff">Staff</option>
                  <option value="groomer">Groomer</option>
                </select>
              </div>

              {formError && (
                <p className="text-sm text-red-600 text-center">{formError}</p>
              )}

              <button
                onClick={handleCreateUser}
                disabled={creating}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg py-2.5 transition disabled:opacity-50"
              >
                {creating ? "Đang tạo..." : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
