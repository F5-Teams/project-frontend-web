/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/config/axios";
import { Pet } from "@/components/models/pet";
import PetCard from "@/components/card/PetCard";
import { FolderX } from "lucide-react";

export default function PetListPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy thông tin người dùng từ localStorage
  const user = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const userId = user?.id;

  // Tải danh sách thú cưng
  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!userId) {
      setError("Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/pet/user/${userId}`);
      setPets(res.data || []);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || "Không thể tải danh sách thú cưng."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Hàm xóa thú cưng
  const handleDeletePet = async (id: number) => {
    const confirmDelete = confirm("Bạn có chắc muốn xóa thú cưng này?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/pet/${id}`);
      setPets((prev) => prev.filter((p) => Number(p.id) !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || "Không thể xóa thú cưng.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Tiêu đề */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Thú cưng của tôi</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý danh sách thú cưng đã thêm.
          </p>
        </div>
      </header>

      {loading && (
        <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground">
          Đang tải danh sách thú cưng...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && pets.length === 0 && (
        <div className="bg-card rounded-2xl p-8 text-center">
          <div className="mx-auto w-24 h-24 relative">
            <FolderX className="w-24 h-24" stroke="gray" strokeWidth={1} />
          </div>
          <p className="mt-3 text-muted-foreground">
            Bạn chưa thêm thú cưng — Hãy thêm thú cưng.
          </p>
        </div>
      )}

      {!loading && !error && pets.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((p) => (
            <PetCard
              key={p.id}
              pet={p}
              onClick={() => router.push(`/information-pets?id=${p.id}`)}
              onDelete={handleDeletePet}
            />
          ))}
        </div>
      )}
    </div>
  );
}
