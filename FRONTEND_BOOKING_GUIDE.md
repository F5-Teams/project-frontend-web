# 🎯 Frontend Booking Flow Guide

## 📋 **Tổng quan Booking Flow**

### **Customer Journey:**

1. **Browse Combos** → 2. **Create Booking** → 3. **Staff Processing** → 4. **Service Completion** → 5. **Feedback**

### **Staff Journey:**

1. **View Bookings** → 2. **Assign Groomer** → 3. **Complete Service** → 4. **Update Status**

---

## 🔄 **Complete Booking Flow**

### **Step 1: Customer Browse Available Combos**

```http
GET /bookings/combos/available
Authorization: Bearer <customer_token>
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Basic Grooming",
    "price": "150000",
    "duration": 60,
    "description": "Basic grooming service combo",
    "isActive": true,
    "serviceLinks": [
      {
        "service": {
          "id": 1,
          "name": "Grooming",
          "price": "150000",
          "images": [
            {
              "id": 1,
              "imageUrl": "https://example.com/grooming1.jpg"
            }
          ]
        }
      }
    ]
  }
]
```

### **Step 2: Customer Create Booking**

```http
POST /bookings/bulk
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "bookings": [
    {
      "petId": 1,
      "bookingDate": "2025-01-15T10:00:00Z",
      "note": "Basic grooming for my dog",
      "dropDownSlot": "MORNING",
      "comboId": 1
    },
    {
      "petId": 1,
      "bookingDate": "2025-01-15T10:00:00Z",
      "note": "Overnight stay",
      "dropDownSlot": "MORNING",
      "roomId": 1,
      "startDate": "2025-01-15T10:00:00Z",
      "endDate": "2025-01-16T10:00:00Z"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "createdCount": 2,
  "bookingIds": [4, 5],
  "errors": null
}
```

### **Step 3: Customer View Their Bookings**

```http
GET /bookings/my-bookings
Authorization: Bearer <customer_token>
```

**Response:**

```json
[
  {
    "id": 4,
    "status": "PENDING",
    "bookingDate": "2025-01-15T10:00:00Z",
    "note": "Basic grooming for my dog",
    "combo": {
      "id": 1,
      "name": "Basic Grooming",
      "price": "150000"
    },
    "pet": {
      "id": 1,
      "name": "Buddy",
      "species": "Dog"
    }
  }
]
```

---

## 🏢 **Staff Processing Flow**

### **Step 4: Staff View Pending Bookings**

```http
GET /bookings/staff/pending
Authorization: Bearer <staff_token>
```

**Response:**

```json
[
  {
    "id": 4,
    "status": "PENDING",
    "customer": {
      "id": 3,
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "0123456789"
    },
    "pet": {
      "id": 1,
      "name": "Buddy",
      "species": "Dog"
    },
    "combo": {
      "name": "Basic Grooming",
      "price": "150000"
    }
  }
]
```

### **Step 5: Staff Confirm Booking**

```http
PUT /bookings/4/status
Authorization: Bearer <staff_token>
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

### **Step 6: Staff Assign to Groomer**

```http
PUT /bookings/4/assign
Authorization: Bearer <staff_token>
Content-Type: application/json

