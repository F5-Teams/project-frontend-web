"use client";

import { useEffect, useState, useRef } from "react";
import { Edit3, X, Check, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/utils/useInitials";
import { useUpdateMe } from "@/services/profile/hooks";
import { uploadFile } from "@/utils/uploadFIle";
import type {
  GetMeResponse,
  UpdateUserPayload,
} from "@/services/profile/types";
import { toast } from "sonner";

type Props = {
  user?: GetMeResponse | null;
};

export function UserInfoCard({ user }: Props) {
  const { mutateAsync: updateMe, isPending: saving } = useUpdateMe();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<UpdateUserPayload>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    avatar: "",
    gender: false,
  });

  useEffect(() => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      address: user?.address ?? "",
      avatar: user?.avatar ?? "",
      gender: Boolean(user?.gender),
    });
  }, [user]);

  const initials = useInitials({
    firstName: user?.firstName,
    lastName: user?.lastName,
    userName: user?.userName,
  });

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadFile(file);
      setForm((f) => ({ ...f, avatar: result.url }));
      toast.success("Tải ảnh lên thành công");
    } catch {
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
    }
  }

  function validatePhoneNumber(phone: string): boolean {
    if (!phone || phone.trim() === "") {
      setPhoneError("Số điện thoại không được để trống");
      return false;
    }

    const trimmed = phone.trim();
    const phoneRegex = /^0\d{9,10}$/;

    if (!phoneRegex.test(trimmed)) {
      setPhoneError("Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số");
      return false;
    }

    setPhoneError("");
    return true;
  }

  async function handleSave() {
    if (!validatePhoneNumber(form.phoneNumber ?? "")) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ");
      return;
    }

    await updateMe({
      firstName: form.firstName?.trim() || undefined,
      lastName: form.lastName?.trim() || undefined,
      phoneNumber: form.phoneNumber?.trim() || undefined,
      address: form.address?.trim() || undefined,
      avatar: form.avatar?.trim() || undefined,
      gender: form.gender,
    });
    setIsEditing(false);
    toast.promise<{ name: string }>(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Thông tin" }), 2000)
        ),
      {
        loading: "Loading...",
        success: (data) => `${data.name} đã được cập nhật`,
        error: "Error",
      }
    );
  }

  function handleCancel() {
    setIsEditing(false);
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      address: user?.address ?? "",
      avatar: user?.avatar ?? "",
      gender: Boolean(user?.gender),
    });
  }

  return (
    <div className="relative bg-white/40 backdrop-blur shadow-lg rounded-2xl p-6 text-black">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Chỉnh sửa"
          >
            <Edit3 className="w-4 h-4 " />
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-60 transition-colors"
              aria-label="Hủy"
            >
              <X className="w-4 h-4 text-black" />
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="p-2 rounded-lg bg-success hover:bg-green-500 disabled:opacity-60 transition-colors"
              aria-label="Lưu"
            >
              <Check className="w-4 h-4 text-white" />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-2 lg:border-4 border-primary/30">
              <AvatarImage
                src={
                  isEditing && form.avatar
                    ? form.avatar
                    : user?.avatar && user.avatar.trim() !== ""
                    ? user.avatar
                    : undefined
                }
                alt="Avatar"
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-base lg:text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || saving}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity disabled:opacity-50"
                  aria-label="Tải ảnh lên"
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
              </>
            )}
          </div>

          <div className="font-poppins-regular min-w-0">
            {!isEditing ? (
              <>
                <h2 className="text-xl mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-500 text-sm italic font-light mb-4">
                  @{user?.userName} - Email:{" "}
                  <span className="text-black font-poppins-regular">
                    {user?.email}
                  </span>
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    className="px-3 py-2 font-light rounded-lg bg-white border border-white/30 placeholder-white/70 text-black outline-none focus:ring-2 focus:ring-white/40"
                    placeholder="Họ"
                    value={form.lastName ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                  />
                  <input
                    className="px-3 py-2 font-light rounded-lg bg-white border border-white/30 placeholder-white/70 text-black outline-none focus:ring-2 focus:ring-white/40"
                    placeholder="Tên"
                    value={form.firstName ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                  />
                </div>
                <div className="text-gray-500 text-sm italic font-light mb-4">
                  @{user?.userName} {user?.userName}
                </div>
              </div>
            )}

            <div className="flex gap-10 mt-4 items-start">
              <div>
                <div className="text-gray-500 font-light text-[12px] mb-1.5">
                  Giới tính
                </div>
                {!isEditing ? (
                  <div className="font-poppins-regular text-lg">
                    {user?.gender ? "Nam" : "Nữ"}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, gender: false }))}
                      className={`px-3 py-1 font-light rounded-lg border ${
                        !form.gender
                          ? "bg-white text-primary border-white"
                          : "bg-white/10 text-black border-white/30"
                      }`}
                    >
                      Nữ
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, gender: true }))}
                      className={`px-3 py-1 font-light rounded-lg border ${
                        form.gender
                          ? "bg-white text-primary border-white"
                          : "bg-white/10 text-black border-white/30"
                      }`}
                    >
                      Nam
                    </button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500  font-light text-[12px] mb-1.5">
                  Số điện thoại
                </div>
                {!isEditing ? (
                  <div className="font-poppins-regular text-lg">
                    {user?.phoneNumber || "Chưa cập nhật"}
                  </div>
                ) : (
                  <div>
                    <input
                      className={`w-full max-w-xs font-light px-3 py-2 rounded-lg bg-white border placeholder-white/70 text-black outline-none focus:ring-2 ${
                        phoneError
                          ? "border-red-400 focus:ring-red-400/40"
                          : "border-white/30 focus:ring-white/40"
                      }`}
                      placeholder="Nhập số điện thoại"
                      value={form.phoneNumber ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((f) => ({ ...f, phoneNumber: value }));
                        validatePhoneNumber(value);
                      }}
                    />
                    {phoneError && (
                      <p className="text-red-500 text-xs mt-1 font-light">
                        {phoneError}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-500 font-light text-[12px] mb-1.5">
                  Địa chỉ
                </div>
                {!isEditing ? (
                  <p className="font-poppins-regular text-lg wrap-break-words overflow-hidden">
                    {user?.address || "Chưa cập nhật"}
                  </p>
                ) : (
                  <input
                    className="w-full font-light max-w-md px-3 py-2 rounded-lg bg-white border border-white/30 placeholder-white/70 text-black outline-none focus:ring-2 focus:ring-white/40"
                    placeholder="Nhập địa chỉ"
                    value={form.address ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
