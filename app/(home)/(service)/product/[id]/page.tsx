"use client";

import BuyModal from "@/components/shopping/BuyModal";
import { useGetProductPublicId } from "@/services/product/getProductPublicId/hooks";
import { useProductCartStore } from "@/stores/productCart.store";
import { ArrowLeftToLine } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const ProductIdPage = () => {
  const params = useParams();
  const id = params?.id ? Number(params.id) : undefined;
  const router = useRouter();
  const addProduct = useProductCartStore((state) => state.addProduct);
  const clearCart = useProductCartStore((state) => state.clearCart);
  const [openBuy, setOpenBuy] = useState(false);
  const { data } = useGetProductPublicId(id);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = data?.images || [];
  const maxStock = data?.stocks ?? 0;

  const nextImage = () =>
    setCurrentImage((prev) => (images.length ? (prev + 1) % images.length : 0));

  const prevImage = () =>
    setCurrentImage((prev) =>
      images.length ? (prev === 0 ? images.length - 1 : prev - 1) : 0
    );

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(maxStock, prev + 1));
  };

  if (!data)
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        Đang tải thông tin sản phẩm...
      </div>
    );

  const totalPrice = data?.price * quantity;

  return (
    <div className="pb-20">
      <div
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 cursor-pointer px-20 py-6 hover:text-pink-500 transition"
      >
        <ArrowLeftToLine size={20} />
        <h1 className="hover:underline text-base font-medium">Quay lại</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 bg-white w-[80%] m-auto rounded-2xl mb-10 p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative flex-1 h-[400px] overflow-hidden rounded-2xl border">
          <Image
            src={images[currentImage]?.imageUrl || "/placeholder.svg"}
            alt={data?.name || "Sản phẩm"}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60 transition"
              >
                &lt;
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60 transition"
              >
                &gt;
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {currentImage + 1} / {images.length}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-medium text-pink-600 mb-3">
              {data?.name}
            </h1>
            <p className="text-gray-600 mb-5">{data?.description}</p>

            <div className="flex flex-col gap-3 text-lg">
              <p>
                <span className="font-medium">Giá:</span>{" "}
                <span className="text-pink-600 font-bold text-2xl">
                  {Number(data?.price).toLocaleString("vi-VN")}đ
                </span>
              </p>
              <p>
                <span className="font-medium">Loại:</span> {data?.type}
              </p>
              <p>
                <span className="font-medium">Số lượng còn:</span>{" "}
                <span
                  className={`${
                    maxStock > 5
                      ? "text-green-600"
                      : maxStock > 0
                      ? "text-yellow-500"
                      : "text-red-500"
                  } font-medium`}
                >
                  {maxStock}
                </span>
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="font-medium text-lg">Số lượng:</span>
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className={`px-4 py-2 text-lg font-bold ${
                    quantity <= 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition`}
                >
                  −
                </button>
                <span className="px-6 text-lg font-medium select-none">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  disabled={quantity >= maxStock}
                  className={`px-4 py-2 text-lg font-bold ${
                    quantity >= maxStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition`}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <p className="mt-2">
            <span className="font-medium">Tổng giá:</span>{" "}
            <span className="text-pink-600 font-bold text-2xl">
              {totalPrice.toLocaleString("vi-VN")}đ
            </span>
          </p>

          <div className="flex gap-2">
            <button
              disabled={maxStock === 0}
              onClick={() => {
                addProduct({
                  productId: data.id,
                  name: data.name,
                  price: Number(data.price),
                  quantity,
                  imageUrl: data.images?.[0]?.imageUrl,
                });
              }}
              className={`mt-8 py-3 rounded-xl w-full cursor-pointer font-medium transition px-2 border-1 ${
                maxStock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#f8daef] hover:bg-[#f5bee4] text-pink-600"
              }`}
            >
              {maxStock === 0 ? "Hết hàng" : `Thêm ${quantity} sản phẩm`}
            </button>

            <button
              onClick={() => {
                setOpenBuy(true);
              }}
              disabled={maxStock === 0}
              className={`mt-8 py-3 rounded-xl w-[100%] cursor-pointer font-medium transition px-2 ${
                maxStock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              }`}
            >
              {maxStock === 0 ? "Hết hàng" : `Đặt ${quantity} sản phẩm `}
            </button>
          </div>
        </div>
      </div>

      <BuyModal
        isOpen={openBuy}
        isCancel={() => setOpenBuy(false)}
        clearCart={clearCart}
        items={[
          {
            productId: data.id,
            name: data.name,
            price: Number(data.price),
            quantity,
            weight: data.weight,
            imageUrl: data.images?.[0]?.imageUrl || "",
          },
        ]}
      />
    </div>
  );
};

export default ProductIdPage;
