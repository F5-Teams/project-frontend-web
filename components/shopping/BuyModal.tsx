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
import {
  Banknote,
  CreditCard,
  MapPinHouse,
  ReceiptText,
  Smartphone,
  WalletCards,
} from "lucide-react";
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
    if (address) {
      form.setFieldsValue({ address });
    }
  }, [address]);

  useEffect(() => {
    if (addressList.length > 0 && !address) {
      const defaultAddress = addressList.find((a) => a.isDefault);
      if (defaultAddress) {
        setAddress(defaultAddress.id);
        form.setFieldsValue({ address: defaultAddress.id });
      }
    }
  }, [addressList]);

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
          : option === "vnpay"
          ? "VNPAY"
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
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      isCancel();
    }
  };

  const formattedAddress = (id: number) => {
    const i = addressList.find((a) => a.id === id);
    if (!i) return "";
    return `${i.name} (${i.phone}), ${i.address}, ${i.districtName}, ${i.provinceName}`;
  };

  const money =
    total +
    (fee?.data?.service_fee ?? 0) -
    (chooseVoucher ? total * (chooseVoucher.percent / 100) : 0);
  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setNote("");
        form.resetFields();
        isCancel();
      }}
      footer={null}
      width={1100}
      styles={{
        body: {
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "24px",
        },
      }}
      centered
      title={<span className="font-medium text-lg">🛒 Xác nhận đơn hàng</span>}
    >
      <div className="flex gap-6">
        <div className="w-1/2 border-r pr-4">
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
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
                    <p className="font-poppins-light font-light text-gray-800">
                      {item.name}
                    </p>
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
        </div>

        <div className="w-1/2 space-y-4">
          <Form
            form={form}
            onValuesChange={(changedValues) => {
              if (changedValues.address) setAddress(changedValues.address);
            }}
          >
            <h2 className="flex gap-2 font-poppins-light font-medium mb-2">
              <MapPinHouse size={16} /> Địa chỉ giao hàng
            </h2>

            {/* <Form.Item name="address">
              <Select
                showSearch
                placeholder="Chọn địa chỉ"
                className="mt-1 w-full"
                optionLabelProp="shortLabel"
                options={addressList.map((item) => {
                  const shortLabel = `${item.name} (${item.phone}), ${item.address}, ${item.districtName}, ${item.provinceName}`;

                  return {
                    value: item.id,
                    shortLabel,
                    label: (
                      <div className="flex flex-col whitespace-normal leading-tight">
                        <span>
                          {item.name} ({item.phone})
                          {item.isDefault && (
                            <span className="text-xs bg-pink-100 text-pink-600 rounded-full px-2 py-0.5 ml-2">
                              Mặc định
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.address}, {item.districtName},{" "}
                          {item.provinceName}
                        </span>
                      </div>
                    ),
                  };
                })}
                popupRender={(menu) => (
                  <div className="min-w-[400px]">
                    {menu}
                    <div
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-center py-2 cursor-pointer border-t hover:bg-pink-50 text-pink-600 font-poppins-light font-light"
                    >
                      {addressList.length === 0
                        ? "Tạo địa chỉ mới"
                        : "Sửa địa chỉ"}
                    </div>
                  </div>
                )}
              />
            </Form.Item> */}
            <Form.Item name="address">
              <Select
                open={false}
                className="w-full cursor-pointer"
                placeholder="Chọn địa chỉ giao hàng"
                onClick={() => setIsAddressModalOpen(true)}
                value={
                  address && addressList.length > 0 ? address : "Chọn địa chỉ"
                }
                options={
                  address
                    ? [
                        {
                          value: address,
                          label: formattedAddress(address),
                        },
                      ]
                    : []
                }
              />
            </Form.Item>
          </Form>

          <div>
            <h2 className="flex gap-2 font-poppins-light font-medium mb-2">
              <ReceiptText size={16} /> Chọn voucher
            </h2>

            <Select
              value={chooseVoucher?.code}
              onChange={(code) => {
                const selected = voucher.find((v) => v.code === code);
                setChooseVoucher(selected);
              }}
              allowClear
              placeholder="Chọn voucher"
              onClear={() => setChooseVoucher(undefined)}
              className="w-full"
              options={voucher.map((item) => ({
                label: `Voucher giảm ${item.percent}%`,
                value: item.code,
              }))}
            />
          </div>

          <div className="border-t pt-3 space-y-1 text-sm">
            <p>
              Giá sản phẩm: <strong>{total.toLocaleString("vi-VN")} VNĐ</strong>
            </p>

            <p>
              Phí vận chuyển:{" "}
              <strong>
                {fee?.data?.service_fee?.toLocaleString("vi-VN") || 0} VNĐ
              </strong>
            </p>

            {chooseVoucher && (
              <p className="text-green-600">Giảm: {chooseVoucher.percent}%</p>
            )}
          </div>

          <div>
            <h2 className="flex gap-2 font-poppins-light font-medium mb-2">
              <CreditCard size={16} /> Phương thức thanh toán
            </h2>

            <Radio.Group
              onChange={(e) => setOption(e.target.value)}
              value={option}
              className="flex flex-wrap gap-4"
            >
              <Radio value="vnpay">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>VNPAY</span>
                </div>
              </Radio>

              <Radio value="momo">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} />
                  <span>MOMO</span>
                </div>
              </Radio>

              <Radio value="cod">
                <div className="flex items-center gap-2">
                  <Banknote size={20} />
                  <span>COD</span>
                </div>
              </Radio>

              <Radio value="wallet">
                <div className="flex items-center gap-2">
                  <WalletCards size={16} />
                  <span>Ví</span>
                </div>
              </Radio>
            </Radio.Group>
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-base">Tổng thanh toán:</span>
            <span className="text-green-600 font-bold text-lg">
              {money.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              onClick={() => {
                setLoading(false);
                setNote("");
                form.resetFields();
                isCancel();
              }}
              className="flex-1! py-2! rounded-xl! border border-pink-500! text-pink-600!"
            >
              Hủy
            </Button>

            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              className="flex-1! py-2! rounded-xl! bg-pink-500! hover:bg-pink-600!"
            >
              Đặt hàng
            </Button>
          </div>
        </div>
      </div>

      <AddressModal
        open={isAddressModalOpen}
        isCancel={() => setIsAddressModalOpen(false)}
        addressList={addressList}
        onSelect={(id) => {
          setAddress(id);
          form.setFieldsValue({ address: id });
          setIsAddressModalOpen(false);
        }}
      />
    </Modal>
  );
};

export default BuyModal;
