/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { usePostOrderCancel } from "@/services/orders/postOrderCancel/hooks";
import { usePostProductErr } from "@/services/orders/postProductErr/hooks";

const OrderPage = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { data: orderResponse } = useGetAllOrder();
  const allOrder = orderResponse?.data || [];
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const queryClient = useQueryClient();
  const { mutate: postOrderGhn } = usePostOrderGhn();
  const { mutate: postOrderGhnCancel } = usePostOrderGhnCancel();
  const { mutate: deleteOrder } = useDeleteOrder();
  const { mutate: postOrderCancel } = usePostOrderCancel();
  const { mutate: postProductErr } = usePostProductErr();
  const handleApprove = async (order: Order) => {
    const orderId = order.id;

    const body = {
      status: "APPROVED" as const,
    };

    console.log("PAY", body);

    try {
      await patchOrder({ id: orderId, body });
      toast.success("Duyệt đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["getAllOrder"] });
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
            await patchOrder({
              id: order.id,
              body: { status: "SHIPPING" as const },
            });
            queryClient.invalidateQueries({ queryKey: ["getAllOrder"] });
            return res.ghnOrderCode || res.id;
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

  const handleInternalShipping = async (order: Order) => {
    try {
      await patchOrder({ id: order.id, body: { status: "SHIPPING" as const } });
      toast.success("Đơn hàng đã chuyển sang giao hàng nội bộ!");
      queryClient.invalidateQueries({ queryKey: ["getAllOrder"] });
    } catch (error) {
      toast.error("Cập nhật thất bại!");
      console.log(error);
    }
  };

  const handleCancelGHN = (order: Order) => {
    postOrderGhnCancel(order.id, {
      onSuccess: async () => {
        try {
          toast.success(
            "Hủy vận đơn thành công! Đơn chuyển về trạng thái ĐÃ DUYỆT."
          );
          queryClient.invalidateQueries({ queryKey: ["getAllOrder"] });
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
        queryClient.invalidateQueries({ queryKey: ["getAllOrder"] });
      },
      onError: () => toast.error("Xóa đơn hàng thất bại!"),
      onSettled: () => setLoadingDelete(false),
    });
  };

  const handleComplete = async () => {
    setOpenComplete(true);
  };

  const handleCancel = (order: Order) => {
    postOrderCancel(
      { id: order.id, customerId: order.customerId },
      {
        onSuccess: async () => {
          try {
            const body = {
              status: "REFUND" as const,
            };
            await patchOrder({ id: order.id, body });
            toast.success("Hoàn tiền và cập nhật đơn thành công!");
            queryClient.invalidateQueries({ queryKey: ["getAllOrder"] });
          } catch (err) {
            toast.error("Cập nhật trạng thái đơn thất bại!");
            console.log(err);
          }
        },
        onError: () => toast.error("Hoàn tiền thất bại!"),
        onSettled: () => setLoadingDelete(false),
      }
    );
  };

  const handleVoucher = (order: Order) => {
    const payload = {
      body: {
        orderId: order.id,
        customerId: order.customerId,
        description: "ghi nhận thành công",
      },
    };

    postProductErr(payload, {
      onSuccess: async () => {
        try {
          const body = {
            status: "REFUND_DONE" as const,
          };

          await patchOrder({ id: order.id, body });
          toast.success("Hoàn tiền và cập nhật đơn thành công!");
          queryClient.invalidateQueries({ queryKey: ["getAllOrder"] });
        } catch (err) {
          toast.error("Cập nhật trạng thái đơn thất bại!");
          console.log(err);
        }
      },
    });
  };

  const getPaymentLabel = (method?: string) => {
    switch (method) {
      case "CASH":
        return "Tiền mặt";
      case "WALLET":
        return "Thanh toán qua Ví";
      case "VNPAY":
        return "Thanh toán VNPAY";
      case "MOMO":
        return "Thanh toán MOMO";
      default:
        return "Không xác định";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "PAID":
        return "Chờ duyệt";
      case "ON_PROGRESSING":
        return "Đơn sắp hủy";
      case "APPROVED":
        return "Đã duyệt";
      case "SHIPPING":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      case "FAILED":
        return "Thất bại";
      case "REFUND":
        return "Hoàn tiền";
      case "REFUND_DONE":
        return "Trả hàng/Hoàn tiền";
      default:
        return status;
    }
  };

  console.log("Order Response:", orderResponse);

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
      render: (customer: { firstName: string; lastName: string } | null) =>
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
      render: (arr: Array<unknown>) => <Tag color="blue">{arr.length} món</Tag>,
    },
    {
      title: "Tổng tiền",
      width: 120,
      render: (_: any, record: Order) => {
        const amount = record.payment?.totalAmount ?? 0;
        return (
          <span className="font-semibold text-pink-600">
            {Number(amount).toLocaleString("vi-VN")} đ
          </span>
        );
      },
    },

    {
      title: "Thanh toán",
      dataIndex: "payment",
      render: (pay: any) => {
        if (!pay) return <Tag>Chưa thanh toán</Tag>;
        const method = pay.paymentMethod?.name || pay.paymentMethod;
        return (
          <Tag color={method === "CASH" ? "purple" : "green"}>
            {getPaymentLabel(method)}
          </Tag>
        );
      },
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
            s === "PAID"
              ? "orange"
              : s === "APPROVED"
              ? "blue"
              : s === "SHIPPING"
              ? "cyan"
              : s === "COMPLETED"
              ? "green"
              : s === "REFUND"
              ? "yellow"
              : s === "PENDING"
              ? "orange"
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
      render: (_: unknown, record: Order) => (
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

          {(record.status === "PENDING" || record.status === "PAID") && (
            <Button
              type="primary"
              size="small"
              className="bg-pink-500! hover:bg-pink-600!"
              onClick={() => handleApprove(record)}
            >
              Duyệt
            </Button>
          )}

          {record.status === "APPROVED" &&
            record.shipping?.provider !== "INTERNAL" && (
              <Button
                type="default"
                size="small"
                className="bg-[#5ecdf1]! text-white! hover:bg-[#3ebbe5]!"
                onClick={() => handleCreateGHN(record)}
              >
                Tạo vận đơn GHN
              </Button>
            )}

          {record.status === "APPROVED" &&
            record.shipping?.provider === "INTERNAL" && (
              <Button
                type="default"
                size="small"
                className="bg-purple-500! text-white! hover:bg-purple-600!"
                onClick={() => handleInternalShipping(record)}
              >
                Giao hàng nội bộ
              </Button>
            )}

          {record.status === "SHIPPING" && (
            <>
              {/* <Button
                className="bg-[#f15e6a]! text-white! hover:bg-[#dd3744]!"
                danger
                size="small"
                onClick={() => handleCancelGHN(record)}
              >
                Hủy vận đơn
              </Button> */}
              <Button
                className="bg-[#47c7a0]! text-white! hover:bg-[#25b68b]!"
                type="primary"
                size="small"
                onClick={() => {
                  setSelectedOrder(record);
                  handleComplete();
                }}
              >
                Xác nhận
              </Button>
            </>
          )}

          {record.status === "FAILED" &&
            (record.payment?.paymentMethod === "CASH" ? (
              <Button
                className="bg-pink-500! text-white! hover:bg-pink-600!"
                danger
                size="small"
                onClick={() => handleVoucher(record)}
              >
                Ghi nhận
              </Button>
            ) : (
              <Button
                className="bg-[#f15e6a]! text-white! hover:bg-[#dd3744]!"
                danger
                size="small"
                onClick={() => handleCancel(record)}
              >
                Hoàn tiền
              </Button>
            ))}

          {record.status === "REFUND" && (
            <>
              <Button
                className="bg-pink-500! text-white! hover:bg-pink-600!"
                danger
                size="small"
                onClick={() => handleVoucher(record)}
              >
                Tặng voucher
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
        dataSource={allOrder}
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
