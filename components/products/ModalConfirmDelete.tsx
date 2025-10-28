import { useDeleteProduct } from "@/services/product/deleteProduct/hooks";
import { ProductAdmin } from "@/services/product/getProduct/type";
import { useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import Image from "next/image";
import React from "react";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import { TriangleAlert } from "lucide-react";

interface ModalConfirmDeleteProps {
  initialState?: ProductAdmin | null;
  onOpen: boolean;
  onCancel: () => void;
}
export const ModalConfirmDelete = ({
  initialState,
  onOpen,
  onCancel,
}: ModalConfirmDeleteProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const handleDelete = async () => {
    try {
      await deleteProduct({ id: initialState?.id });
      messageApi.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries(["allProductAdmin"]);
      onCancel();
    } catch (err) {
      messageApi.error("Có lỗi khi xóa sản phẩm!");
      console.error(err);
    }
  };

  console.log("first", initialState);

  return (
    <Modal
      open={onOpen}
      onCancel={onCancel}
      footer={
        <Button
          onClick={handleDelete}
          className="!bg-pink-500 hover:!bg-pink-600 !text-white"
        >
          Xóa
        </Button>
      }
    >
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
      <div className="w-full">
        <div className="w-[80%] m-auto h-[1px] mt-3 mb-3 bg-gray-400"></div>
        <h1 className="flex items-center gap-2 justify-center text-[#dbc900] text-2xl mb-2 font-medium">
          <TriangleAlert color="#dbc900" size={28} />
          Warning!
        </h1>
        <p className="flex justify-center text-[18px] font-medium">
          Bạn có chắc muốn xóa ?
        </p>
        <div className="flex justify-center items-center w-full py-4">
          <Image
            src={initialState?.images?.[0]?.imageUrl || ""}
            alt={initialState?.name || "Product image"}
            width={240}
            height={240}
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmDelete;
