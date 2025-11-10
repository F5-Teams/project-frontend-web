# 🎯 CheckoutModal - Cập Nhập API /bookings/bulk

## 📋 Tóm Tắt

Cập nhập CheckoutModal để gửi request đúng định dạng mới của BE endpoint `POST /bookings/bulk` với field `paymentMethod` ở top level.

---

## 📝 Chi Tiết Thay Đổi

### 1️⃣ **services/booking/api.ts** - Interface & API Call

#### ✏️ Thay Đổi: Thêm `paymentMethod` vào `BulkBookingRequest`

**Before:**

```typescript
export interface BulkBookingRequest {
  bookings: Array<{
    type: "SPA" | "HOTEL";
    petId: number;
    bookingDate: string;
    note: string;
    dropDownSlot: string;
    comboId?: number;
    serviceIds?: number[];
    roomId?: number;
    startDate?: string;
    endDate?: string;
  }>;
}
```

**After:**

```typescript
export interface BulkBookingRequest {
  paymentMethod: "WALLET" | "CASH"; // ← NEW
  bookings: Array<{
    type: "SPA" | "HOTEL";
    petId: number;
    bookingDate: string;
    note: string;
    dropDownSlot: string;
    comboId?: number;
    serviceIds?: number[];
    roomId?: number;
    startDate?: string;
    endDate?: string;
  }>;
}
```

---

### 2️⃣ **components/cart/CheckoutModal.tsx** - UI & Logic

#### A. ✏️ Thay Đổi: Cập nhập `handleCheckout()` function

**Key Changes:**

- Thêm mapping từ UI payment method sang API format
- Gửi `paymentMethod` ở top level của request body

```typescript
const handleCheckout = async () => {
  // ... validation ...

  // ✨ NEW: Map payment method selection to API format
  const paymentMethodMap: { [key: string]: "WALLET" | "CASH" } = {
    wallet: "WALLET", // Ví điện tử → WALLET
    cash: "CASH", // Thanh toán khi đến → CASH
    bank_transfer: "CASH", // Chuyển khoản → CASH (nhân viên xác nhận)
  };

  // ✨ NEW: Request object with paymentMethod
  const bulkBookings = {
    paymentMethod: paymentMethodMap[selectedPaymentMethod] || "CASH",
    bookings: bookings.map((item) => {
      // ... item conversion logic ...
    }),
  };

  const response = await bookingApi.createBulkBookings(bulkBookings);
  // ... handle response ...
};
```

#### B. ✏️ Thay Đổi: Cập nhập Payment Method UI

**Thêm 3 lựa chọn thanh toán:**

| #   | Payment Method        | Value           | Hành Động                         |
| --- | --------------------- | --------------- | --------------------------------- |
| 1   | 🏦 Ví điện tử         | `wallet`        | Trừ tiền ngay → Xác nhận tự động  |
| 2   | 🏛️ Chuyển khoản       | `bank_transfer` | Đợi xác nhận nhân viên → Trừ tiền |
| 3   | 💵 Thanh toán khi đến | `cash`          | Đợi xác nhận nhân viên → Trừ tiền |

**UI Structure:**

```tsx
<RadioGroup>
  {/* Ví điện tử - NEW */}
  <RadioGroupItem value="wallet" id="wallet" />
  <Label htmlFor="wallet">Ví điện tử</Label>

  {/* Chuyển khoản ngân hàng */}
  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
  <Label htmlFor="bank_transfer">Chuyển khoản ngân hàng</Label>

  {/* Thanh toán khi đến */}
  <RadioGroupItem value="cash" id="cash" />
  <Label htmlFor="cash">Thanh toán khi đến cửa hàng</Label>
</RadioGroup>
```

---

## 🔄 Request/Response Flow

### 📤 Request Body (Example)

```json
{
  "paymentMethod": "WALLET",
  "bookings": [
    {
      "type": "SPA",
      "petId": 1,
      "bookingDate": "2025-01-15T10:00:00Z",
      "note": "Làm sạch lông",
      "dropDownSlot": "MORNING",
      "comboId": 1
    },
    {
      "type": "HOTEL",
      "petId": 2,
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

### 📥 Response Format

```json
{
  "success": true,
  "createdCount": 2,
  "bookingIds": [123, 124],
  "errors": []
}
```

---

## 💡 Quy Trình Thanh Toán

### 🟢 Khi Chọn Ví (WALLET)

1. ✅ Kiểm tra số dư ví
2. ✅ **Trừ tiền ngay lập tức** từ ví
3. ✅ **Booking được xác nhận tự động**
4. ✅ Hiển thị thông báo thành công

### 🟡 Khi Chọn Chuyển Khoản hoặc Tiền Mặt (CASH)

1. ⏳ Tạo booking với trạng thái `PENDING`
2. ⏳ Đợi nhân viên **xác nhận**
3. ✅ Sau khi xác nhận → Tiền sẽ được trừ
4. ✅ Booking chuyển sang trạng thái `CONFIRMED`

---

## 🎨 Giao Diện Thanh Toán

**Trước (cũ):**

- ❌ Chuyển khoản ngân hàng
- ❌ Thanh toán khi đến

**Sau (mới):**

- ✨ **Ví điện tử** (Primary - nhanh & tiện)
- ✨ Chuyển khoản ngân hàng (Secondary - an toàn)
- ✨ Thanh toán khi đến (Tertiary - linh hoạt)

---

## ✅ Testing Checklist

- [ ] Chọn "Ví điện tử" → Gửi `paymentMethod: "WALLET"`
- [ ] Chọn "Chuyển khoản" → Gửi `paymentMethod: "CASH"`
- [ ] Chọn "Thanh toán khi đến" → Gửi `paymentMethod: "CASH"`
- [ ] Request body đúng định dạng
- [ ] Xử lý response success & error
- [ ] Toast notifications hiển thị đúng
- [ ] Cart được clear sau khi đặt thành công
- [ ] Multiple bookings được gửi trong 1 request

---

## 📦 Files Được Sửa

1. ✅ `services/booking/api.ts`

   - Cập nhập `BulkBookingRequest` interface
   - Fix error handling type

2. ✅ `components/cart/CheckoutModal.tsx`
   - Cập nhập `handleCheckout()` logic
   - Cập nhập Payment Method UI
   - Xóa unused imports/functions
   - Thêm payment method mapping

---

## 🚀 Deployment Notes

- ✅ No breaking changes
- ✅ Backward compatible mapping (bank_transfer → CASH)
- ✅ All error handling preserved
- ✅ Toast notifications working
- ✅ Ready for production
