# 🎯 CHAT QUICK REFERENCE

## 🔗 URLs

| Route                  | Purpose                        | Access   |
| ---------------------- | ------------------------------ | -------- |
| `/chat-test`           | Test page với form tạo yêu cầu | Customer |
| `/chat/[roomId]`       | Customer chat với staff        | Customer |
| `/staff/sessions`      | Danh sách sessions chưa claim  | Staff    |
| `/staff/chat/[roomId]` | Staff chat với customer        | Staff    |

## 📦 Components

```tsx
// Form tạo yêu cầu tư vấn
import CustomerConsultation from "@/components/chat/CustomerConsultation";
<CustomerConsultation />;

// Danh sách sessions cho staff
import StaffSessionList from "@/components/chat/StaffSessionList";
<StaffSessionList />;

// Simple chat component (reusable)
import SimpleChat from "@/components/chat/SimpleChat";
<SimpleChat roomId={123} currentUserId={456} />;
```

## 🪝 Hooks

```tsx
import { useSocket } from "@/contexts/SocketContext";
const { socket, isConnected } = useSocket();

import { useChat } from "@/hooks/useChat";
const { messages, sendMessage, loading } = useChat({ roomId: 123 });
```

## 🔌 API Functions

```tsx
import { chatApi } from "@/services/chat/api";

// Rooms
await chatApi.getRooms();
await chatApi.getRoomById(roomId);
await chatApi.getRoomHistory(roomId);

// Sessions
await chatApi.createSession(roomId, title);
await chatApi.getUnassignedSessions();
await chatApi.joinSession(sessionId);
await chatApi.endSession(sessionId);
await chatApi.getSessionById(sessionId);
await chatApi.getMySessions();

// Messages
await chatApi.getMessages(roomId, page, limit);
await chatApi.markMessageAsRead(messageId);
await chatApi.markAllMessagesAsRead(roomId);
```

## 📡 WebSocket Events

```tsx
// Emit
socket.emit("join_room", { roomId });
socket.emit("send_message", { roomId, content });
socket.emit("leave_room", { roomId });

// Listen
socket.on("joined_room", (data) => {});
socket.on("room_history", (data) => {});
socket.on("new_message", (message) => {});
socket.on("session_joined", (data) => {});
socket.on("session_ended", (data) => {});
socket.on("error", (error) => {});
```

## ⚙️ Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

## 🎨 Types

```tsx
import type {
  User,
  Message,
  Session,
  Room,
  RoomHistory,
} from "@/services/chat/api";

import type {
  SocketEvents,
  ChatPageProps,
  SessionListProps,
  ConsultationFormProps,
} from "@/types/chat";
```

## 🚀 Quick Start

```bash
# 1. Start backend (port 8080)
# 2. Start frontend
npm run dev
# 3. Test customer: http://localhost:3000/chat-test
# 4. Test staff: http://localhost:3000/staff/sessions
```

## 🎯 Customer Flow

1. Go to `/chat-test`
2. Enter consultation request
3. Click "Tạo yêu cầu tư vấn"
4. Wait for staff to join
5. Chat with staff

## 👨‍💼 Staff Flow

1. Go to `/staff/sessions`
2. Click "Nhận tư vấn" on a session
3. Chat with customer
4. Click "Kết thúc" when done

## 🐛 Debug Checklist

- [ ] Backend đang chạy?
- [ ] `.env.local` có đúng URL không?
- [ ] Token trong localStorage?
- [ ] Console có lỗi không?
- [ ] WebSocket đã connected? (check badge)
- [ ] Network tab → WS frames

## 📚 Docs

- `CHAT_INTEGRATION_GUIDE.md` - Chi tiết từng bước
- `CHAT_ROUTES_REFERENCE.md` - Routes & navigation
- `CHAT_IMPLEMENTATION_SUMMARY.md` - Tổng quan implementation
- `CHAT_QUICK_REFERENCE.md` - File này

---

**Note**: Sau khi thay đổi `.env.local`, restart dev server!
