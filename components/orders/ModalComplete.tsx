"use client";

import { Modal, Form, Input, Button, Upload, message, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Order } from "@/services/orders/getAllOrder/type";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import { usePutGhnDelivered } from "@/services/orders/putGhnDelivered/hooks";
import { toast } from "sonner";
import { usePutGhnStatus } from "@/services/orders/putGhnStatus/hooks";
import { usePatchOrder } from "@/services/orders/patchOrder/hooks";

interface ModalCompleteProps {
  open: boolean;
  onClose: () => void;
  order?: Order;
}

const ModalComplete: React.FC<ModalCompleteProps> = ({
  open,
  onClose,
  order,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const putGhnDeliveredMutation = usePutGhnDelivered();
  const putGhnStatusMutation = usePutGhnStatus();
  const patchOrderMutation = usePatchOrder();
  const queryClient = useQueryClient();
  const [option, setOption] = useState<string>();
  useEffect(() => {
    if (order?.shipping?.images) {
      form.setFieldsValue({
        images: order.shipping.images.map((img: any, idx: number) => ({
          uid: `${idx}`,
          name: `image-${idx}`,
          status: "done",
          url: img.imageUrl,
        })),
      });
    }
  }, [order, form]);

  const handleFinish = async (values: any) => {
    if (!order) return;
    setLoading(true);

    if (option === "success") {
      const file = values.images?.[0]?.originFileObj;
      if (!file) {
        message.error("Vui lòng chọn ảnh mới để xác nhận giao hàng!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("deliveryProofImage", file);

      putGhnDeliveredMutation.mutate(
        { id: order.id, body: formData },
        {
          onSuccess: () => {
            toast.success("Đơn hàng đã giao thành công!");
            form.resetFields();
            onClose();
            queryClient.invalidateQueries(["getAllOrder"]);
          },
          onError: (err) => {
            console.log("Error SUCCESS:", err);
          },
          onSettled: () => setLoading(false),
        }
      );
    } else {
      const payloadFail = {
        status: "FAILED",
        failureReason: values.failed,
      };

      const payloadPatch = {
        status: "FAILED",
        note: order.note || "",
        customerId: order.customerId,

        shipping: {
          toName: order.shipping.toName,
          toPhone: order.shipping.toPhone,
          toAddress: order.shipping.toAddress,
          toWardCode: order.shipping.toWardCode,
          toDistrictId: order.shipping.toDistrictId,
          toWardName: order.shipping.toWardName,
          toDistrictName: order.shipping.toDistrictName,
          toProvinceName: order.shipping.toProvinceName,
          serviceTypeId: order.shipping.serviceTypeId,
          paymentTypeId: order.shipping.paymentTypeId,
          requiredNote: order.shipping.requiredNote,
          length: order.shipping.length,
          width: order.shipping.width,
          height: order.shipping.height,
          codAmount: Number(order.shipping.codAmount) || 0,
          insuranceValue: Number(order.shipping.insuranceValue) || 0,
          note: order.note || "",
          status: "FAILED",
        },

        paymentMethod: order.payment.paymentMethod,
        paymentStatus: "PAID",
        orderDetails: order.orderDetails.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      putGhnStatusMutation.mutate(
        { id: order.id, body: payloadFail },
        {
          onSuccess: () => {
            toast.error("Đơn hàng đã giao thất bại!");
            setTimeout(() => {
              form.resetFields();
              onClose();
              queryClient.invalidateQueries(["getAllOrder"]);
              setLoading(false);
            });
          },

          onError: (err) => {
            console.log("Error SUCCESS:", err);
          },
          onSettled: () => setLoading(false),
        }
      );

      patchOrderMutation.mutate({ id: order.id, body: payloadPatch });
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null}>
      <div className="text-lg font-bold flex items-center gap-3">
        <Image
          alt="Logo"
          src={Logo}
          className="object-contain"
          width={55}
          height={55}
          style={{ maxHeight: "56px" }}
        />
        <span className="text-pink-600">HappyPaws</span>
      </div>
      <div className="w-[80%] m-auto h-[1px] mt-3 mb-3 bg-gray-400"></div>

      <h1 className="flex justify-center text-xl font-medium mb-5">
        Hoàn thành đơn #{order?.id}
      </h1>

      <h1 className="font-medium text-[16px] text-[#595959]">
        Chọn trạng thái đơn hàng
      </h1>

      <Radio.Group onChange={(e) => setOption(e.target.value)}>
        <div className="flex flex-col gap-2.5">
          <Radio value={"success"}>Giao hàng thành công</Radio>
          <Radio value={"fail"}>Giao hàng thất bại</Radio>
        </div>
      </Radio.Group>

      {option === "success" ? (
        <div className="mt-5">
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              name="images"
              label="Hình ảnh giao hàng"
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : e && e.fileList
              }
              rules={[
                { required: true, message: "Vui lòng tải lên hình ảnh!" },
              ]}
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<UploadOutlined />}>Tải hình lên</Button>
              </Upload>
            </Form.Item>

            <div className="flex justify-between">
              <div></div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-pink-500! hover:bg-pink-600! "
                  loading={loading}
                >
                  Xác nhận
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      ) : (
        <>
          <div className="mt-5">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                name={"failed"}
                label={"Lý do giao hàng thất bại"}
                rules={[
                  {
                    required: true,
                    min: 10,
                    message: "Lý do phải ít nhất 10 ký tự!",
                  },
                ]}
              >
                <Input.TextArea rows={3} placeholder="Điền lý do" />
              </Form.Item>

              <div className="flex justify-between">
                <div></div>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-pink-500! hover:bg-pink-600! "
                    loading={loading}
                  >
                    Xác nhận
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalComplete;
