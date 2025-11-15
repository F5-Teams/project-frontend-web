"use client";
import { motion } from "framer-motion";
import { useAllProductAdmin } from "@/services/product/getProduct/hooks";
import { ProductAdmin } from "@/services/product/getProduct/type";
import { Select, Spin } from "antd";
import { Calendar, Package, PencilOff, Search, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ModalProduct } from "@/components/products/ModalProduct";
import ModalConfirmDelete from "@/components/products/ModalConfirmDelete";

interface ProductCardProps {
  productAdmin: ProductAdmin;
  onOpen: (product: ProductAdmin) => void;
  cancel?: () => void;
  onDelete: (product: ProductAdmin) => void;
}

const ProductCard = ({ productAdmin, onOpen, onDelete }: ProductCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % productAdmin.images.length);

  const prevImage = () =>
    setCurrentImage((prev) =>
      prev === 0 ? productAdmin.images.length - 1 : prev - 1
    );

  const handleOpen = (value: ProductAdmin) => {
    onOpen(value);
  };

  const handleDelete = (value: ProductAdmin) => {
    onDelete(value);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-100"
    >
      <div className="relative h-64 w-full bg-gray-50">
        <Image
          src={productAdmin.images[currentImage]?.imageUrl}
          alt={productAdmin.images[currentImage]?.imageUrl || "Product image"}
          width={400}
          height={256}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs px-3 py-1 rounded-full shadow">
          {productAdmin.type || "Không xác định"}
        </div>

        {productAdmin.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/60 transition"
            >
              &lt;
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/60 transition"
            >
              &gt;
            </button>
          </>
        )}
      </div>

      <div className="p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate flex items-center gap-2">
            {productAdmin.name}
          </h3>

          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {productAdmin.description || "Không có mô tả"}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-pink-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(productAdmin.price))}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                (productAdmin.stocks ?? 0) > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {productAdmin.stocks > 0
                ? `Còn ${productAdmin.stocks}`
                : "Hết hàng"}
            </span>
          </div>

          {productAdmin.note && (
            <div className="mt-2 text-sm text-gray-500 italic border-l-4 border-pink-200 pl-3">
              Ghi chú: {productAdmin.note}
            </div>
          )}

          {productAdmin.createAt && (
            <p className="flex items-center gap-1 text-xs text-gray-400 mt-3">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(productAdmin.createAt).toLocaleDateString("vi-VN")}
            </p>
          )}
        </div>

        {productAdmin.orderDetails?.length > 0 && (
          <details className="bg-pink-50 rounded-lg p-2 mt-4 text-sm">
            <summary className="cursor-pointer font-semibold text-pink-700 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Đơn hàng ({productAdmin.orderDetails.length})
            </summary>
            <ul className="list-disc ml-5 mt-2 text-gray-700">
              {productAdmin.orderDetails.map((order, i) => (
                <li key={i}>
                  <span className="font-medium">Mã đơn:</span> {order.id} –{" "}
                  <span className="font-medium">SL:</span> {order.quantity}
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => {
              handleDelete(productAdmin);
            }}
            className="flex items-center cursor-pointer justify-center gap-2 w-full py-2 rounded-lg text-white bg-gradient-to-r from-rose-500 to-red-500 hover:opacity-90 transition font-medium shadow"
          >
            <Trash className="w-5 h-5" /> Xóa
          </button>
          <button
            onClick={() => {
              handleOpen(productAdmin);
            }}
            className="flex items-center cursor-pointer justify-center gap-2 w-full py-2 rounded-lg text-white bg-gradient-to-r from-teal-400 to-teal-400 hover:opacity-90 transition font-medium shadow"
          >
            <PencilOff className="w-5 h-5" /> Cập nhật
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const { data: products = [], isLoading, error } = useAllProductAdmin();
  const [type, setType] = useState<string[]>([]);
  const [select, setSelect] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [choose, setChoose] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductAdmin | null>(
    null
  );

  const [selectedProductDelete, setSelectedProductDelete] =
    useState<ProductAdmin | null>(null);

  useEffect(() => {
    if (products.length > 0) {
      const filterType = Array.from(new Set(products.map((item) => item.type)));
      setType(filterType);
    }
  }, [products]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Lỗi tải sản phẩm
      </div>
    );

  const filteredProduct = products
    .filter((p) => (select === "All" ? true : p.type === select))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (value: ProductAdmin) => {
    setOpenDelete(true);
    setSelectedProductDelete(value);
  };

  return (
    <div>
      <div className="flex justify-between"></div>

      <div className="flex justify-between gap-2.5 px-10 mt-5">
        <h1 className="text-xl font-bold tracking-tight text-gray-800">
          Danh sách sản phẩm
        </h1>
        <div className="flex gap-2.5">
          <button
            onClick={() => {
              setSelectedProduct(null);
              setOpen(true);
            }}
            className="cursor-pointer bg-pink-500 text-white px-3 hover:bg-pink-600 py-1 rounded-2xl"
          >
            +Thêm sản phẩm
          </button>

          <div className="flex relative">
            <button
              onClick={() => setChoose(!choose)}
              className="flex items-center gap-1 cursor-pointer bg-pink-100 hover:bg-pink-200 
               text-pink-700 font-medium px-4 py-2 rounded-full text-sm shadow-sm"
            >
              <svg
                className={`w-6 h-8 transition-transform duration-200 ${
                  choose ? "rotate-360" : "rotate-270"
                }`}
                viewBox="0 0 24 24"
                fill="#ec4899"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
              Bộ lọc
            </button>

            {choose && (
              <div className="absolute right-0 mt-15 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-3 z-10">
                <p className="text-gray-600 text-sm font-medium">
                  Loại sản phẩm
                </p>
                <Select
                  value={select}
                  onChange={(value) => setSelect(value)}
                  style={{ width: "100%" }}
                  options={[
                    { label: "Tất cả", value: "All" },
                    ...type.map((t) => ({
                      label: t || "Không xác định",
                      value: t,
                    })),
                  ]}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm sản phẩm ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 text-sm rounded-full pl-9 pr-4 py-2.5 
                       focus:outline-none focus:ring-2 focus:ring-pink-400 w-64"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProduct.map((p) => (
          <ProductCard
            key={p.id}
            productAdmin={p}
            onDelete={(product) => {
              handleDelete(product);
            }}
            onOpen={(product) => {
              setSelectedProduct(product);
              setOpen(true);
            }}
            cancel={() => setOpen(false)}
          />
        ))}
      </div>

      <ModalProduct
        onOpen={open}
        cancel={() => setOpen(false)}
        initialState={selectedProduct}
        mode={selectedProduct ? "edit" : "add"}
      />

      <ModalConfirmDelete
        onOpen={openDelete}
        onCancel={() => setOpenDelete(false)}
        initialState={selectedProductDelete}
      />
    </div>
  );
};

export default Products;
