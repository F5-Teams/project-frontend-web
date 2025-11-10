# 🔄 Payment Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHECKOUT FLOW                                 │
└─────────────────────────────────────────────────────────────────┘

1. USER SELECTS PAYMENT METHOD
   ┌──────────────────────────────────────────────────────────┐
   │  Select Payment Method:                                   │
   │  ⦿ Ví điện tử                                            │
   │  ○ Chuyển khoản ngân hàng                               │
   │  ○ Thanh toán khi đến                                    │
   └──────────────────────────────────────────────────────────┘
                           ↓

2. MAP TO API FORMAT
   ┌──────────────────────────────────────────────────────────┐
   │  Ví điện tử          →  "WALLET"                          │
   │  Chuyển khoản        →  "CASH"  (staff confirms)         │
   │  Thanh toán khi đến  →  "CASH"  (staff confirms)         │
   └──────────────────────────────────────────────────────────┘
                           ↓

3. BUILD REQUEST
   ┌──────────────────────────────────────────────────────────┐
   │  {                                                        │
   │    "paymentMethod": "WALLET",                            │
   │    "bookings": [                                         │
   │      {                                                    │
   │        "type": "SPA",                                    │
   │        "petId": 1,                                       │
   │        ...                                               │
   │      },                                                   │
   │      {                                                    │
   │        "type": "HOTEL",                                  │
   │        "petId": 2,                                       │
   │        ...                                               │
   │      }                                                    │
   │    ]                                                      │
   │  }                                                        │
   └──────────────────────────────────────────────────────────┘
                           ↓

4. SEND TO API
   ┌──────────────────────────────────────────────────────────┐
   │  POST /bookings/bulk                                     │
   │  Content-Type: application/json                          │
   │  [Request Body Above]                                    │
   └──────────────────────────────────────────────────────────┘
                           ↓

5. BACKEND PROCESSES
   ┌────────────────────────┬─────────────────────────────────┐
   │                        │                                 │
   │   paymentMethod        │                                 │
   │   = "WALLET"           │   = "CASH"                      │
   │                        │                                 │
   ├────────────────────────┼─────────────────────────────────┤
   │ ✅ WALLET PAYMENT      │ 💰 CASH PAYMENT                │
   │                        │                                 │
   │ 1. Check balance       │ 1. Create Pending Bookings      │
   │ 2. Deduct immediately  │ 2. Wait for staff confirmation  │
   │ 3. Confirm bookings    │ 3. Staff approves               │
   │ 4. Success response    │ 4. Deduct payment               │
   │                        │ 5. Success response             │
   └────────────────────────┴─────────────────────────────────┘
                           ↓

6. RESPONSE HANDLING
   ┌──────────────────────────────────────────────────────────┐
   │  {                                                        │
   │    "success": true,                                      │
   │    "createdCount": 2,                                    │
   │    "bookingIds": [123, 124],                             │
   │    "errors": []                                          │
   │  }                                                        │
   └──────────────────────────────────────────────────────────┘
                           ↓

7. FRONTEND HANDLES RESULT
   ┌──────────────────────────────────────────────────────────┐
   │  ✅ Success:                                             │
   │  • Show "Đã tạo X đơn đặt thành công!"                 │
   │  • Clear cart                                            │
   │  • Navigate to success page                              │
   │  • Show booking IDs                                      │
   │                                                          │
   │  ⚠️ Partial Success:                                     │
   │  • Show success toast                                    │
   │  • Show error toast for each failed booking              │
   │  • Clear cart (for successful bookings)                  │
   │                                                          │
   │  ❌ Error:                                               │
   │  • Show error message                                    │
   │  • Don't clear cart                                      │
   │  • Allow retry                                           │
   └──────────────────────────────────────────────────────────┘
                           ↓

8. USER SEES RESULT
   ┌──────────────────────────────────────────────────────────┐
   │  SUCCESS SCREEN                                          │
   │  ✅ Bookings Created                                     │
   │  🎉 Thank you for your booking!                         │
   │  📋 Booking ID: 123, 124                                │
   │  📧 Confirmation sent to email                          │
   └──────────────────────────────────────────────────────────┘
```

---

## Payment Method Decision Tree

```
                    START
                      │
                      ↓
         Select Payment Method?
         /          │          \
        /           │           \
       /            │            \
    WALLET       TRANSFER       CASH
      │              │            │
      ↓              ↓            ↓
   WALLET="W"   CASH="C"    CASH="C"
      │              │            │
      ↓              ↓            ↓
   Immediate    Pending       Pending
   Deduction    Payment       Payment
      │              │            │
      ↓              ↓            ↓
   Auto         Staff          Staff
   Confirm      Confirm        Confirm
      │              │            │
      └──────┬───────┴───────┬────┘
             │               │
             ↓               ↓
          SUCCESS      AWAITING CONFIRMATION
