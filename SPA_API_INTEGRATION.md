# Spa API Integration

## Tổng quan

Trang spa đã được tích hợp với API thật để lấy dữ liệu combo spa từ endpoint `GET /bookings/combos/available`.

## Cấu trúc Files

### 1. Services API (`/services/spa/`)

- **`api.ts`**: Chứa các function để gọi API spa
- **`hooks.ts`**: Custom hooks để sử dụng API với React
- **`index.ts`**: Export tất cả services

### 2. Types

- **`SpaCombo`**: Interface cho dữ liệu combo spa từ API
- **`SpaComboResponse`**: Interface cho response từ API

## Cách hoạt động

### 1. API Service

```typescript
// Lấy danh sách combo spa có sẵn
const response = await spaApi.getAvailableCombos();

// Lấy combo spa theo ID
const combo = await spaApi.getComboById(id);
```

### 2. Custom Hooks

```typescript
// Hook để lấy tất cả combo spa
const { combos, loading, error, refetch } = useSpaCombos();

// Hook để lấy combo spa theo ID
const { combo, loading, error, refetch } = useSpaCombo(id);
```

### 3. Trang Spa (`/spa/[id]`)

- **Loading State**: Hiển thị spinner khi đang tải dữ liệu
- **Error State**: Hiển thị thông báo lỗi và nút "Thử lại"
- **Fallback**: Sử dụng dữ liệu từ constants nếu API không có dữ liệu
- **Availability Badge**: Hiển thị trạng thái "Có sẵn" hoặc "Hết chỗ"

## Tính năng mới

### 1. Real-time Data

- Dữ liệu được lấy từ API thật thay vì constants
- Hiển thị trạng thái availability của từng combo

### 2. Error Handling

- Xử lý lỗi khi API không khả dụng
- Hiển thị thông báo lỗi thân thiện với người dùng
- Nút "Thử lại" để reload trang

### 3. Loading States

- Spinner loading khi đang tải dữ liệu
- UI responsive và smooth

### 4. Fallback Mechanism

- Nếu API không trả về dữ liệu, trang sẽ fallback về constants
- Đảm bảo trang luôn hoạt động

## API Endpoints

### GET /bookings/combos/available

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "combo-1",
      "name": "Spa Luxury",
      "description": "Gói spa cao cấp với đầy đủ dịch vụ",
      "price": 500000,
      "duration": 90,
      "image": "/images/spa1.jpg",
      "category": "spa",
      "isAvailable": true,
      "services": ["service-1", "service-2"]
    }
  ]
}
```

## Cách sử dụng

1. **Truy cập trang spa**: `http://localhost:3000/spa`
2. **Chọn dịch vụ**: Click vào một dịch vụ spa
3. **Xem combo**: Trang sẽ hiển thị các combo spa từ API
4. **Đặt dịch vụ**: Click "Đặt ngay" để đặt combo spa

## Lưu ý

- API base URL được cấu hình trong `config/axios.ts`
- Cần đảm bảo API server đang chạy trên port 8080
- Token authentication được tự động thêm vào request headers
- Dữ liệu được cache trong localStorage thông qua Zustand store