{
  "groomerId": 5
}
```

**Response:**

```json
{
  "id": 4,
  "status": "ON_SERVICE",
  "groomerId": 5,
  "checkInDate": "2025-01-15T10:30:00Z",
  "groomer": {
    "id": 5,
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

### **Step 7: Staff Complete Service**

```http
PUT /bookings/4/complete
Authorization: Bearer <staff_token>
```

**Response:**

```json
{
  "id": 4,
  "status": "COMPLETED",
  "checkOutDate": "2025-01-15T12:00:00Z",
  "groomer": {
    "id": 5,
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

---

## ❌ **Cancel Flow**

### **Customer Cancel Booking**

```http
PUT /bookings/4/cancel
Authorization: Bearer <customer_token>
```

**Response:**

```json
{
  "message": "Booking cancelled successfully"
}
```

### **Staff Cancel Booking**

```http
PUT /bookings/4/status
Authorization: Bearer <staff_token>
Content-Type: application/json

{
  "status": "CANCELED"
}
```

---

## 📊 **Status Flow Diagram**

```
PENDING → CONFIRMED → ON_SERVICE → COMPLETED
   ↓           ↓           ↓
CANCELED   CANCELED   CANCELED
```

### **Status Meanings:**

- **PENDING**: Customer đã tạo booking, chờ staff xác nhận
- **CONFIRMED**: Staff đã xác nhận booking
- **ON_SERVICE**: Staff đã giao thú cưng cho groomer, đang được phục vụ
- **COMPLETED**: Dịch vụ hoàn thành, customer có thể feedback
- **CANCELED**: Booking bị hủy (có thể cancel ở bất kỳ status nào trước COMPLETED)

---

## 🎨 **Frontend Implementation Guide**

### **1. Create Booking with Validation:**

```javascript
const createBooking = async (bookingData) => {
  try {
    // Validate dates on frontend first (better UX)
    const bookingDate = new Date(bookingData.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      alert('Booking date cannot be in the past');
      return;
    }

    // For room booking
    if (bookingData.roomId) {
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);

      if (startDate < today) {
        alert('Start date cannot be in the past');
        return;
      }

      if (endDate <= startDate) {
        alert('End date must be after start date');
        return;
      }
    }

    const response = await fetch('/bookings/bulk', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${customerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookings: [bookingData] }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    // Handle specific errors
    if (error.message.includes('already has an active booking')) {
      alert('This pet already has a booking during this time period');
    } else if (error.message.includes('Room is not available')) {
      alert('This room is not available during the selected dates');
    } else if (error.message.includes('cannot be in the past')) {
      alert('Please select a future date');
    } else {
      alert(`Booking failed: ${error.message}`);
    }
    throw error;
  }
};
```

### **2. Cancel Booking with Error Handling:**

```javascript
const cancelBooking = async (bookingId) => {
  try {
    const response = await fetch(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${customerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();

      // Handle specific cancellation errors
      if (error.statusCode === 400) {
        if (error.message.includes('completed')) {
          alert('Cannot cancel a completed booking');
        } else if (error.message.includes('already cancelled')) {
          alert('This booking has already been cancelled');
        } else {
          alert(error.message);
        }
      } else if (error.statusCode === 404) {
        alert('Booking not found');
      } else if (error.statusCode === 403) {
        alert('You can only cancel your own bookings');
      }

      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('Cancel booking error:', error);
    throw error;
  }
};
```

### **3. Staff Update Status with Validation:**

```javascript
const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const response = await fetch(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${staffToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const error = await response.json();

      // Handle status transition errors
      if (error.message.includes('Cannot transition')) {
        alert(`Invalid status change: ${error.message}`);
      } else {
        alert(`Status update failed: ${error.message}`);
      }

      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('Update status error:', error);
    throw error;
  }
};
```

### **4. Get Customer Bookings:**

```javascript
const getMyBookings = async () => {
  const response = await fetch('/bookings', {
    headers: {
      Authorization: `Bearer ${customerToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  return response.json();
};
```

### **5. Check Pet Availability Before Booking:**

```javascript
const checkPetAvailability = async (petId, startDate, endDate) => {
  // Optional: Add a custom endpoint to check availability
  // Or handle conflict errors when creating booking
  try {
    const response = await fetch(
      `/bookings/check-availability?petId=${petId}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${customerToken}`,
        },
      },
    );

    return await response.json();
  } catch (error) {
    console.error('Availability check failed:', error);
    return { available: false };
  }
};
```

## 🔐 **Authentication**

### **Customer Token:**

- Login với customer account
- Access: `/bookings/my-bookings`, `/bookings/bulk`, `/bookings/:id/cancel`

### **Staff Token:**

- Login với staff account
- Access: `/bookings/staff/pending`, `/bookings/:id/assign`, `/bookings/:id/complete`

---

## ⚠️ **Error Handling**

### **Common Errors:**

#### **Authentication & Authorization:**

- **401 Unauthorized**: Token không hợp lệ hoặc hết hạn
- **403 Forbidden**: Không có quyền truy cập (role không phù hợp)

#### **Not Found Errors (404):**

- `"Booking not found"` - Booking ID không tồn tại
- `"Pet not found or does not belong to user"` - Pet không tồn tại hoặc không thuộc về user
- `"Combo not found or inactive"` - Combo không tồn tại hoặc đã bị deactivate
- `"Room not found"` - Room không tồn tại

#### **Validation Errors (400 Bad Request):**

**Date Validation:**

- `"Booking date cannot be in the past"` - Không được đặt ngày quá khứ
- `"Start date cannot be in the past"` - Ngày bắt đầu phải là tương lai
- `"End date must be after start date"` - Ngày kết thúc phải sau ngày bắt đầu
- `"Booking duration must be at least 1 hour"` - Thời gian booking tối thiểu 1 giờ

**Status Transition:**

- `"Cannot transition from {currentStatus} to {newStatus}"` - Không thể chuyển status theo flow không hợp lệ
- `"Cannot update completed or cancelled bookings"` - Không thể update booking đã hoàn thành hoặc đã hủy
- `"Cannot cancel completed or already cancelled bookings"` - Không thể cancel booking đã hoàn thành hoặc đã hủy
- `"Booking must be in PENDING or CONFIRMED status to assign to groomer"` - Phải ở trạng thái PENDING hoặc CONFIRMED mới assign được
- `"Booking must be in ON_SERVICE status to complete"` - Phải ở trạng thái ON_SERVICE mới complete được

**Business Logic:**

- `"You can only update your own bookings"` - Chỉ được update booking của mình
- `"You can only cancel your own bookings"` - Chỉ được cancel booking của mình

#### **Conflict Errors (409):**

- `"Pet already has an active booking during this time period (Booking #X)"` - Pet đã có booking trong thời gian này
- `"Room is not available during this time period (Booking #X)"` - Room đã bị book trong thời gian này
- `"Room is not available"` - Room không còn trống (status không phải AVAILABLE)

### **Error Response Format:**

```json
{
  "statusCode": 400,
  "message": "Booking date cannot be in the past",
  "error": "Bad Request"
}
```

### **Validation Rules Summary:**

#### **Combo Booking:**

```typescript
✅ Pet must belong to user
✅ Combo must exist and be active
✅ Booking date must not be in the past
✅ Pet cannot have another active booking on the same date
```

#### **Room Booking:**

```typescript
✅ Pet must belong to user
✅ Room must exist and be available
✅ Start date must not be in the past
✅ End date must be after start date
✅ Minimum duration: 1 hour
✅ Pet cannot have overlapping bookings
✅ Room cannot have overlapping bookings
```

#### **Status Transitions:**

```
Valid transitions:
PENDING → CONFIRMED, CANCELED
CONFIRMED → ON_SERVICE, CANCELED
ON_SERVICE → COMPLETED, CANCELED
COMPLETED → (none)
CANCELED → (none)
```

---

## 🚀 **Ready for Implementation!**

Tất cả APIs đã sẵn sàng cho frontend integration. Hãy sử dụng các endpoints trên để xây dựng booking system hoàn chỉnh!
