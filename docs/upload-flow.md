# Quy trình upload ảnh/video lên Cloudinary

Tài liệu này tổng hợp cách phần frontend hiện tại nhận tệp từ thiết bị người dùng, tải chúng lên Cloudinary và gửi URL về backend. Bên mobile/app có thể tái sử dụng nguyên tắc tương tự để đồng bộ hành vi.

## 1. Tiện ích trung tâm `uploadFile`

- Nằm tại `utils/uploadFIle.ts`, gói toàn bộ logic gửi tệp trực tiếp lên Cloudinary qua REST API.
- Tự nhận diện loại tài nguyên dựa trên đuôi file (`image`, `video`, hoặc `raw` dự phòng).
- Gửi `FormData` gồm trường `file` và `upload_preset` cố định (`CarePet`) đến Cloudinary cloud `dfgw9wvjy`.
- Trả về `{ url, format, resourceType }`, trong đó `url` là `secure_url` Cloudinary dùng để lưu vào backend.

```12:28:utils/uploadFIle.ts
export const uploadFile = async (file) => {
  const resourceType = getResourceType(file);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "CarePet");
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/dfgw9wvjy/${resourceType}/upload`,
    formData
  );
  return {
    url: res.data.secure_url,
    format: res.data.format,
    resourceType,
  };
};
```

> **Lưu ý cấu hình:** Cloud name (`dfgw9wvjy`) và upload preset (`CarePet`) phải tồn tại trên Cloudinary, được set ở tab *Settings → Upload*.

## 2. Các điểm tích hợp chính

**2.1. Quản lý sản phẩm (`ModalProduct`)**

- Sử dụng `Upload` của Ant Design để lấy file từ người dùng.
- Với file mới (`originFileObj`), gọi `uploadFile`, nhận về `url` và ghép thành payload.
- Backend nhận payload `images` hoặc `addImages` với dạng `{ imageUrl: string }`.

```69:109:components/products/ModalProduct.tsx
const uploadedImages = await Promise.all(
  newImageFiles.map(async (fileObj: any) => {
    const uploaded = await uploadFile(fileObj.originFileObj);
    return { imageUrl: uploaded.url };
  })
);
// ...
const payloadPost = {
  // ...
  images: uploadedImages,
};
const payloadPatch = {
  // ...
  addImages: uploadedImages,
};
```

**2.2. Upload nhật ký dịch vụ Groomer (`StartServicePanel`)**

- Nhận nhiều ảnh qua `<input type="file" multiple>`.
- Lặp từng file, gọi `uploadFile`, gom `secure_url` vào `imageUrls`.
- Gửi `PUT /groomer/my-bookings/{id}/photos` với payload `{ imageUrls, imageType, note }`.

```63:76:components/groomer/dashboard/StartServicePanel.tsx
const uploadedUrls: string[] = [];
for (const f of files) {
  const res = await uploadFile(f);
  uploadedUrls.push(res.url);
}
const payload: UploadBookingPhotosPayload = {
  imageUrls: uploadedUrls,
  imageType,
  note: note || undefined,
};
await uploadMutation.mutateAsync({ bookingId, payload });
```

**2.3. Tạo hồ sơ thú cưng (`profile-pet/create-pet`)**

- Cho phép chọn nhiều ảnh, tạo preview địa phương, sau đó upload lên Cloudinary.
- Kết quả chuyển sang backend dạng `{ images: [{ imageUrl, type }] }`.

```75:98:app/profile-pet/create-pet/page.tsx
const uploadedImages: PetImage[] = await Promise.all(
  form.images.map(async (file) => {
    const uploaded = await uploadFile(file);
    return { imageUrl: uploaded.url, type: "cover" };
  })
);
const payload = {
  // ...
  images: uploadedImages,
};
await api.post(`/pet/user/${userId}`, payload);
```

## 3. Chuẩn hoá quy trình cho mobile/app

1. Lấy `File` hoặc `Blob` từ thiết bị người dùng (camera, gallery...).
2. Gọi cùng endpoint Cloudinary:
   - `POST https://api.cloudinary.com/v1_1/dfgw9wvjy/{resourceType}/upload`
   - Body `FormData`: `file`, `upload_preset=CarePet`.
3. Nhận `secure_url` từ response.
4. Gửi URL đó về backend:
   - Nếu backend mong chờ thêm metadata (ví dụ `imageType`, `note`, `type`), đảm bảo map chính xác như frontend web.
5. Backend lưu chuỗi URL, tái sử dụng cho client khác (web, app) hiển thị lại từ Cloudinary.

> **Gợi ý tái sử dụng:** App có thể sao chép nguyên hàm `uploadFile` (chỉ cần axios/fetch) hoặc dùng SDK chính thức của Cloudinary. Yêu cầu duy nhất là giữ nguyên `upload_preset` và `cloud_name`.

## 4. Kiểm thử đề xuất

- Dùng devtools hoặc proxy (ví dụ Charles) để xác nhận request Cloudinary trả `200` và chứa `secure_url`.
- Với staging backend, tạo sản phẩm/thú cưng/ảnh dịch vụ, kiểm tra trong CSDL hoặc API trả về URL Cloudinary đúng.
- App team nên viết integration test đảm bảo khi Cloudinary thất bại thì hiển thị lỗi tương ứng (frontend hiện dùng toast/message).

--- 

Nếu cần chia sẻ code tái sử dụng, có thể copy `uploadFile` sang package chung hoặc tách thành SDK nội bộ, chỉ cần cấu hình lại `upload_preset` thông qua biến môi trường (`process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`).

