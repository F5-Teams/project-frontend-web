import { useGetAddress } from "@/services/address/getAddress/hooks";
import { Address } from "@/services/address/getAddress/type";
import { useCalculateFee } from "@/services/calculateFee/hooks";
import { useGetUser } from "@/services/users/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Radio, Select } from "antd";
import React, { useEffect, useState } from "react";
import AddressModal from "./AddressModal";
import { usePostOrder } from "@/services/orders/postOrder/hooks";
import { useGetVoucher } from "@/services/vouchers/hooks";
import { Voucher } from "@/services/vouchers/type";
import { POST_ORDER_QUERY_KEY } from "@/services/orders/postOrder/hooks";
import { toast } from "sonner";
import { useGetWallet } from "@/services/wallets/hooks";
interface CartItem {
  productId: number;
  price: number;
  imageUrl?: string;
  name: string;
  quantity: number;
  weight: string;
}

interface DataProps {
  isOpen: boolean;
  isCancel: () => void;
  items: CartItem[];
  clearCart: () => void;
}

const BuyModal = ({ isOpen, isCancel, items, clearCart }: DataProps) => {
  const [form] = Form.useForm();
  const selectedAddress = Form.useWatch("address", form);
  const [option, setOption] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [address, setAddress] = useState<number | undefined>();
  const { data: user } = useGetUser();
  const [loading, setLoading] = useState(false);
  const [addressFee, setAddressFee] = useState<Address>();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const { data: fee, mutateAsync: calculateFee } = useCalculateFee();
  const { mutateAsync: createOrder } = usePostOrder();
  const [chooseVoucher, setChooseVoucher] = useState<Voucher>();
  const { data: addressList = [] } = useGetAddress();
  const { data: voucher = [] } = useGetVoucher();
  const { data: wallets } = useGetWallet();

  console.log("first", wallets);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalWeight = items.reduce(
    (sum, item) => sum + Number(item.weight) * item.quantity,
    0
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!address) return;

    const found = addressList.find((item) => item.id === address);
    setAddressFee(found);
  }, [address, addressList]);

  useEffect(() => {
    if (!addressFee) return;

    let length = 20,
      width = 15,
      height = 10;

    const weightKg = totalWeight / 1000;

    if (weightKg >= 10) {
      length = 50;
      width = 40;
      height = 40;
    } else if (weightKg >= 5) {
      length = 40;
      width = 30;
      height = 30;
    } else if (weightKg >= 2) {
      length = 30;
      width = 25;
      height = 20;
    } else {
      length = 20;
      width = 15;
      height = 10;
    }

    const payload: any = {
      to_district_id: addressFee.districtId,
      to_ward_code: addressFee.wardCode,
      weight: totalWeight,
      length,
      width,
      height,
      service_type_id: 2,
      cod_amount: total,
      insurance_value: Math.round(total * 0.01),
    };

    calculateFee(payload).catch((err) => console.error(err));
  }, [addressFee, totalWeight, total, calculateFee]);

  const handleSubmit = async () => {
    if (!address) {
      toast.error("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    if (!option) {
      toast.error("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    if (!items || items.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    setLoading(true);

    const orderPayloadTransfer = {
      status: "PAID",
      note,
      customerId: user?.id,
      orderDetails: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      addressId: address,
      paymentMethod:
        option === "wallet"
          ? "TRANSFER"
          : option === "momo"
          ? "MOMO"
          : option === "cod"
          ? "CASH"
          : "",

      voucherCode: chooseVoucher?.code || "",
    };

    try {
      if (orderPayloadTransfer.paymentMethod === "TRANSFER") {
        const money =
          total +
          (fee?.data?.service_fee ?? 0) -
          (chooseVoucher
            ? ((total + fee?.data?.service_fee) * chooseVoucher.percent) / 100
            : 0);
        if (money > Number(wallets?.balance || 0)) {
          toast.error("Tiền trong ví không đủ, vui lòng nạp thêm!");
          return;
        }
      }
      const response = await createOrder(orderPayloadTransfer);

      if (response?.vnpUrl) {
        window.location.href = response.vnpUrl;
      } else if (response?.momoUrl) {
        window.location.href = response.momoUrl;
      }

      queryClient.invalidateQueries(POST_ORDER_QUERY_KEY);

      form.resetFields();
      clearCart();
      setNote("");

      if (
        orderPayloadTransfer.paymentMethod === "CASH" ||
        orderPayloadTransfer.paymentMethod === "TRANSFER"
      ) {
        toast.success("Đặt hàng thành công!");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
      isCancel();
    }
  };

  const money =
    total +
    (fee?.data?.service_fee ?? 0) -
    (chooseVoucher
      ? ((total + fee?.data?.service_fee) * chooseVoucher.percent) / 100
      : 0);
  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setNote("");
        form.resetFields();
        isCancel();
      }}
      footer={null}
      width={600}
      title={<span className="font-semibold text-lg">🛒 Order Summary</span>}
    >
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border rounded-lg p-2 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="text-left">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {item.price.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
            <div className="font-semibold text-pink-600">
              {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 my-2" />

      <Form
        form={form}
        onValuesChange={(changedValues) => {
          if (changedValues.address) setAddress(changedValues.address);
        }}
      >
        <div className="flex">
          <h1 className="w-[30%]">Chọn địa chỉ:</h1>

          <Form.Item name="address" className="w-[60%]">
            <Select
              showSearch
              placeholder="Chọn địa chỉ"
              className="mt-1 w-full"
              optionFilterProp="children"
              popupRender={(menu) => (
                <div>
                  {menu}
                  <div
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-center py-2 cursor-pointer border-t hover:bg-pink-50 text-pink-600 font-medium"
                  >
                    Thay đổi địa chỉ
                  </div>
                </div>
              )}
            >
              {addressList.map((item: Address) => (
                <Select.Option key={item.id} value={item.id}>
                  <div className="flex gap-2">
                    <p className="font-medium">
                      {item.name} ({item.phone})
                    </p>
                    {item.address} / {item.districtName} / {item.provinceName}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>

      <div className="flex">
        <h1 className="w-[30%] mb-2">Chọn voucher</h1>
        <Select
          value={chooseVoucher?.code}
          onChange={(code) => {
            const selected = voucher.find((v) => v.code === code);
            setChooseVoucher(selected);
          }}
          allowClear
          placeholder="Chọn voucher"
          onClear={() => setChooseVoucher(undefined)}
          style={{ width: "60%" }}
          options={voucher.map((item) => ({
            label: `Voucher giảm ${item.percent}%`,
            value: item.code,
          }))}
        />
      </div>

      <div className="border-t border-gray-200 my-2" />

      <div className="flex justify-between items-center mb-5">
        <div className="text-sm font-medium mt-1">
          <p>Giá sản phẩm: {total.toLocaleString("vi-VN")} VNĐ</p>
          <p>
            Phí vận chuyển:{" "}
            {fee?.data?.service_fee?.toLocaleString("vi-VN") || 0} VNĐ
          </p>
        </div>
      </div>

      <div className="gap-2 items-center">
        <h1 className="font-semibold mb-2">Phương thức thanh toán:</h1>

        <Radio.Group
          onChange={(e) => setOption(e.target.value)}
          value={option}
          className="flex gap-4 mt-1"
        >
          {/* <Radio value="vnpay">
            <div className="flex items-center gap-2">
              <img src="/images/vnpay.png" alt="VNPAY" className="w-6 h-6" />
              <span>VNPAY</span>
            </div>
          </Radio> */}

          <Radio value="momo">
            <div className="flex items-center gap-2">
              <img src="/images/momo.png" alt="MOMO" className="w-6 h-6" />
              <span>MOMO</span>
            </div>
          </Radio>

          <Radio value="cod">
            <div className="flex items-center gap-2">
              <img src="/images/cash.png" alt="COD" className="w-6 h-6" />
              <span>COD</span>
            </div>
          </Radio>

          <Radio value="wallet">
            <div className="flex items-center gap-2">
              <img src="/images/wallet.jpg" alt="WALLET" className="w-12 h-6" />
              <span>Ví</span>
            </div>
          </Radio>
        </Radio.Group>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-semibold text-base">Tổng thanh toán:</span>
        <span className="text-green-600 font-bold text-lg">
          {(
            total +
            (fee?.data?.service_fee ?? 0) -
            (chooseVoucher
              ? ((total + fee?.data?.service_fee) * chooseVoucher.percent) / 100
              : 0)
          ).toLocaleString("vi-VN")}{" "}
          VNĐ
        </span>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => {
            setLoading(false);
            setNote("");
            form.resetFields();
            isCancel();
          }}
          className="flex-1! py-2! rounded-xl! border border-pink-500! cursor-pointer! text-pink-600! font-semibold! hover:bg-pink-50 transition"
        >
          Hủy
        </Button>

        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          className="flex-1! py-2! rounded-xl! text-white! bg-pink-500! hover:bg-pink-600!"
        >
          Đặt hàng
        </Button>
      </div>

      <AddressModal
        open={isAddressModalOpen}
        isCancel={() => setIsAddressModalOpen(false)}
        addressList={addressList}
        onSelect={(id) => setAddress(id)}
      />
    </Modal>
  );
};

export default BuyModal;