```

---

## Request Structure Tree

```
┌─────────────────────────────────────────┐
│       BulkBookingRequest                 │
└─────────────────────────────────────────┘
           │
           ├─ paymentMethod (String)
           │  ├─ "WALLET" → Immediate payment
           │  └─ "CASH" → Pending payment
           │
           └─ bookings[] (Array)
              │
              └─ Booking Item (Object)
                 │
                 ├─ type (String)
                 │  ├─ "SPA" → Spa services
                 │  └─ "HOTEL" → Hotel/Room services
                 │
                 ├─ petId (Number)
                 │
                 ├─ bookingDate (String - ISO 8601)
                 │
                 ├─ note (String)
                 │
                 ├─ dropDownSlot (String)
                 │  ├─ "MORNING"
                 │  ├─ "AFTERNOON"
                 │  └─ etc.
                 │
                 ├─ SPA-specific fields (if type="SPA")
                 │  ├─ comboId (Number) - for preset combo
                 │  └─ serviceIds[] (Array) - for custom combo
                 │
                 └─ HOTEL-specific fields (if type="HOTEL")
                    ├─ roomId (Number)
                    ├─ startDate (String - ISO 8601)
                    └─ endDate (String - ISO 8601)
```

---

## State Transition Diagram

```
┌──────────────┐
│   INIT       │
│ - selectedPaymentMethod: ""
│ - isProcessing: false
│ - error: ""
└──────────────┘
       │
       │ User selects method
       ↓
┌──────────────┐
│   READY      │
│ - selectedPaymentMethod: "wallet"|"cash"|"bank_transfer"
│ - isProcessing: false
│ - error: ""
└──────────────┘
       │
       │ User clicks Checkout
       ↓
┌──────────────┐
│  PROCESSING  │
│ - selectedPaymentMethod: set
│ - isProcessing: true        ← Disable buttons
│ - error: ""
└──────────────┘
       │
       ├─────────┬──────────┐
       │         │          │
   SUCCESS   PARTIAL    ERROR
       │         │          │
       ↓         ↓          ↓
  ┌─────────┬────────┬─────────┐
  │ DONE    │ DONE   │ FAILED  │
  │ Clear   │ Clear  │ Keep    │
  │ Close   │ Close  │ Try     │
  │ Success │ Toast  │ Again   │
  └─────────┴────────┴─────────┘
```

---

## Component Integration Flow

```
CheckoutModal Component
│
├─ User Input
│  ├─ Select Payment Method (Radio)
│  ├─ Add Notes (Textarea)
│  └─ Click Checkout (Button)
│
├─ State Management
│  ├─ selectedPaymentMethod (useState)
│  ├─ customerNotes (useState)
│  ├─ isProcessing (useState)
│  └─ error (useState)
│
├─ Data Transformation
│  ├─ Map UI to API format
│  ├─ Build request object
│  └─ Extract booking items
│
├─ API Call
│  ├─ bookingApi.createBulkBookings()
│  │  └─ POST /bookings/bulk
│  │
│  ├─ Response Handling
│  │  ├─ Success → Toast + Clear Cart
│  │  ├─ Partial Success → Toast for each
│  │  └─ Error → Show error message
│  │
│  └─ Cleanup
│     ├─ Close Modal
│     ├─ Reset State
│     └─ Callback to parent
│
└─ Toast Notifications (sonner)
   ├─ Success toast
   ├─ Error toasts (multiple)
   └─ Duration control
```

---

## File Dependencies

```
CheckoutModal.tsx
├── imports from
│   ├── @/services/booking/api.ts
│   │   └── bookingApi.createBulkBookings()
│   │       └── POST /bookings/bulk
│   │           └── BulkBookingRequest interface
│   │
│   ├── @/stores/cart.store.ts
│   │   ├── useCartStore() hook
│   │   └── Cart state management
│   │
│   ├── @/types/cart.ts
│   │   └── BookingDraft type
│   │
│   ├── UI Components
│   │   ├── Dialog, Card, Button
│   │   ├── RadioGroup, Textarea
│   │   ├── Badge, Alert, Separator
│   │   └── Label, Loader2
│   │
│   └── Utilities
│       ├── @/utils/currency.ts → formatCurrency()
│       ├── date-fns → format()
│       └── sonner → toast()
│
└── exports
    └── CheckoutModal component
        └── used in CartDrawer, CartPage
```
