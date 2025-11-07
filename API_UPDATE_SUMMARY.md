# Cập Nhật API Checkout Modal - Tóm Tắt Thay Đổi

## Tổng Quan

Cập nhật CheckoutModal để gửi request đúng với định dạng mới của BE endpoint `POST /bookings/bulk`.

## Chi Tiết Thay Đổi

### 1. **services/booking/api.ts**

- ✅ Cập nhật interface `BulkBookingRequest` để thêm field `paymentMethod` ở level top
- ✅ `paymentMethod` có thể là `"WALLET"` (thanh toán bằng ví - ngay lập tức trừ tiền) hoặc `"CASH"` (thanh toán khi đến - chưa xác nhận)

**Cấu trúc request mới:**

```typescript
{
  paymentMethod: "WALLET" | "CASH",
  bookings: [
    {
      type: "SPA" | "HOTEL",
      petId: number,
      bookingDate: string,
      note: string,
      dropDownSlot: string,
      // Cho SPA Combo
      comboId?: number,
      // Cho Custom SPA
      serviceIds?: number[],
      // Cho HOTEL
      roomId?: number,
      startDate?: string,
      endDate?: string,
    }
  ]
}
```

### 2. **components/cart/CheckoutModal.tsx**

- ✅ Cập nhật logic `handleCheckout()` để tạo object request với `paymentMethod`
- ✅ Ánh xạ các lựa chọn thanh toán sang định dạng BE:
  - `"wallet"` → `"WALLET"`
  - `"cash"` → `"CASH"`
  - `"bank_transfer"` → `"CASH"` (xử lý thông qua nhân viên)
- ✅ Cập nhật UI Payment Method Selection:
  - Thêm option **Ví điện tử** (WALLET) - mới
  - Giữ **Chuyển khoản ngân hàng** (Bank Transfer)
  - Giữ **Thanh toán khi đến cửa hàng** (Cash)

## Quy Trình Hoạt Động

### Khi người dùng chọn thanh toán bằng Ví (WALLET):

1. Ví của user sẽ được **trừ tiền ngay lập tức**
2. Booking được **xác nhận tự động**
3. Hiển thị thông báo thành công

### Khi người dùng chọn thanh toán bằng Tiền mặt hoặc Chuyển khoản (CASH):

1. Booking được tạo với trạng thái **"Pending"**
2. Đợi **xác nhận của nhân viên**
3. Sau khi nhân viên xác nhận, tiền sẽ được trừ

## JSON Request Example

### Ví Dụ 1: Booking SPA + Hotel bằng Ví

```json
{
  "paymentMethod": "WALLET",
  "bookings": [
    {
      "type": "SPA",
      "petId": 1,
      "bookingDate": "2025-01-15T10:00:00Z",
      "note": "Làm sạch lông và cắt móng",
      "dropDownSlot": "MORNING",
      "comboId": 1
    },
    {
      "type": "HOTEL",
      "petId": 1,
      "bookingDate": "2025-01-15T10:00:00Z",
      "note": "Phòng VIP",
      "dropDownSlot": "MORNING",
      "roomId": 1,
      "startDate": "2025-01-15T10:00:00Z",
      "endDate": "2025-01-16T10:00:00Z"
    }
  ]
}
```

### Ví Dụ 2: Booking SPA Custom bằng Tiền mặt

```json
{
  "paymentMethod": "CASH",
  "bookings": [
    {
      "type": "SPA",
      "petId": 1,
      "bookingDate": "2025-01-20T14:00:00Z",
      "note": "Ghi chú thêm từ khách",
      "dropDownSlot": "AFTERNOON",
      "serviceIds": [1, 2, 3]
    }
  ]
}
```

## Response Format

```json
{
  "success": true,
  "createdCount": 2,
  "bookingIds": [123, 124],
  "errors": ["Error message 1", "Error message 2"]
}
```

## Cải Tiến UI/UX

- ✅ Thêm option thanh toán bằng ví với icon rõ ràng
- ✅ Hiển thị 3 phương thức thanh toán theo ưu tiên:
  1. Ví điện tử (nhanh, xác nhận tức thì)
  2. Chuyển khoản ngân hàng (an toàn)
  3. Thanh toán khi đến (linh hoạt)

## Note

- Tất cả booking sẽ được gửi trong một request duy nhất
- Cùng một phương thức thanh toán cho tất cả items
- BE sẽ xử lý từng booking riêng biệt nhưng apply payment theo method chung
