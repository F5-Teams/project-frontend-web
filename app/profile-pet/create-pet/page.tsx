/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pet, PetImage } from "@/components/models/pet";
import api from "@/config/axios";
import { uploadFile } from "@/utils/uploadFIle";
import { UploadCloud, PawPrint, Heart } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function CreatePetPage() {
  const router = useRouter();

  const userId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")?.id || ""
      : "";

  const [form, setForm] = useState<
    Omit<Pet, "id" | "images"> & { images: File[] }
  >({
    name: "",
    age: 0,
    species: "Dog",
    breed: "",
    gender: "MALE",
    height: 0,
    weight: 0,
    note: "",
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const uploadedImages: PetImage[] = await Promise.all(
        form.images.map(async (file) => {
          const uploaded = await uploadFile(file);
          return { imageUrl: uploaded.url, type: "cover" };
        })
      );

      const genderBool = form.gender === "MALE";

      const payload = {
        name: form.name,
        age: form.age,
        species: form.species,
        breed: form.breed,
        gender: genderBool,
        height: form.height,
        weight: form.weight,
        note: form.note,
        images: uploadedImages,
      };

      await api.post(`/pet/user/${userId}`, payload);

      toast.success("Thêm Boss thành công!");
      router.push("/profile-pet/information-pets");
    } catch (err: unknown) {
      console.error("Error:", err);
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as any).response?.data
      ) {
        const msg = (err as any).response.data?.message || "Có lỗi xảy ra!";
        setError(msg);
      } else {
        setError("Có lỗi xảy ra!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-pink-100 p-3 rounded-full">
          <PawPrint className="text-pink-500 w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Thêm Boss mới </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 text-red-600 px-4 py-3 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg space-y-10 border border-pink-100"
      >
        {/* Thông tin cơ bản */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-pink-600 flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" />
            Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Tên thú cưng"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="VD: Mimi"
            />

            <InputField
              label="Tuổi"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
              placeholder="Nhập tuổi"
            />

            <SelectField
              label="Loài"
              name="species"
              value={form.species}
              onChange={handleChange}
              options={[
                { value: "Dog", label: "Chó" },
                { value: "Cat", label: "Mèo" },
                { value: "Other", label: "Khác" },
              ]}
            />

            <SelectField
              label="Giới tính"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={[
                { value: "MALE", label: "Đực" },
                { value: "FEMALE", label: "Cái" },
              ]}
            />

            <InputField
              label="Giống loài"
              name="breed"
              value={form.breed}
              onChange={handleChange}
              placeholder="VD: Poodle, Munchkin..."
            />

            <div className="flex gap-4">
              <InputField
                label="Cao (cm)"
                name="height"
                type="number"
                value={form.height}
                onChange={handleChange}
                placeholder="VD: 30"
              />
              <InputField
                label="Nặng (kg)"
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                placeholder="VD: 4.2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-200 outline-none transition-all"
              placeholder="Tính cách, thói quen, sở thích..."
            />
          </div>
        </section>

        {/* Ảnh */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-pink-600 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-pink-400" />
            Ảnh của Boss
          </h2>

          <label className="flex cursor-pointer items-center gap-2 w-fit rounded-xl border border-dashed border-pink-300 bg-pink-50 px-5 py-3 text-pink-600 text-sm font-medium hover:bg-pink-100 transition">
            <UploadCloud className="w-4 h-4" />
            <span>Chọn ảnh</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {previewUrls.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-2">
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md border border-gray-100"
                >
                  <Image
                    src={url}
                    alt={`preview-${idx}`}
                    width={120}
                    height={120}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Nút submit */}
        <div className="flex justify-end border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu thú cưng"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* 🧩 Component Input & Select tái sử dụng */
function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: any) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">
        {label} {required && <span className="text-pink-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-200 outline-none transition-all"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-200 outline-none transition-all"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
