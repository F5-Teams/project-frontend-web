"use client";

import { useGetAllOrder } from "@/services/orders/getAllOrder/hooks";
import { Button, Table, Tag } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { patchOrder } from "@/services/orders/patchOrder/api";
import { Order } from "@/services/orders/getAllOrder/type";
import { useQueryClient } from "@tanstack/react-query";
import { usePostOrderGhn } from "@/services/orders/postOrderGhn/hooks";
import { usePostOrderGhnCancel } from "@/services/orders/postOrderGhnCancel/hooks";
import ModalViewOrder from "@/components/orders/ModalViewOrder";
import ModalDeleteOrder from "@/components/orders/ModalDeleteOrder";
import { useDeleteOrder } from "@/services/orders/deleteOrder/hooks";
import ModalComplete from "@/components/orders/ModalComplete";
import { toast } from "sonner";

const OrderPage = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { data: allOrder } = useGetAllOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const queryClient = useQueryClient();
  const { mutate: postOrderGhn } = usePostOrderGhn();
  const { mutate: postOrderGhnCancel } = usePostOrderGhnCancel();
  const { mutate: deleteOrder } = useDeleteOrder();

  const handleApprove = async (order: Order) => {
    const orderId = order.id;
    const body = {
      status: "APPROVED",
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
        status: "PENDING",
      },

      paymentMethod: order.payment.paymentMethod,
      paymentStatus: "PENDING",
      orderDetails: order.orderDetails.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      await patchOrder({ id: orderId, body });
      toast.success("Duyệt đơn hàng thành công!");
      queryClient.invalidateQueries(["getAllOrder"]);
    } catch (error) {
      toast.error("Duyệt đơn thất bại!");
      console.log(error);
    }
  };

  const handleCreateGHN = (order: Order) => {
    postOrderGhn(order.id, {
      onSuccess: async (res) => {
        toast.promise(
          (async () => {
            await patchOrder({ id: order.id, body: { status: "SHIPPING" } });
            queryClient.invalidateQueries(["getAllOrder"]);
            return res.ghnOrderCode;
          })(),
          {
            loading: "Đang xử lý...",
            success: (code) => `Tạo vận đơn thành công! Mã GHN: ${code}`,
            error: "Tạo vận đơn thất bại",
          }
        );
      },
      onError: (err: any) => {
        console.log("GHN ERROR:", err);
        toast.error("Tạo vận đơn thất bại!");
      },
    });
  };

  const handleCancelGHN = (order: Order) => {
    postOrderGhnCancel(order.id, {
      onSuccess: async () => {
        try {
          await patchOrder({
            id: order.id,
            body: { status: "APPROVED" },
          });
          toast.success(
            "Hủy vận đơn thành công! Đơn chuyển về trạng thái ĐÃ DUYỆT."
          );
          queryClient.invalidateQueries(["getAllOrder"]);
        } catch (err) {
          toast.error(
            "Hủy vận đơn thành công nhưng cập nhật trạng thái thất bại!"
          );
        }
      },
      onError: () => {
        toast.error("Hủy vận đơn GHN thất bại!");
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedOrder) return;
    setLoadingDelete(true);

    deleteOrder(selectedOrder.id, {
      onSuccess: () => {
        toast.success("Xóa đơn hàng thành công!");
        setIsDeleteOpen(false);
        setSelectedOrder(undefined);
        queryClient.invalidateQueries(["getAllOrder"]);
      },
      onError: () => toast.error("Xóa đơn hàng thất bại!"),
      onSettled: () => setLoadingDelete(false),
    });
  };

  const handleComplete = async (value: Order) => {
    setOpenComplete(true);
  };

  const getPaymentLabel = (method?: string) => {
    switch (method) {
      case "CASH":
        return "Tiền mặt";
      case "TRANSFER":
        return "Thanh toán qua ví";
      default:
        return "Không xác định";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "SHIPPING":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const columns = [
    {
      width: 110,
      title: "Mã đơn",
      dataIndex: "id",
      render: (id: number) => <span className="font-semibold">#{id}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      width: 150,
      render: (customer: any) =>
        customer ? (
          <span className="font-medium">
            {customer.firstName} {customer.lastName}
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: "Số sản phẩm",
      width: 140,

      dataIndex: "orderDetails",
      render: (arr: any[]) => <Tag color="blue">{arr.length} món</Tag>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      width: 110,
      render: (p: string, record: Order) => (
        <span className="font-semibold text-pink-600">
          {(
            Number(p) + Number(record.shipping.shippingFee || 0)
          ).toLocaleString("vi-VN")}{" "}
          đ
        </span>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "payment",
      render: (pay: any) =>
        pay ? (
          <Tag color={pay.paymentMethod === "CASH" ? "purple" : "green"}>
            {getPaymentLabel(pay.paymentMethod)}
          </Tag>
        ) : (
          <Tag>Chưa thanh toán</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      width: 180,

      dataIndex: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string) => (
        <Tag
          color={
            s === "PENDING"
              ? "orange"
              : s === "APPROVED"
              ? "blue"
              : s === "SHIPPING"
              ? "cyan"
              : s === "COMPLETED"
              ? "green"
              : "red"
          }
        >
          {getStatusLabel(s)}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Order) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            size="small"
            onClick={() => {
              setIsDeleteOpen(true);
              setSelectedOrder(record);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-7 w-7"
          >
            <Trash2 color="red" className="h-3 w-3" />
          </Button>

          <Button
            type="text"
            size="small"
            className="hover:bg-gray-50 p-1 h-7 w-7"
            onClick={() => {
              setSelectedOrder(record);
              setIsViewOpen(true);
            }}
          >
            <Eye size="16" />
          </Button>

          {record.status === "PENDING" && (
            <Button
              type="primary"
              size="small"
              className="bg-pink-500! hover:bg-pink-600!"
              onClick={() => handleApprove(record)}
            >
              Duyệt
            </Button>
          )}

          {record.status === "APPROVED" && (
            <Button
              type="default"
              size="small"
              className="bg-[#5ecdf1]! text-white! hover:bg-[#3ebbe5]!"
              onClick={() => handleCreateGHN(record)}
            >
              Tạo vận đơn GHN
            </Button>
          )}

          {record.status === "SHIPPING" && (
            <>
              <Button
                className="bg-[#f15e6a]! text-white! hover:bg-[#dd3744]!"
                danger
                size="small"
                onClick={() => handleCancelGHN(record)}
              >
                Hủy vận đơn
              </Button>
              <Button
                className="bg-[#47c7a0]! text-white! hover:bg-[#25b68b]!"
                type="primary"
                size="small"
                onClick={() => {
                  handleComplete(record);
                  setSelectedOrder(record);
                }}
              >
                Hoàn thành
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4 text-gray-800">
        Danh sách đơn hàng
      </h1>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={allOrder || []}
        pagination={{ pageSize: 8 }}
      />

      <ModalViewOrder
        order={selectedOrder}
        open={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedOrder(undefined);
        }}
      />

      <ModalDeleteOrder
        open={isDeleteOpen}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedOrder(undefined);
        }}
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />

      <ModalComplete
        open={openComplete}
        onClose={() => setOpenComplete(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderPage;
