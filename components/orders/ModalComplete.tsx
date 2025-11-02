"use client";

import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Order } from "@/services/orders/getAllOrder/type";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import { uploadFile } from "@/utils/uploadFIle";

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
  const queryClient = useQueryClient();

  // Nếu order đã có ảnh (tuỳ thuộc backend), map sang format của Upload
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
    if (!values.images || values.images.length === 0) {
      message.error("Vui lòng tải lên hình ảnh giao hàng!");
      return;
    }

    setLoading(true);
    try {
      const newFiles = values.images.filter((img: any) => img.originFileObj);

      const uploadedImages = await Promise.all(
        newFiles.map(async (fileObj: any) => {
          const uploaded = await uploadFile(fileObj.originFileObj);
          return { imageUrl: uploaded.url };
        })
      );

      const oldImages = values.images.filter((img: any) => img.url);

      const allImages = [...oldImages, ...uploadedImages];

      const payload = {
        images: allImages,
        note: values.note,
      };

      console.log("LINK IMG CLOUD:", payload);

      // await patchOrder({ id: order.id, body: { status: "COMPLETED", note: values.note, images: allImages } });

      message.success("Cập nhật thành công!");
      form.resetFields();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Upload thất bại!");
    } finally {
      setLoading(false);
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
          <Upload listType="picture" beforeUpload={() => false} multiple>
            <Button icon={<UploadOutlined />}>Tải hình lên</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="note" label="Ghi chú (tuỳ chọn)">
          <Input.TextArea rows={3} placeholder="Nhập ghi chú..." />
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
