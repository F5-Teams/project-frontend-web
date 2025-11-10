# 📊 API Request Format Comparison

## Old Format vs New Format

### ❌ OLD - Missing `paymentMethod` at top level

```json
{
  "bookings": [
    {
      "type": "SPA",
      "petId": 1,
      "bookingDate": "2025-01-15T10:00:00Z",
      "note": "string",
      "dropDownSlot": "MORNING",
      "comboId": 1
    }
  ]
}
```

### ✅ NEW - `paymentMethod` at top level

```json
{
  "paymentMethod": "WALLET",
  "bookings": [
    {
      "type": "SPA",
      "petId": 1,
      "bookingDate": "2025-01-15T10:00:00Z",
      "note": "string",
      "dropDownSlot": "MORNING",
      "comboId": 1
    }
  ]
}
```

---

## 🎯 Payment Method Mapping

| User Selection     | API Value | Behavior                        |
| ------------------ | --------- | ------------------------------- |
| Ví điện tử         | `WALLET`  | Trừ tiền ngay, xác nhận tự động |
| Chuyển khoản       | `CASH`    | Đợi xác nhận staff              |
| Thanh toán khi đến | `CASH`    | Đợi xác nhận staff              |

---

## 📋 Request Structure Detail

```typescript
interface BulkBookingRequest {
  // ✨ NEW: Payment method at top level
  paymentMethod: "WALLET" | "CASH";

  bookings: Array<{
    // Common fields
    type: "SPA" | "HOTEL";
    petId: number; // Required
    bookingDate: string; // ISO 8601
    note: string; // Notes
    dropDownSlot: string; // Time slot

    // SPA Combo booking
    comboId?: number; // Optional for SPA

    // SPA Custom booking
    serviceIds?: number[]; // Optional for SPA

    // HOTEL booking
    roomId?: number; // Optional for HOTEL
    startDate?: string; // Optional for HOTEL
    endDate?: string; // Optional for HOTEL
  }>;
}
```

---

## 🔄 Complete Request Examples

### Example 1: SPA Combo + Hotel (WALLET Payment)

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
      "note": "Phòng VIP, đặc biệt chế độ ăn",
      "dropDownSlot": "MORNING",
      "roomId": 1,
      "startDate": "2025-01-15T10:00:00Z",
      "endDate": "2025-01-16T10:00:00Z"
    }
  ]
}
```

### Example 2: Multiple SPA Custom Services (CASH Payment)

```json
{
  "paymentMethod": "CASH",
  "bookings": [
    {
      "type": "SPA",
      "petId": 1,
      "bookingDate": "2025-01-20T14:00:00Z",
      "note": "Cần chú ý đến lông tai",
      "dropDownSlot": "AFTERNOON",
      "serviceIds": [1, 2, 3]
    },
    {
      "type": "SPA",
      "petId": 2,
      "bookingDate": "2025-01-20T14:00:00Z",
      "note": "",
      "dropDownSlot": "AFTERNOON",
      "serviceIds": [1, 4]
    }
  ]
}
```

### Example 3: Mixed Bookings (CASH Payment)

```json
{
  "paymentMethod": "CASH",
  "bookings": [
    {
      "type": "SPA",
      "petId": 1,
      "bookingDate": "2025-01-25T09:00:00Z",
      "note": "Pet 1 - SPA combo",
      "dropDownSlot": "MORNING",
      "comboId": 2
    },
    {
      "type": "SPA",
      "petId": 2,
      "bookingDate": "2025-01-25T10:00:00Z",
      "note": "Pet 2 - Custom services",
      "dropDownSlot": "MORNING",
      "serviceIds": [5, 6]
    },
    {
      "type": "HOTEL",
      "petId": 3,
      "bookingDate": "2025-01-25T11:00:00Z",
      "note": "Pet 3 - Hotel stay",
      "dropDownSlot": "MORNING",
      "roomId": 3,
      "startDate": "2025-01-25T11:00:00Z",
      "endDate": "2025-01-27T11:00:00Z"
    }
  ]
}
```

---

## 📝 Response Format

### Success Response

```json
{
  "success": true,
  "createdCount": 3,
  "bookingIds": [101, 102, 103],
  "errors": []
}
```

### Partial Success Response

```json
{
  "success": true,
  "createdCount": 2,
  "bookingIds": [101, 103],
  "errors": [
    "Booking 2 failed: Invalid room ID",
    "Booking 2 failed: Room not available"
  ]
}
```

### Error Response

```json
{
  "success": false,
  "error": "Invalid payment method",
  "createdCount": 0,
  "bookingIds": []
}
```

---

## 🔧 Frontend Implementation

### In `components/cart/CheckoutModal.tsx`

```typescript
// Map UI selection to API format
const paymentMethodMap: { [key: string]: "WALLET" | "CASH" } = {
  wallet: "WALLET", // User selects "Ví điện tử"
  cash: "CASH", // User selects "Thanh toán khi đến"
  bank_transfer: "CASH", // User selects "Chuyển khoản" → treated as CASH
};

// Create request payload
const bulkBookings = {
  paymentMethod: paymentMethodMap[selectedPaymentMethod] || "CASH",
  bookings: bookings.map((item) => {
    // Convert cart item to booking format
    // See handleCheckout() for full logic
  }),
};

// Send to API
const response = await bookingApi.createBulkBookings(bulkBookings);
```

---

## ✅ Validation Checklist

- [x] `paymentMethod` is at top level (not inside bookings)
- [x] `paymentMethod` is either `"WALLET"` or `"CASH"`
- [x] All bookings use same payment method
- [x] Each booking has required fields: `type`, `petId`, `bookingDate`, `note`, `dropDownSlot`
- [x] Type-specific fields are included (`comboId` for SPA, `roomId`/`startDate`/`endDate` for HOTEL)
- [x] Dates are in ISO 8601 format
- [x] `petId` is a valid number
- [x] `dropDownSlot` is valid (MORNING, AFTERNOON, etc.)
