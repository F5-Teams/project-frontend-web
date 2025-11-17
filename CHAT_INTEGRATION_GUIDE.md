# 💬 HỆ THỐNG CHAT TƯ VẤN - HƯỚNG DẪN SỬ DỤNG

## 📋 Tổng quan

Hệ thống chat tư vấn cho phép khách hàng tạo yêu cầu tư vấn và staff nhận để hỗ trợ trực tiếp qua WebSocket realtime.

## 🏗️ Cấu trúc dự án

```
├── contexts/
│   └── SocketContext.tsx          # WebSocket context & provider
├── services/
│   └── chat/
│       └── api.ts                 # Chat API functions
├── components/
│   └── chat/
│       ├── CustomerConsultation.tsx  # Component tạo session
│       └── StaffSessionList.tsx      # Component danh sách sessions
├── app/
│   ├── (home)/
│   │   └── chat/
│   │       └── [roomId]/
│   │           └── page.tsx       # Customer chat page
│   └── (dashboard)/
│       └── staff/
│           ├── sessions/
│           │   └── page.tsx       # Staff sessions list page
│           └── chat/
│               └── [roomId]/
│                   └── page.tsx   # Staff chat page
└── .env.local                     # Environment variables
```

## 🚀 Cài đặt

### 1. Dependencies đã được cài đặt

- `socket.io-client` - WebSocket client
- `date-fns` - Format ngày tháng

### 2. Cấu hình Environment Variables

File `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

**Lưu ý:** Sau khi thay đổi `.env.local`, cần restart dev server:

```bash
npm run dev
```

## 📱 Hướng dẫn sử dụng

### 👤 KHÁCH HÀNG (Customer)

#### 1. Tạo yêu cầu tư vấn

Import component vào trang bạn muốn hiển thị:

```tsx
import CustomerConsultation from "@/components/chat/CustomerConsultation";

export default function SupportPage() {
  return (
    <div className="container py-8">
      <CustomerConsultation />
    </div>
  );
}
```

#### 2. Chat với staff

Sau khi tạo yêu cầu, customer sẽ được chuyển tự động đến trang chat:

- URL: `/chat/[roomId]?sessionId=[sessionId]`
- Chờ staff tham gia (hiển thị badge "Đang chờ staff...")
- Khi staff vào, sẽ nhận thông báo và có thể bắt đầu chat
- Gửi tin nhắn bằng cách nhập và nhấn Enter hoặc click nút Send

### 👨‍💼 STAFF

#### 1. Xem danh sách yêu cầu tư vấn

Navigate đến: `/staff/sessions`

Hoặc tạo link trong navigation:

```tsx
<Link href="/staff/sessions">
  <Button>
    <MessageSquare className="mr-2 h-4 w-4" />
    Yêu cầu tư vấn
  </Button>
</Link>
```

#### 2. Nhận yêu cầu (Claim session)

- Xem danh sách các yêu cầu đang chờ
- Click "Nhận tư vấn" trên session muốn xử lý
- Nếu thành công → Chuyển đến trang chat
- Nếu thất bại → Session đã được staff khác nhận

#### 3. Chat với khách hàng

- URL: `/staff/chat/[roomId]?sessionId=[sessionId]`
- Xem thông tin khách hàng (tên, username, số điện thoại)
- Chat realtime với customer
- Kết thúc session khi hoàn tất tư vấn

#### 4. Kết thúc session

- Click nút "Kết thúc" ở góc trên bên phải
- Xác nhận trong dialog
- Sau khi kết thúc → Quay về danh sách sessions

## 🔌 WebSocket Events

### Client → Server (Emit)

```typescript
// Join room
socket.emit("join_room", { roomId: number });

// Send message
socket.emit("send_message", {
  roomId: number,
  content: string,
});

// Leave room
socket.emit("leave_room", { roomId: number });
```

### Server → Client (Listen)

```typescript
// Khi join room thành công
socket.on('joined_room', (data) => { ... });

// Nhận lịch sử tin nhắn
socket.on('room_history', (data) => {
  // data.messages: Message[]
});

// Tin nhắn mới
socket.on('new_message', (message: Message) => { ... });

// Staff vào session (chỉ customer nhận)
socket.on('session_joined', (data) => {
  // data.staff: User
  // data.session: Session
});

// Session kết thúc
socket.on('session_ended', (data) => {
  // data.sessionId: number
  // data.endedAt: string
});

