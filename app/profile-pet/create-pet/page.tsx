/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pet, PetImage } from "@/components/models/pet";
import api from "@/config/axios";

export default function CreatePetPage() {
  const router = useRouter();

  const userId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")?.id || ""
      : "";

  const [form, setForm] = useState<
    Omit<Pet, "id" | "images"> & { images: string[] }
  >({
    name: "",
    age: 0,
    species: "Dog",
    breed: "",
    gender: "MALE",
    height: 0,
    weight: 0,
    note: "",
    images: [""],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["age", "height", "weight"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index: number) => {
    const updated = [...form.images];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const images: PetImage[] = form.images
        .filter((url) => url.trim() !== "")
        .map((url) => ({ imageUrl: url.trim(), type: "cover" }));

      const genderBool = form.gender === "MALE" ? true : false;

      const payload = {
        ...form,
        gender: genderBool,
        images,
      };

      await api.post(`/pet/user/${userId}`, payload);
      alert("Thêm thú cưng thành công!");
      router.push("/profile-pet/information-pets");
    } catch (err: unknown) {
      console.error("Error:", err);
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as any).response?.data
      ) {
        setError((err as any).response.data?.message || "Có lỗi xảy ra!");
      } else {
        setError("Có lỗi xảy ra!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 ">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Thêm thú cưng mới
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Hãy nhập thông tin cơ bản và thêm một vài tấm ảnh thật đẹp nhé!
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section: Info */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tên thú cưng <span className="text-pink-600">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
                placeholder="VD: Mimi"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tuổi <span className="text-pink-600">*</span>
              </label>
              <input
                name="age"
                value={form.age}
                onChange={handleChange}
                type="number"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
                placeholder="Nhập tuổi"
                min={0}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Loài
              </label>
              <select
                name="species"
                value={form.species}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
                required
              >
                <option value="Dog">Chó</option>
                <option value="Cat">Mèo</option>
                <option value="Other">Khác</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Giới tính
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
              >
                <option value="MALE">Đực</option>
                <option value="FEMALE">Cái</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Giống loài
              </label>
              <input
                name="breed"
                value={form.breed}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner outline-none transition focus:border-pink-300 focus:ring-pink-200"
                placeholder="VD: Poodle, Munchkin..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Chiều cao (cm)
                </label>
                <input
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  type="number"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
                  placeholder="VD: 30"
                  min={0}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Cân nặng (kg)
                </label>
                <input
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  type="number"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
                  placeholder="VD: 4.2"
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Ghi chú
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
              placeholder="Tính cách, thói quen, dị ứng..."
            />
          </div>
        </section>

        {/* Section: Images */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Ảnh thú cưng
            </h2>
          </div>

          <div className="space-y-3">
            {form.images.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder={`Dán link ảnh ${idx + 1}`}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                    title="Xóa ảnh"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              + Thêm ảnh
            </button>
          </div>
        </section>

        {/* Actions */}
        <div className="sticky bottom-4 z-10 -mx-4 px-4 py-3 shadow-none backdrop-blur md:static md:mx-0 md:rounded-xl md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-pink-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 disabled:opacity-60"
            >
              {loading ? "Đang lưu..." : "Lưu thú cưng"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
