import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import { ProductAdmin } from "@/services/product/getProduct/type";
import { useForm } from "antd/es/form/Form";
import { useAllProductType } from "@/services/product/getProductType/hooks";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFile } from "@/utils/uploadFIle";
import { usePostProduct } from "@/services/product/postProduct/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { usePatchProduct } from "@/services/product/patchProduct/hooks";

interface ModalProductProps {
  initialState?: ProductAdmin | null;

  mode: "add" | "edit";

  onOpen: boolean;
  cancel?: () => void;
}

export const ModalProduct = ({
  initialState,
  onOpen,
  cancel,
  mode,
}: ModalProductProps) => {
  const [form] = useForm();
  const { data: productType = [] } = useAllProductType();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync: createProduct } = usePostProduct();
  const { mutateAsync: updateProduct } = usePatchProduct();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (initialState) {
      form.setFieldsValue({
        name: initialState.name,
        description: initialState.description,
        price: initialState.price,
        stocks: initialState.stocks,
        type: initialState.type,
        note: initialState.note,
        images: initialState.images
          ? initialState.images.map((img: any, index: number) => ({
              uid: `${index}`,
              name: `image-${index}.png`,
              status: "done",
              url: img.imageUrl,
            }))
          : [],
      });
    }
  }, [initialState, form]);

  const onSubmit = async () => {
    const value = await form.validateFields();
    setLoading(true);

    const oldImages = initialState?.images || [];

    const currentImages = value.images || [];

    const newImageFiles = currentImages.filter((img: any) => img.originFileObj);

    const uploadedImages = await Promise.all(
      newImageFiles.map(async (fileObj: any) => {
        const uploaded = await uploadFile(fileObj.originFileObj);
        return { imageUrl: uploaded.url };
      })
    );

    const remainingOldImages = currentImages
      .filter((img: any) => !img.originFileObj)
      .map((img: any) => {
        const found = oldImages.find((old) => old.imageUrl === img.url);
        return found ? { id: found.id, imageUrl: found.imageUrl } : null;
      })
      .filter(Boolean);

    const removeImageIds = oldImages
      .filter(
        (old) => !currentImages.some((cur: any) => cur.url === old.imageUrl)
      )
      .map((img) => img.id);

    const payloadPost = {
      name: value.name,
      description: value.description,
      price: Number(value.price),
      stocks: Number(value.stocks),
      type: value.type,
      note: value.note,
      images: uploadedImages,
    };

    const payloadPatch = {
      name: value.name,
      description: value.description,
      price: Number(value.price),
      stocks: Number(value.stocks),
      type: value.type,
      note: value.note,
      images: remainingOldImages,
      addImages: uploadedImages,
      removeImageIds,
    };

    try {
      if (initialState) {
        await updateProduct({ id: initialState.id, body: payloadPatch });
        messageApi.success("Cập nhật sản phẩm thành công!");
        queryClient.invalidateQueries(["patchProduct"]);
      } else {
        await createProduct(payloadPost);
        messageApi.success("Thêm sản phẩm thành công!");
        queryClient.invalidateQueries(["allProductAdmin"]);
      }
      setTimeout(() => {
        form.resetFields();
        cancel?.();
      }, 500);
    } catch (err) {
      message.error("Có lỗi khi thêm/cập nhật sản phẩm!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={onOpen}
      onCancel={cancel}
      footer={
        <Button
          loading={loading}
          onClick={onSubmit}
          className="!bg-pink-500 hover:!bg-pink-600 !text-white"
        >
          {mode === "add" ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
        </Button>
      }
    >
      {contextHolder}
      <div className="w-full">
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
        <h1 className="flex justify-center text-2xl mb-4 font-medium">
          Thêm sản phẩm
        </h1>
        <Form form={form} layout="vertical">
          <div className="flex gap-2 w-full">
            <Form.Item
              label="Nhập tên sản phẩm"
              className="flex-1"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input placeholder="Nhập sản phẩm..." />
            </Form.Item>

            <Form.Item
              label="Nhập mô tả sản phẩm"
              className="flex-1"
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
              ]}
            >
              <Input placeholder="Nhập mô tả sản phẩm..." />
            </Form.Item>
          </div>

          <div className="flex gap-2 w-full">
            <Form.Item
              label="Nhập giá sản phẩm"
              className="flex-1"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm" },
                { pattern: /^[0-9]+$/, message: "Giá phải là số" },
              ]}
            >
              <Input placeholder="Nhập giá sản phẩm..." />
            </Form.Item>

            <Form.Item
              label="Nhập tồn kho"
              className="flex-1"
              name="stocks"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng tồn kho" },
                { pattern: /^[0-9]+$/, message: "Tồn kho phải là số" },
              ]}
            >
              <Input placeholder="Nhập tồn kho..." />
            </Form.Item>
          </div>

          <div className="flex gap-2 w-full">
            <Form.Item
              label="Chọn loại sản phẩm"
              className="flex-1"
              name="type"
              rules={[
                { required: true, message: "Vui lòng chọn loại sản phẩm" },
              ]}
            >
              <Select
                placeholder="Chọn loại"
                options={productType.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Nhập ghi chú"
              className="flex-1"
              name="note"
              rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
            >
              <Input placeholder="Nhập ghi chú..." />
            </Form.Item>
          </div>

          <Form.Item
            label="Upload Photo"
            name="images"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[
              { required: true, message: "Vui lòng tải lên ít nhất một ảnh" },
            ]}
          >
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Upload photo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default Modal;