// Lỗi
socket.on('error', (error) => { ... });
```

## 🎨 UI Components được sử dụng

Dự án sử dụng `shadcn/ui`:

- `Button` - Nút bấm
- `Input` - Ô nhập liệu
- `Card` - Card container
- `Badge` - Nhãn trạng thái
- `Avatar` - Avatar người dùng
- `AlertDialog` - Dialog xác nhận
- `toast` (sonner) - Thông báo

## 🔧 API Endpoints

### REST API (qua `services/chat/api.ts`)

```typescript
// Rooms
chatApi.getRooms(); // GET /chat/rooms
chatApi.getRoomById(roomId); // GET /chat/rooms/:roomId
chatApi.getRoomHistory(roomId); // GET /chat/rooms/:roomId/history

// Sessions
chatApi.createSession(roomId, title); // POST /chat/rooms/:roomId/sessions
chatApi.getUnassignedSessions(); // GET /chat/sessions/unassigned
chatApi.joinSession(sessionId); // POST /chat/sessions/:sessionId/join
chatApi.endSession(sessionId); // POST /chat/sessions/:sessionId/end
chatApi.getSessionById(sessionId); // GET /chat/sessions/:sessionId
chatApi.getMySessions(); // GET /chat/sessions/my-sessions

// Messages
chatApi.getMessages(roomId, page, limit); // GET /chat/rooms/:roomId/messages
chatApi.markMessageAsRead(messageId); // PATCH /chat/messages/:messageId/read
chatApi.markAllMessagesAsRead(roomId); // PATCH /chat/rooms/:roomId/read-all
```

## 🐛 Troubleshooting

### WebSocket không kết nối

1. Kiểm tra `NEXT_PUBLIC_SOCKET_URL` trong `.env.local`
2. Kiểm tra backend có đang chạy không
3. Kiểm tra console browser xem có lỗi không
4. Đảm bảo có token trong localStorage:
   ```js
   localStorage.getItem("accessToken");
   ```

### Không nhận được tin nhắn realtime

1. Kiểm tra connection status ở header (badge "Đã kết nối")
2. Kiểm tra console log các events
3. F12 → Network → WS → Xem WebSocket frames

### Session bị claim bởi staff khác

- Đây là behavior bình thường
- Ai click "Nhận tư vấn" trước sẽ được assign
- Người sau sẽ thấy toast error

## 📞 Flow hoàn chỉnh

### Customer Flow

1. Customer vào trang support
2. Nhập nội dung yêu cầu tư vấn
3. Click "Tạo yêu cầu tư vấn"
4. API tạo session → Redirect đến `/chat/[roomId]`
5. WebSocket tự động kết nối và join room
6. Chờ staff tham gia
7. Khi staff join → Nhận event `session_joined` → Badge đổi thành "Staff đang tư vấn"
8. Chat với staff
9. Khi staff kết thúc → Nhận event `session_ended` → Không thể gửi tin nhắn nữa

### Staff Flow

1. Staff vào `/staff/sessions`
2. Xem danh sách sessions chưa được claim
3. Click "Nhận tư vấn" trên session
4. API claim session → Redirect đến `/staff/chat/[roomId]`
5. WebSocket tự động kết nối và join room
6. Xem thông tin customer và lịch sử chat
7. Chat với customer
8. Click "Kết thúc" khi hoàn tất
9. Confirm dialog → API end session
10. Redirect về `/staff/sessions`

## 🎯 Tips

### Auto-scroll khi có tin nhắn mới

```tsx
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

// Trong JSX
<div ref={messagesEndRef} />;
```

### Format time

```tsx
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const timeAgo = formatDistanceToNow(new Date(date), {
  addSuffix: true,
  locale: vi,
});
```

### Get user initials

```tsx
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};
```

## 🔐 Security

- Tất cả API calls đều có JWT token (từ localStorage)
- WebSocket auth qua token trong `auth` field
- Chỉ staff mới có thể:
  - Xem danh sách unassigned sessions
  - Claim sessions
  - End sessions

## 🚀 Production Deployment

1. Cập nhật `.env.local` → `.env.production`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/
NEXT_PUBLIC_SOCKET_URL=https://your-api.com
```

2. Build project:

```bash
npm run build
```

3. Start production server:

```bash
npm start
```

## 📝 Lưu ý quan trọng

1. **Token expiry**: Nếu token hết hạn, user cần login lại
2. **WebSocket reconnection**: Đã config auto reconnect (max 5 attempts)
3. **Message ordering**: Messages được sắp xếp theo `createdAt`
4. **Real-time sync**: Mọi thay đổi đều sync realtime qua WebSocket
5. **Error handling**: Tất cả lỗi đều show toast notification

---

Chúc bạn tích hợp thành công! 🎉

Nếu có vấn đề, kiểm tra:

1. Console logs
2. Network tab (XHR + WS)
3. Backend logs
