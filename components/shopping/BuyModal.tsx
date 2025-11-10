import { useGetAddress } from "@/services/address/getAddress/hooks";
import { Address } from "@/services/address/getAddress/type";
import { useCalculateFee } from "@/services/calculateFee/hooks";
import { postOrder } from "@/services/orders/postOrder/api";
import { useGetUser } from "@/services/users/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Radio, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [form] = useForm();
  const [note, setNote] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<number>();
  const { data: user } = useGetUser();
  const [loading, setLoading] = useState(false);
  const [addressFee, setAddressFee] = useState<Address>();

  const { data: fee, mutateAsync: calculateFee } = useCalculateFee();

  const { data: addressList = [] } = useGetAddress();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    setAddress(user?.address || "");
    setPhone(user?.phoneNumber || "");

    form.setFieldsValue({
      phone: user?.phoneNumber,
      address: user?.address,
    });
  }, [user]);

  useEffect(() => {
    const filterAddress = addressList.find((item) => item.id === address);
    setAddressFee(filterAddress);
  }, [address, addressList]);

  const totalWeight = items.reduce(
    (sum, item) => sum + Number(item.weight) * item.quantity,
    0
  );

  useEffect(() => {
    if (!addressFee) return;
    const payload: any = {
      to_district_id: addressFee?.districtId,
      to_ward_code: addressFee?.wardCode,
      weight: totalWeight,
      length: 20,
      width: 15,
      height: 10,
      service_type_id: 2,
      cod_amount: 0,
      insurance_value: 0,
    };

    try {
      calculateFee(payload);
    } catch (error) {
      console.log(error);
    }
  }, [addressFee, calculateFee, totalWeight]);

  const handleSubmit = async () => {
    setLoading(true);

    const orderPayloadTransfer = {
      status: "PENDING",
      note: note,
      customerId: user?.id,
      orderDetails: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      addressId: Number(address),
      paymentMethod: "TRANSFER",
    };

    console.log("ORDER", orderPayloadTransfer);

    try {
      await postOrder(orderPayloadTransfer);
      toast.promise<{ name: string }>(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Đặt hàng" }), 500)
          ),
        {
          loading: "Loading...",
          success: (data) => `${data.name} thành công!`,
          error: "Error",
        }
      );
      queryClient.invalidateQueries(["createOrder"]);
      form.resetFields();
      clearCart();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    isCancel();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={isCancel}
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

      <Form form={form}>
        <div className="flex">
          <h1 className="w-[30%]">Nhập số điện thoại:</h1>
          <Form.Item
            className="w-[60%]"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { min: 10, message: "Số điện thoại phải đủ 10 số!" },
            ]}
          >
            <Input type="number" onChange={(e) => setPhone(e.target.value)} />
          </Form.Item>
        </div>

        <div className="flex ">
          <h1 className="w-[30%]">Chọn địa chỉ:</h1>
          <Form.Item className="w-[60%]">
            <Select
              showSearch
              placeholder="Chọn địa chỉ"
              optionFilterProp="children"
              onChange={(value) => {
                setAddress(value);
              }}
              className="mt-1 w-full"
            >
              {addressList.map((item: Address) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.address} / {item.districtName} / {item.provinceName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
      <div className="border-t border-gray-200 my-2" />

      <div className="flex justify-between items-center mb-5">
        <div className=" justify-between text-sm font-medium mt-1">
          <p>Giá sản phẩm: {total.toLocaleString("vi-VN") || "0"} VNĐ </p>
          <p>
            Phí vận chuyển:{" "}
            {fee?.data?.service_fee?.toLocaleString("vi-VN") || "0"} VNĐ{" "}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-5">
        <span className="font-semibold text-base">Tổng thanh toán:</span>
        <span className="text-green-600 font-bold text-lg">
          {(total + (fee?.data?.service_fee ?? 0)).toLocaleString("vi-VN")} VNĐ
        </span>
      </div>

      <div className="mt-5 ">
        <div className="flex gap-2">
          <h1 className="font-semibold mb-2"> Phương thức thanh toán: </h1>
          <h1 className=" mb-2"> Ví của tôi</h1>
        </div>
        <h1 className="font-semibold mb-2">Ghi chú:</h1>
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        ></Input.TextArea>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => {
            setLoading(false);
            isCancel();
            setNote("");
            form.resetFields();
          }}
          className="flex-1 py-2 rounded-xl border border-pink-500 cursor-pointer text-pink-600 font-semibold hover:bg-pink-50 transition"
        >
          Hủy
        </button>

        <Button
          type="primary"
          onClick={() => {
            handleSubmit();
            setNote("");
            form.resetFields();
          }}
          loading={loading}
          className="flex-1! py-2! rounded-xl! text-white! bg-pink-500! hover:bg-pink-600!"
        >
          Đặt hàng
        </Button>
      </div>
    </Modal>
  );
};

export default BuyModal;
