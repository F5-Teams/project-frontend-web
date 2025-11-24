"use client";

import { Address } from "@/services/address/getAddress/type";
import { Modal, Button } from "antd";
import { MapPin, Pencil, Trash2, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import AddressFormModal from "@/components/profile/AddressFormModal";
import { useDeleteAddress } from "@/services/address/deleteAddress/hooks";
import { toast } from "sonner";
import { usePatchAddressDefault } from "@/services/address/addressDefault/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface DataProps {
  open: boolean;
  isCancel: () => void;
  addressList: Address[];
  onSelect: (id: number) => void;
}

const AddressModal = ({ open, isCancel, addressList, onSelect }: DataProps) => {
  const [addresses, setAddresses] = useState<Address[]>(addressList);
  const [openForm, setOpenForm] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [deleteItem, setDeleteItem] = useState<Address | null>(null);
  const { mutateAsync: patchDefault } = usePatchAddressDefault();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteAddress } = useDeleteAddress();

  useEffect(() => {
    setAddresses(addressList);
  }, [addressList]);

  const handleSave = (data: Address) => {
    if (editAddress) {
      setAddresses(addresses.map((a) => (a.id === data.id ? data : a)));
    } else {
      setAddresses([...addresses, { ...data }]);
    }
    setOpenForm(false);
  };

  return (
    <Modal open={open} onCancel={isCancel} footer={null} title="Chọn địa chỉ">
      <div className="space-y-3 max-h-[350px] overflow-y-auto">
        {addresses.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between bg-white shadow-sm rounded-2xl p-4 border border-pink-100 hover:border-pink-500 transition"
          >
            <div
              onClick={() => {
                onSelect(item.id);
                isCancel();
              }}
              className="cursor-pointer flex-1"
            >
              <div className="flex items-center gap-2">
                <MapPin className="text-pink-500" size={20} />
                <span className="font-medium text-gray-900">{item.name}</span>
                {item.isDefault && (
                  <span className="text-xs bg-pink-100 text-pink-600 rounded-full px-2 py-0.5">
                    Mặc định
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {item.address}, {item.wardName}, {item.districtName},{" "}
                {item.provinceName}
              </p>
              <p className="text-xs font-medium text-gray-500 mt-1">
                SĐT: {item.phone}
              </p>
            </div>

            <div className="flex flex-col gap-2 ml-3">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!item.isDefault) {
                    await patchDefault(item.id);
                    setAddresses(
                      addresses.map((a) => ({
                        ...a,
                        isDefault: a.id === item.id,
                      }))
                    );
                    toast.success("Đặt địa chỉ mặc định thành công!");
                    queryClient.invalidateQueries(["getAddress"]);
                  }
                }}
                className={`p-2 rounded-lg ${
                  item.isDefault
                    ? "bg-pink-100 text-pink-600"
                    : "hover:bg-pink-50 text-gray-700"
                }`}
              >
                <MapPin size={14} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditAddress(item);
                  setOpenForm(true);
                }}
                className="p-2 hover:bg-pink-100 rounded-lg text-gray-700"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteItem(item);
                }}
                className="p-2 hover:bg-red-100 rounded-lg text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="primary"
        className="w-full mt-4 rounded-lg bg-pink-500! hover:bg-pink-600!"
        onClick={() => {
          setEditAddress(null);
          setOpenForm(true);
        }}
      >
        <Plus size={16} className="mr-1" /> Thêm địa chỉ mới
      </Button>

      {openForm && (
        <AddressFormModal
          open={openForm}
          onClose={() => setOpenForm(false)}
          inistitalState={editAddress}
        />
      )}

      <Modal
        open={!!deleteItem}
        onCancel={() => setDeleteItem(null)}
        footer={null}
      >
        <h3 className="font-semibold text-lg text-center mb-3">
          Xác nhận xóa?
        </h3>

        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={() => setDeleteItem(null)}>Huỷ</Button>

          <Button
            type="primary"
            danger
            onClick={async () => {
              if (deleteItem) {
                await deleteAddress(deleteItem.id);
                setAddresses(addresses.filter((a) => a.id !== deleteItem.id));
                toast.success("Xoá địa chỉ thành công!");
                setDeleteItem(null);
              }
              queryClient.invalidateQueries(["getAddress"]);
            }}
          >
            Xóa
          </Button>
        </div>
      </Modal>
    </Modal>
  );
};

export default AddressModal;
