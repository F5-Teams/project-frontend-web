"use client";

import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Order } from "@/services/orders/getAllOrder/type";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import { usePutGhnDelivered } from "@/services/orders/putGhnDelivered/hooks";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

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

    const file = values.images?.[0]?.originFileObj;
    if (!file) {
      message.error("Vui lòng chọn ảnh mới để xác nhận giao hàng!");
      return;
    }

    const formData = new FormData();
    formData.append("deliveryProofImage", file);

    setLoading(true);

    putGhnDeliveredMutation.mutate(
      { id: order.id, body: formData },
      {
        onSuccess: (res) => {
          toast.promise<{ name: string }>(
            () =>
              new Promise((resolve) =>
                setTimeout(() => resolve({ name: "Đơn đã" }), 500)
              ),
            {
              loading: "Loading...",
              success: (data) => `${data.name} hoàn thành!`,
              error: "Error",
            }
          );

          form.resetFields();
          onClose();
          queryClient.invalidateQueries(["getAllOrder"]);
        },
        onError: (err: any) => {
          console.log(err);
          messageApi.error("Lỗi!");
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null}>
      {contextHolder}
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

      <h1 className="flex justify-center text-xl font-medium">
        Hoàn thành đơn {order?.id}
      </h1>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="images"
          label="Hình ảnh giao hàng"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
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
              Xác nhận hoàn thành
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalComplete;
