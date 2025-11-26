"use client";

import { Address } from "@/services/address/getAddress/type";
import { Modal, Button, Radio } from "antd";
import { MapPin, Pencil, Trash2, Plus, MapPinHouse } from "lucide-react";
import React, { useState, useEffect } from "react";
import AddressFormModal from "@/components/profile/AddressFormModal";
import { useDeleteAddress } from "@/services/address/deleteAddress/hooks";
import { usePatchAddressDefault } from "@/services/address/addressDefault/hooks";
import { toast } from "sonner";
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
  const [selectedId, setSelectedId] = useState<number>();

  const { mutateAsync: patchDefault } = usePatchAddressDefault();
  const { mutateAsync: deleteAddress } = useDeleteAddress();
  const queryClient = useQueryClient();

  useEffect(() => {
    setAddresses(addressList);
    const defaultAddress = addressList.find((a) => a.isDefault);
    if (defaultAddress) {
      setSelectedId(defaultAddress.id);
      onSelect(defaultAddress.id);
    } else if (addressList.length === 1) {
      const onlyAddress = addressList[0];
      setSelectedId(onlyAddress.id);
      onSelect(onlyAddress.id);
      isCancel();
    }
  }, [addressList]);

  const handleSetDefault = async (address: Address) => {
    try {
      await patchDefault(address.id);
      toast.success("Đã đặt làm địa chỉ mặc định");
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === address.id }))
      );
    } catch (error) {
      toast.error("Đặt mặc định thất bại");
    }
  };

  return (
    <Modal open={open} onCancel={isCancel} footer={null}>
      <h1 className="flex items-center gap-2 text-pink-600 font-medium cursor-pointer">
        {addressList.length === 0 ? (
          <>
            <MapPinHouse size={20} /> Chưa có địa chỉ nào. Thêm địa chỉ
          </>
        ) : (
          <>
            <MapPinHouse size={20} /> Chọn địa chỉ
          </>
        )}
      </h1>

      <div className="space-y-3 max-h-[350px] overflow-y-auto">
        <Radio.Group
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            onSelect(e.target.value);

            toast.success(`Chọn địa chỉ thành công!`);
            isCancel();
          }}
        >
          {addresses.map((item) => (
            <div key={item.id} className="flex items-start mt-3 gap-3">
              <Radio value={item.id} />

              <div className="flex-1 bg-white shadow-sm rounded-2xl p-4 border border-pink-100 hover:border-pink-500 transition">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 px-2 py-1 rounded-2xl"
                      onClick={() => handleSetDefault(item)}
                    >
                      <MapPin
                        className={`cursor-pointer ${
                          item.isDefault ? "text-white" : "text-white"
                        }`}
                        size={16}
                      />
                      <span className="text-[12px] text-white cursor-pointer">
                        Chọn mặc định
                      </span>
                    </div>

                    <span className="font-medium text-gray-900">
                      {item.name}
                    </span>

                    {item.isDefault && (
                      <span className="text-xs bg-pink-100 text-pink-600 rounded-full px-2 py-0.5">
                        Mặc định
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-1">{item.name}</p>

                <p className="text-sm text-gray-600 mt-1">
                  {item.address}, {item.wardName}, {item.districtName},{" "}
                  {item.provinceName}
                </p>

                <p className="text-xs font-medium text-gray-500 mt-1">
                  SĐT: {item.phone}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditAddress(item);
                      setOpenForm(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteItem(item);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Radio.Group>
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
