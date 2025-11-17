# 🗺️ CHAT ROUTES REFERENCE

## Customer Routes

### Test Page (Development)

- **URL**: `/chat-test`
- **Purpose**: Test page với CustomerConsultation component
- **Access**: Public (development only)

### Create Consultation Request

- **Component**: `<CustomerConsultation />`
- **Usage**: Import vào bất kỳ trang nào cần hiển thị form tạo yêu cầu
- **Action**: Sau khi submit → Redirect to chat page

### Customer Chat

- **URL**: `/chat/[roomId]?sessionId=[sessionId]`
- **Example**: `/chat/123?sessionId=456`
- **Purpose**: Customer chat với staff
- **Features**:
  - Realtime messaging
  - Wait for staff notification
  - Connection status indicator
  - Auto-scroll messages

## Staff Routes

### Sessions List

- **URL**: `/staff/sessions`
- **Purpose**: Danh sách yêu cầu tư vấn chưa được claim
- **Component**: `<StaffSessionList />`
- **Features**:
  - Auto-refresh mỗi 10s
  - Claim session
  - Show customer info
  - Time ago display

### Staff Chat

- **URL**: `/staff/chat/[roomId]?sessionId=[sessionId]`
- **Example**: `/staff/chat/123?sessionId=456`
- **Purpose**: Staff chat với customer
- **Features**:
  - Customer info display (name, username, phone)
  - Session info display
  - Realtime messaging
  - End session button
  - Confirmation dialog

## API Routes

Tất cả API calls đi qua `services/chat/api.ts` và sử dụng axios instance từ `config/axios.ts`.

Backend endpoints (qua proxy):

- `GET /chat/rooms` - Lấy danh sách rooms
- `GET /chat/rooms/:roomId` - Lấy room detail
- `GET /chat/rooms/:roomId/history` - Lấy lịch sử chat
- `POST /chat/rooms/:roomId/sessions` - Tạo session mới
- `GET /chat/sessions/unassigned` - Lấy sessions chưa claim
- `POST /chat/sessions/:sessionId/join` - Staff claim session
- `POST /chat/sessions/:sessionId/end` - Kết thúc session
- `GET /chat/sessions/:sessionId` - Lấy session detail
- `GET /chat/sessions/my-sessions` - Lấy sessions của user

## WebSocket Namespace

- **Namespace**: `/chat`
- **Full URL**: `${NEXT_PUBLIC_SOCKET_URL}/chat`
- **Auth**: JWT token in `auth` field

## Navigation Examples

### Add to Customer Sidebar/Menu

\`\`\`tsx
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

<Link href="/chat-test">
  <Button>
    <MessageSquare className="mr-2 h-4 w-4" />
    Tư vấn trực tuyến
  </Button>
</Link>
\`\`\`

### Add to Staff Dashboard

\`\`\`tsx
import Link from 'next/link';
import { MessageSquare, Badge } from 'lucide-react';

<Link href="/staff/sessions">
  <Button>
    <MessageSquare className="mr-2 h-4 w-4" />
    Yêu cầu tư vấn
    <Badge className="ml-2">5</Badge> {/* Count from API */}
  </Button>
</Link>
\`\`\`

## Route Guards

**Lưu ý**: Hiện tại chưa có route guards. Bạn cần implement:

1. **Customer routes** - Chỉ cho phép customer access
2. **Staff routes** - Chỉ cho phép staff access
3. **Authentication** - Redirect to login nếu chưa login

### Example Route Guard (Middleware)

\`\`\`tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
const token = request.cookies.get('accessToken');
const { pathname } = request.nextUrl;

// Protect staff routes
if (pathname.startsWith('/staff')) {
if (!token) {
return NextResponse.redirect(new URL('/login', request.url));
}
// TODO: Check if user is staff
}

// Protect customer chat routes
if (pathname.startsWith('/chat') && pathname !== '/chat-test') {
if (!token) {
return NextResponse.redirect(new URL('/login', request.url));
}
}

return NextResponse.next();
}

export const config = {
matcher: ['/staff/:path*', '/chat/:path*'],
};
\`\`\`

## Quick Start Examples

### Customer Flow

\`\`\`tsx
// In any page (e.g., app/(home)/support/page.tsx)
import CustomerConsultation from '@/components/chat/CustomerConsultation';

export default function SupportPage() {
return (
<div className="container py-8">
<h1>Tư vấn trực tuyến</h1>
<CustomerConsultation />
</div>
);
}
\`\`\`

### Staff Flow

\`\`\`tsx
// Already created at app/(dashboard)/staff/sessions/page.tsx
// Just navigate to /staff/sessions
\`\`\`

### Using SimpleChat Component

\`\`\`tsx
import SimpleChat from '@/components/chat/SimpleChat';

export default function MyCustomChatPage() {
const roomId = 123;
const currentUserId = 456;

return (
<div className="h-screen">
<SimpleChat 
        roomId={roomId} 
        currentUserId={currentUserId}
        className="h-full"
      />
</div>
);
}
\`\`\`

### Using useChat Hook

\`\`\`tsx
'use client';

import { useChat } from '@/hooks/useChat';

export default function MyCustomChat() {
const { messages, sendMessage, loading } = useChat({
roomId: 123,
onNewMessage: (msg) => {
console.log('New message:', msg);
},
});

// Custom UI implementation...
}
\`\`\`
