import { postOrder } from "@/services/orders/postOrder/api";
import { useGetUser } from "@/services/users/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Modal, Radio, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";

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
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [option, setOption] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const { data: user } = useGetUser();
  const [loading, setLoading] = useState(false);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setAddress(user?.address || "");
    setPhone(user?.phoneNumber || "");

    form.setFieldsValue({
      phone: user?.phoneNumber,
      address: user?.address,
    });
  }, [user]);

  console.log("hihi", items);

  const totalWeight = items.reduce(
    (sum, item) => sum + Number(item.weight) * item.quantity,
    0
  );

  const handleSubmit = async () => {
    if (!option) return alert("Vui lòng chọn phương thức thanh toán!");
    setLoading(true);

    const paymentMethod = option === "COD" ? "CASH" : "TRANSFER";

    const codAmount = option === "COD" ? total : 0;

    const orderPayload = {
      status: "PENDING",
      note: note,
      customerId: user?.id,
      orderDetails: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shipping: {
        toName: user?.firstName + " " + user?.lastName,
        toPhone: phone,
        toAddress: address,
        toWardCode: "21211",
        toDistrictId: 1444,
        toWardName: "",
        toDistrictName: "",
        toProvinceName: "",
        serviceTypeId: 2,
        paymentTypeId: 1,
        requiredNote: "CHOTHUHANG",
        length: 20,
        width: 15,
        height: 10,
        weight: totalWeight,
        codAmount: codAmount,
        insuranceValue: 0,
        note: "",
      },
      paymentMethod,
    };

    console.log("AAA", orderPayload);

    try {
      await postOrder(orderPayload);
      messageApi.success("Đặt hàng thành công!");
      queryClient.invalidateQueries(["createOrder"]);
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
      {contextHolder}

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

      <div className="border-t mt-4 pt-3">
        <div className="flex justify-between text-sm font-medium">
          <span>Items ({items.length}):</span>
          <span>{total.toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className="flex justify-between text-sm font-medium mt-1">
          <span>Total Deposit:</span>
          <span>{(total / 2).toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className="border-t border-gray-200 my-2" />
        <div className="flex justify-between items-center mb-5">
          <span className="font-semibold text-base">Total:</span>
          <span className="text-green-600 font-bold text-lg">
            {total.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>
      </div>

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

        <div className="flex mt-5">
          <h1 className="w-[30%]">Nhập địa chỉ:</h1>
          <Form.Item
            className="w-[60%]"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input.TextArea onChange={(e) => setAddress(e.target.value)} />
          </Form.Item>
        </div>
      </Form>

      <div className="mt-5">
        <h1 className="font-semibold mb-2">Chọn phương thức thanh toán</h1>
        <Radio.Group onChange={(e) => setOption(e.target.value)} value={option}>
          <div className="flex flex-col gap-2">
            <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
            <Radio value="BANK_TRANSFER">Chuyển khoản / Thanh toán trước</Radio>
          </div>
        </Radio.Group>

        <h1 className="font-semibold mb-2">Ghi chú:</h1>
        <Input.TextArea
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        ></Input.TextArea>
      </div>

      {option === "BANK_TRANSFER" && (
        <div className="mt-5">
          <p className="font-semibold mb-2">Chọn ngân hàng thanh toán:</p>
          <Radio.Group
            onChange={(e) => setSelectedBank(e.target.value)}
            value={selectedBank}
            className="flex flex-wrap gap-3"
          >
            <Radio.Button value="VCB">Vietcombank</Radio.Button>
            <Radio.Button value="ACB">ACB</Radio.Button>
            <Radio.Button value="TPB">TPBank</Radio.Button>
            <Radio.Button value="MBB">MB Bank</Radio.Button>
            <Radio.Button value="VPB">VPBank</Radio.Button>
          </Radio.Group>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => {
            setLoading(false); // reset
            isCancel();
          }}
          className="flex-1 py-2 rounded-xl border border-pink-500 cursor-pointer text-pink-600 font-semibold hover:bg-pink-50 transition"
        >
          Hủy
        </button>

        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={!option}
          className="flex-1! py-2! rounded-xl! text-white! bg-pink-500! hover:bg-pink-600!"
        >
          Đặt hàng
        </Button>
      </div>
    </Modal>
  );
};

export default BuyModal;
