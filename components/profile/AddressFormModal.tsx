"use client";

import { createAddress } from "@/services/address/createAddress/api";
import { useCreateAddress } from "@/services/address/createAddress/hooks";
import { Address } from "@/services/address/createAddress/type";
import { usePatchAddress } from "@/services/address/patchAddress/hooks";
import { useGetDistrict } from "@/services/delivery/getDistrict/hooks";
import { District } from "@/services/delivery/getDistrict/type";
import { useGetProvince } from "@/services/delivery/getProvince/hooks";
import { Province } from "@/services/delivery/getProvince/type";
import { useGetWard } from "@/services/delivery/getWard/hooks";
import { Ward } from "@/services/delivery/getWard/type";
import { useGetUser } from "@/services/users/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, Select, Input } from "antd";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const { Option } = Select;

export default function AddressFormModal({
  open,
  onClose,
  inistitalState,
}: {
  open: boolean;
  onClose: () => void;
  inistitalState: Address | null;
}) {
  const { data: province = [] } = useGetProvince();
  const [city, setCity] = useState<Province | undefined>();
  const [district, setDistrict] = useState<District | undefined>();
  const [ward, setWard] = useState<Ward | undefined>();
  const [phone, setPhone] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [name, setName] = useState<string>();
  const { data: districtList } = useGetDistrict(city?.ProvinceID);
  const { data: wardList } = useGetWard(district?.DistrictID);
  const { data: user } = useGetUser();

  const { mutateAsync: createAddress } = useCreateAddress();
  const { mutateAsync: patchAddress } = usePatchAddress();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!inistitalState) return;

    const selectedProvince = province.find(
      (p) => p.ProvinceName === inistitalState.provinceName
    );
    setCity(selectedProvince);

    const selectedDistrict = districtList?.find(
      (d) => d.DistrictID === inistitalState.districtId
    );
    setDistrict(selectedDistrict);

    const selectedWard = wardList?.find(
      (w) => w.WardCode === inistitalState.wardCode
    );
    setWard(selectedWard);
    setName(inistitalState.name);
    setAddress(inistitalState.address);
    setPhone(inistitalState.phone);
  }, [inistitalState, province, districtList, wardList]);

  const handleSave = async () => {
    const payload = {
      name: name ?? "",
      phone: phone ?? "",
      address: address ?? "",
      wardCode: ward?.WardCode ?? "",
      districtId: district?.DistrictID ?? 0,
      wardName: ward?.WardName ?? "",
      districtName: district?.DistrictName ?? "",
      provinceName: city?.ProvinceName ?? "",
      isDefault: true,
    };

    console.log(payload);
    if (inistitalState) {
      await patchAddress({ id: inistitalState.id, body: payload });
      queryClient.invalidateQueries(["patchAddress"]);

      toast.promise<{ name: string }>(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Cập nhật địa chỉ" }), 2000)
          ),
        {
          loading: "Loading...",
          success: (data) => `${data.name} thành công`,
          error: "Error",
        }
      );
    } else {
      await createAddress(payload);
      queryClient.invalidateQueries(["createAddress"]);
      toast.promise<{ name: string }>(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Địa chỉ" }), 2000)
          ),
        {
          loading: "Loading...",
          success: (data) => `${data.name} đã được thêm`,
          error: "Error",
        }
      );
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      closable={false}
      className="rounded-2xl p-0"
    >
      <div className="space-y-6 p-1">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-semibold text-gray-800">
            Thêm địa chỉ mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Thành phố</label>
            <Select
              showSearch
              placeholder="Chọn thành phố"
              optionFilterProp="children"
              value={city?.ProvinceID}
              onChange={(value) => {
                const selected = province.find((p) => p.ProvinceID === value);
                setCity(selected);
                setDistrict(undefined);
                setWard(undefined);
              }}
              className="mt-1 w-full"
              size="large"
            >
              {province.map((item: Province) => (
                <Select.Option key={item.ProvinceID} value={item.ProvinceID}>
                  {item.ProvinceName}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Quận / Huyện</label>
            <Select
              showSearch
              disabled={!city}
              placeholder="Chọn quận / huyện"
              value={district?.DistrictID}
              onChange={(value) => {
                const selected = districtList?.find(
                  (d) => d.DistrictID === value
                );
                setDistrict(selected);
                setWard(undefined);
              }}
              className="mt-1 w-full"
              size="large"
            >
              {districtList?.map((item: District) => (
                <Select.Option key={item.DistrictID} value={item.DistrictID}>
                  {item.DistrictName}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Phường / Xã</label>
            <Select
              showSearch
              disabled={!district}
              placeholder="Chọn phường / xã"
              value={ward?.WardCode}
              onChange={(value) => {
                const selected = wardList?.find((w) => w.WardCode === value);
                setWard(selected);
              }}
              className="mt-1 w-full"
              size="large"
            >
              {wardList?.map((item: Ward) => (
                <Select.Option key={item.WardCode} value={item.WardCode}>
                  {item.WardName}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Tên người nhận</label>
            <Input
              type="text"
              placeholder="Nhập tên..."
              className="mt-1"
              size="large"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Địa chỉ chi tiết</label>
            <Input
              type="text"
              placeholder="Số nhà, tên đường..."
              className="mt-1"
              size="large"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Số điện thoại</label>
            <Input
              type="text"
              placeholder="Số điện thoại"
              className="mt-1"
              size="large"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setPhone(value);
                }
              }}
              maxLength={10}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition"
            onClick={handleSave}
          >
            Lưu địa chỉ
          </button>
        </div>
      </div>
    </Modal>
  );
}
