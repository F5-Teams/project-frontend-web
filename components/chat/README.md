# Chat Components

Các components cho hệ thống chat tư vấn realtime.

## Components

### CustomerConsultation

Form để khách hàng tạo yêu cầu tư vấn.

```tsx
import CustomerConsultation from "@/components/chat/CustomerConsultation";

<CustomerConsultation />;
```

**Features:**

- Input validation
- Loading states
- Auto fetch customer room
- Redirect to chat after creation
- Toast notifications

---

### StaffSessionList

Hiển thị danh sách yêu cầu tư vấn chưa được claim.

```tsx
import StaffSessionList from "@/components/chat/StaffSessionList";

<StaffSessionList />;
```

**Features:**

- Auto refresh (10s interval)
- Manual refresh button
- Claim session (first-come-first-served)
- Customer info display
- Time ago display
- Loading & empty states

---

### SimpleChat

Component chat đơn giản, dễ tái sử dụng.

```tsx
import SimpleChat from "@/components/chat/SimpleChat";

<SimpleChat roomId={123} currentUserId={456} className="h-screen" />;
```

**Features:**

- Uses `useChat` hook
- Minimal setup
- Realtime messaging
- Connection status
- Auto-scroll messages
- Loading states

**Props:**

- `roomId: number` - Room ID để join
- `currentUserId: number` - ID của user hiện tại
- `className?: string` - Custom styling

---

## Usage Examples

### In a Page

```tsx
export default function SupportPage() {
  return (
    <div className="container py-8">
      <h1>Tư vấn trực tuyến</h1>
      <CustomerConsultation />
    </div>
  );
}
```

### In a Modal

```tsx
import { Dialog } from "@/components/ui/dialog";
import SimpleChat from "@/components/chat/SimpleChat";

<Dialog>
  <DialogContent className="h-[600px]">
    <SimpleChat roomId={roomId} currentUserId={userId} />
  </DialogContent>
</Dialog>;
```

### In a Dashboard

```tsx
export default function StaffDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu tư vấn</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffSessionList />
        </CardContent>
      </Card>
      <Card>{/* Other stats */}</Card>
    </div>
  );
}
```

---

## See Also

- `hooks/useChat.ts` - Custom hook cho chat
- `contexts/SocketContext.tsx` - WebSocket provider
- `services/chat/api.ts` - Chat API functions
- Full documentation: `/CHAT_INTEGRATION_GUIDE.md`
