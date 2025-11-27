"use client";

import { useEffect, useState } from "react";
import { MapPin, Pencil, Trash2, Plus, TriangleAlert } from "lucide-react";
import AddressFormModal from "@/components/profile/AddressFormModal";
import { useGetAddress } from "@/services/address/getAddress/hooks";
import { Address } from "@/services/address/getAddress/type";
import { Button, Modal } from "antd";
import { useDeleteAddress } from "@/services/address/deleteAddress/hooks";
import { toast } from "sonner";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import Image from "next/image";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const { data: addressList } = useGetAddress();
  const [selectAddress, setSelectAddress] = useState<Address | null>();

  const { mutateAsync: deleteAddress } = useDeleteAddress();

  console.log("API addresses:", addressList);

  useEffect(() => {
    if (addressList) {
      setAddresses(addressList);
    }
  }, [addressList]);

  const handleAdd = () => {
    setEditAddress(null);
    setOpenModal(true);
  };

  const handleEdit = (item: Address) => {
    setEditAddress(item);
    setOpenModal(true);
  };

  const handleDelete = (item: Address) => {
    setSelectAddress(item);
    setOpenDelete(true);
  };

  const handleSave = (data: Address) => {
    if (editAddress) {
      setAddresses(addresses.map((a) => (a.id === data.id ? data : a)));
    } else {
      setAddresses([
        ...addresses,
        { ...data, id: Date.now(), isDefault: false },
      ]);
    }
    setOpenModal(false);
  };

  return (
    <div className="mx-auto w-full sm:max-w-5xl lg:max-w-7xl p-4 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
        <h1 className="font-poppins-regular text-xl lg:text-2xl text-gray-900">
          Địa chỉ người dùng
        </h1>
        <button
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2 hover:bg-primary/90 transition"
        >
          <Plus size={18} />
          Thêm địa chỉ
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between bg-white shadow-sm rounded-2xl p-4 border border-pink-100"
          >
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="text-primary" size={20} />
                <span className="font-medium text-gray-900">{item.name}</span>
                {item.isDefault && (
                  <span className="text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5">
                    Mặc định
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {`${item.address}, ${item.wardName}, ${item.districtName}, ${item.provinceName}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 hover:bg-pink-100 rounded-lg text-gray-700"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="p-2 hover:bg-red-100 rounded-lg text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {openModal && (
        <AddressFormModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          inistitalState={editAddress}
        />
      )}

      <Modal
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        footer={null}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image
            alt="Logo"
            src={Logo}
            width={48}
            height={48}
            className="object-contain"
          />
          <span className="text-pink-600 font-extrabold text-lg tracking-tight">
            HappyPaws
          </span>
        </div>

        <div className="w-[60%] mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div className="flex flex-col items-center justify-center gap-4 mt-2">
          <div className="bg-red-50 p-3 rounded-full border border-red-100">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="flex justify-center text-lg font-semibold text-gray-800">
              Xác nhận xoá?
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Hành động này
              <span className="font-medium text-red-500">
                không thể hoàn tác
              </span>
              sau khi xác nhận.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => setOpenDelete(false)}
            className="!border-gray-300 !text-gray-700 hover:!border-gray-400 hover:!text-gray-900 rounded-md px-5 py-1.5"
          >
            Huỷ
          </Button>
          <Button
            type="primary"
            danger
            onClick={async () => {
              if (selectAddress?.id !== undefined) {
                await deleteAddress(selectAddress.id);
                setAddresses(
                  addresses.filter((a) => a.id !== selectAddress.id)
                );
                setOpenDelete(false);
                toast.promise<{ name: string }>(
                  () =>
                    new Promise((resolve) =>
                      setTimeout(() => resolve({ name: "Xóa địa chỉ" }), 2000)
                    ),
                  {
                    loading: "Loading...",
                    success: (data) => `${data.name} thành công!`,
                    error: "Error",
                  }
                );
              }
            }}
            className="rounded-md px-5 py-1.5 font-medium bg-red-500 hover:!bg-red-600 transition-all"
          >
            Xoá
          </Button>
        </div>
      </Modal>
    </div>
  );
}
