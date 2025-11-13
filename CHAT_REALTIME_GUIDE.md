# Chat Realtime Implementation Guide

## Tổng quan

Hệ thống chat realtime sử dụng **REST API** cho các thao tác quản lý và **WebSocket (Socket.IO)** cho chat realtime. Luồng hoạt động dựa trên **Room** (phòng chat) và **Session** (phiên tư vấn).

## Kiến trúc

- **Room**: Phòng chat vĩnh viễn của customer, không bị xóa
- **Session**: Phiên tư vấn tạm thời trong room, được tạo khi customer cần tư vấn
- **WebSocket**: Kết nối realtime tại namespace `/chat`

---

## 1. LUỒNG CUSTOMER

### Bước 1: Lấy Room của Customer

**Lưu ý quan trọng**: Room được tạo tự động khi customer đăng ký tài khoản. Mỗi customer sẽ có 1 room vĩnh viễn.

**API: GET /chat/rooms**

```typescript
// Lấy danh sách rooms của customer (thường chỉ có 1 room)
const response = await fetch('/api/chat/rooms', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const rooms = await response.json();

// Sử dụng room đầu tiên (mỗi customer chỉ có 1 room)
const room = rooms[0];

if (!room) {
  // Nếu không có room (trường hợp hiếm), cần liên hệ admin
  console.error('Customer chưa có room. Vui lòng liên hệ admin.');
}
```

### Bước 2: Customer bấm nút "Tư vấn" và chọn topic

**API: POST /chat/rooms/:id/sessions**

```typescript
// Customer tạo session với topic
const createSession = async (roomId: number, topic: string) => {
  const response = await fetch(`/api/chat/rooms/${roomId}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: topic, // Ví dụ: "Tư vấn về dịch vụ chăm sóc thú cưng"
    }),
  });

  const session = await response.json();
  return session;
};
```

**Response:**

```json
{
  "id": 1,
  "title": "Tư vấn về dịch vụ chăm sóc thú cưng",
  "status": "OPEN",
  "startedAt": "2024-01-01T10:00:00Z",
  "roomId": 1,
  "customerId": 1,
  "staffId": null,
  "room": { ... },
  "customer": { ... },
  "staff": null
}
```

### Bước 3: Kết nối WebSocket và Join Room

```typescript
import { io } from 'socket.io-client';

// Kết nối WebSocket với JWT token
const socket = io('http://your-api-url/chat', {
  auth: {
    token: yourJwtToken,
  },
  // Hoặc có thể dùng query
  query: {
    token: yourJwtToken,
  },
});

// Lắng nghe sự kiện kết nối
socket.on('connected', (data) => {
  console.log('Connected to chat server', data);
  // { message: 'Connected to chat server', userId: 1, userRole: 'CUSTOMER' }
});

// Join room
socket.emit('join_room', { roomId: roomId });

// Lắng nghe xác nhận join room
socket.on('joined_room', (data) => {
  console.log('Joined room', data);
  // { roomId: 1, message: 'Successfully joined room' }
});

// Lắng nghe lịch sử tin nhắn
socket.on('room_history', (data) => {
  console.log('Room history', data);
  // { messages: [...], pagination: {...} }
  // Hiển thị tin nhắn cũ
});

// Lắng nghe khi staff/admin join session
socket.on('session_joined', (data) => {
  console.log('Staff joined session', data);
  // { sessionId: 1, roomId: 1, staff: {...} }
  // Hiển thị thông báo: "Staff [name] đã vào tư vấn"
});
```

### Bước 4: Gửi và nhận tin nhắn

```typescript
// Gửi tin nhắn
const sendMessage = (roomId: number, content: string) => {
  socket.emit('send_message', {
    roomId: roomId,
    content: content,
  });
};

// Lắng nghe tin nhắn mới
socket.on('new_message', (message) => {
  console.log('New message', message);
  // {
  //   id: 123,
  //   content: "Xin chào, tôi cần tư vấn...",
  //   createdAt: "2024-01-01T10:05:00Z",
  //   sender: {
  //     id: 1,
  //     userName: "customer123",
  //     firstName: "Nguyen",
  //     lastName: "Van A",
  //     avatar: "https://..."
  //   },
  //   roomId: 1
  // }
  // Hiển thị tin nhắn trong UI
});

// Lắng nghe lỗi
socket.on('error', (error) => {
  console.error('Socket error', error);
  // { message: "Error message" }
});
```

### Bước 5: Lắng nghe khi staff/admin rời khỏi

```typescript
// Lắng nghe khi user rời khỏi room
socket.on('user_left', (data) => {
  console.log('User left', data);
  // { roomId: 1, userId: 2, userName: "staff123" }
  // Hiển thị thông báo: "Staff đã rời khỏi phòng"
});
```

---

## 2. LUỒNG STAFF/ADMIN

Staff/Admin có **2 cách** để tư vấn customer:

### **Cách 1: Qua Sessions (Khuyến nghị)**

#### Bước 1: Xem danh sách sessions chưa được tư vấn

**API: GET /chat/sessions/unassigned**

```typescript
// Lấy danh sách sessions chưa được claim
const getUnassignedSessions = async () => {
  const response = await fetch('/api/chat/sessions/unassigned', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const sessions = await response.json();
  return sessions;
};
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "Tư vấn về dịch vụ chăm sóc thú cưng",
    "status": "OPEN",
    "startedAt": "2024-01-01T10:00:00Z",
    "roomId": 1,
    "customerId": 1,
    "staffId": null,
    "room": {
      "id": 1,
      "customer": {
        "id": 1,
        "userName": "customer123",
        "firstName": "Nguyen",
        "lastName": "Van A",
        "avatar": "https://..."
      }
    },
    "customer": { ... }
  }
]
```

#### Bước 2: Staff/Admin claim session (vào tư vấn)

**API: POST /chat/sessions/:id/join**

```typescript
// Staff/Admin claim session
const claimSession = async (sessionId: number) => {
  const response = await fetch(`/api/chat/sessions/${sessionId}/join`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const session = await response.json();
  return session;
};
```

**Response:**

```json
{
  "id": 1,
  "title": "Tư vấn về dịch vụ chăm sóc thú cưng",
  "status": "IN_PROGRESS",
  "startedAt": "2024-01-01T10:00:00Z",
  "roomId": 1,
  "customerId": 1,
  "staffId": 2,
  "room": { ... },
  "customer": { ... },
  "staff": {
    "id": 2,
    "userName": "staff123",
    "firstName": "Tran",
    "lastName": "Thi B"
  }
}
```

**Lưu ý quan trọng**:

- Chỉ có **1 staff/admin** có thể claim session (first-come-first-served)
- Sau khi claim, session sẽ không còn trong danh sách `unassigned` nữa
- Cần refresh danh sách `unassigned` sau khi claim

#### Bước 3: Kết nối WebSocket và Join Room

```typescript
// Kết nối WebSocket (tương tự customer)
const socket = io('http://your-api-url/chat', {
  auth: { token: yourJwtToken },
});

socket.on('connected', (data) => {
  console.log('Connected', data);
});

// Join room của session
socket.emit('join_room', { roomId: session.roomId });

socket.on('joined_room', (data) => {
  console.log('Joined room', data);
});

// Lắng nghe lịch sử tin nhắn
socket.on('room_history', (data) => {
  // Hiển thị tin nhắn cũ
});
```

#### Bước 4: Gửi và nhận tin nhắn

```typescript
// Gửi tin nhắn (tương tự customer)
socket.emit('send_message', {
  roomId: session.roomId,
  content: 'Xin chào, tôi có thể giúp gì cho bạn?',
});

// Lắng nghe tin nhắn mới
socket.on('new_message', (message) => {
  // Hiển thị tin nhắn
});
```

#### Bước 5: Kết thúc session (rời khỏi phòng)

**API: POST /chat/sessions/:id/end**

```typescript
// Staff/Admin kết thúc session
const endSession = async (sessionId: number) => {
  const response = await fetch(`/api/chat/sessions/${sessionId}/end`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const session = await response.json();
  return session;
};
```

**Response:**

```json
{
  "id": 1,
  "status": "ENDED",
  "endedAt": "2024-01-01T11:00:00Z",
  ...
}
```

**Lưu ý quan trọng:**

- Khi end session, **room vẫn mở** (không bị đóng)
- **`room.staffId` KHÔNG bị clear** - room vẫn giữ staff đã assign
- Customer có thể tạo session mới ngay sau đó
- Staff/admin khác có thể claim session mới của customer này

**Sau khi end session:**

```typescript
// Leave room (WebSocket)
socket.emit('leave_room', { roomId: session.roomId });

// Leave session (WebSocket)
socket.emit('leave_session', { sessionId: sessionId });

// Quay lại danh sách unassigned sessions
// Session này sẽ không còn trong danh sách unassigned nữa
// Room vẫn còn và sẵn sàng cho session mới
// Customer có thể tạo session mới, staff/admin khác có thể vào tư vấn
```

---

### **Cách 2: Qua Rooms (Trực tiếp)**

#### Bước 1: Xem danh sách unassigned rooms

**API: GET /chat/rooms/unassigned**

```typescript
// Lấy danh sách rooms chưa được assign
const getUnassignedRooms = async () => {
  const response = await fetch('/api/chat/rooms/unassigned', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const rooms = await response.json();
  return rooms;
};
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Support Request #123",
    "isClosed": false,
    "customerId": 5,
    "staffId": null,
    "customer": {
      "id": 5,
      "userName": "john_doe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://..."
    },
    "messages": [...],
    "_count": {
      "messages": 10
    }
  }
]
```

#### Bước 2: Kết nối WebSocket và Join Room

```typescript
// Kết nối WebSocket
const socket = io('http://your-api-url/chat', {
  auth: { token: yourJwtToken },
});

socket.on('connected', (data) => {
  console.log('Connected', data);
});

// Join unassigned room (staff có thể join trực tiếp)
socket.emit('join_room', { roomId: roomId });

socket.on('joined_room', (data) => {
  console.log('Joined room', data);
});

// Lắng nghe lịch sử tin nhắn
socket.on('room_history', (data) => {
  // Hiển thị tin nhắn cũ
});
```

#### Bước 3: Gửi tin nhắn đầu tiên → Tự động assign

```typescript
// Khi staff gửi tin nhắn đầu tiên trong unassigned room,
// hệ thống sẽ TỰ ĐỘNG assign staff vào room
socket.emit('send_message', {
  roomId: roomId,
  content: 'Xin chào, tôi có thể giúp gì cho bạn?',
});

// Lắng nghe tin nhắn mới
socket.on('new_message', (message) => {
  // Hiển thị tin nhắn
});
```

**Lưu ý quan trọng:**

- Staff có thể join unassigned rooms trực tiếp qua WebSocket
- Khi staff gửi tin nhắn đầu tiên, hệ thống **tự động assign** staff vào room
- Chỉ **1 staff** có thể được assign (first-come-first-served, có race condition protection)
- Nếu nhiều staff cùng gửi tin nhắn, chỉ người đầu tiên được assign

#### Bước 4: Xem danh sách assigned rooms

**API: GET /chat/rooms/assigned**

```typescript
// Lấy danh sách rooms đã được assign cho staff/admin
const getAssignedRooms = async () => {
  const response = await fetch('/api/chat/rooms/assigned', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const rooms = await response.json();
  return rooms;
};
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Support Request #123",
    "isClosed": false,
    "customerId": 5,
    "staffId": 10,
    "customer": {
      "id": 5,
      "userName": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "staff": {
      "id": 10,
      "userName": "staff_mary",
      "firstName": "Mary",
      "lastName": "Smith"
    },
    "messages": [...],
    "_count": {
      "messages": 15
    }
  }
]
```

**Lưu ý:**

- **Admin**: Thấy tất cả assigned rooms (của tất cả staff)
- **Staff**: Chỉ thấy rooms được assign cho họ (`staffId = userId`)

---

## 3. CÁC SỰ KIỆN WEBSOCKET

### Events từ Client → Server

| Event           | Payload                               | Mô tả                                 |
| --------------- | ------------------------------------- | ------------------------------------- |
| `join_room`     | `{ roomId: number }`                  | Join vào room để nhận tin nhắn        |
| `leave_room`    | `{ roomId: number }`                  | Rời khỏi room                         |
| `send_message`  | `{ roomId: number, content: string }` | Gửi tin nhắn                          |
| `join_session`  | `{ sessionId: number }`               | Staff/Admin claim session (WebSocket) |
| `leave_session` | `{ sessionId: number }`               | Rời khỏi session                      |

### Events từ Server → Client

| Event            | Payload                                                 | Mô tả               |
| ---------------- | ------------------------------------------------------- | ------------------- |
| `connected`      | `{ message: string, userId: number, userRole: string }` | Xác nhận kết nối    |
| `joined_room`    | `{ roomId: number, message: string }`                   | Xác nhận join room  |
| `room_history`   | `{ messages: [...], pagination: {...} }`                | Lịch sử tin nhắn    |
| `new_message`    | `{ id, content, createdAt, sender, roomId }`            | Tin nhắn mới        |
| `user_joined`    | `{ roomId, userId, userName }`                          | User khác join room |
| `user_left`      | `{ roomId, userId, userName }`                          | User rời khỏi room  |
| `session_joined` | `{ sessionId, roomId, staff }`                          | Staff claim session |
| `session_left`   | `{ sessionId, userId, userName }`                       | User rời session    |
| `error`          | `{ message: string }`                                   | Lỗi                 |

---

## 4. FLOW DIAGRAM

### Customer Flow

```
1. Customer bấm "Tư vấn"
   ↓
2. Chọn topic (hoặc nhập topic)
   ↓
3. POST /chat/rooms/:id/sessions (tạo session)
   ↓
4. Kết nối WebSocket
   ↓
5. socket.emit('join_room', { roomId })
   ↓
6. Nhận room_history → Hiển thị tin nhắn cũ
   ↓
7. Gửi/nhận tin nhắn realtime
   ↓
8. Lắng nghe session_joined → Staff đã vào
   ↓
9. Tiếp tục chat với staff
```

### Staff/Admin Flow (Qua Sessions)

```
1. GET /chat/sessions/unassigned (xem danh sách)
   ↓
2. Chọn session cần tư vấn
   ↓
3. POST /chat/sessions/:id/join (claim session)
   ↓
4. Kết nối WebSocket
   ↓
5. socket.emit('join_room', { roomId })
   ↓
6. Nhận room_history → Hiển thị tin nhắn cũ
   ↓
7. Gửi/nhận tin nhắn realtime
   ↓
8. Khi xong: POST /chat/sessions/:id/end
   ↓
9. socket.emit('leave_room', { roomId })
   ↓
10. Quay lại danh sách unassigned
```

### Staff/Admin Flow (Qua Rooms - Trực tiếp)

```
1. GET /chat/rooms/unassigned (xem danh sách)
   ↓
2. Chọn room cần tư vấn
   ↓
3. Kết nối WebSocket
   ↓
4. socket.emit('join_room', { roomId })
   ↓
5. Nhận room_history → Hiển thị tin nhắn cũ
   ↓
6. Gửi tin nhắn đầu tiên → Tự động assign vào room
   ↓
7. Gửi/nhận tin nhắn realtime
   ↓
8. GET /chat/rooms/assigned (xem rooms đã assign)
   ↓
9. socket.emit('leave_room', { roomId })
```

---

## 5. VÍ DỤ CODE HOÀN CHỈNH

### Customer Component (React/Vue)

```typescript
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

function CustomerChat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // 1. Lấy room của customer
  useEffect(() => {
    const fetchRoom = async () => {
      const res = await fetch('/api/chat/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rooms = await res.json();
      if (rooms.length > 0) {
        setRoom(rooms[0]);
      }
    };
    fetchRoom();
  }, []);

  // 2. Kết nối WebSocket
  useEffect(() => {
    if (!room) return;

    const newSocket = io('http://your-api-url/chat', {
      auth: { token: yourJwtToken }
    });

    newSocket.on('connected', (data) => {
      console.log('Connected', data);
      // Join room
      newSocket.emit('join_room', { roomId: room.id });
    });

    newSocket.on('joined_room', (data) => {
      console.log('Joined room', data);
    });

    newSocket.on('room_history', (data) => {
      setMessages(data.messages);
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('session_joined', (data) => {
      console.log('Staff joined', data);
      // Hiển thị thông báo: "Staff đã vào tư vấn"
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [room]);

  // 3. Tạo session khi bấm "Tư vấn"
  const handleStartConsultation = async (topic: string) => {
    if (!room) return;

    const res = await fetch(`/api/chat/rooms/${room.id}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: topic })
    });

    const newSession = await res.json();
    setSession(newSession);
  };

  // 4. Gửi tin nhắn
  const handleSendMessage = () => {
    if (!socket || !room || !inputMessage.trim()) return;

    socket.emit('send_message', {
      roomId: room.id,
      content: inputMessage
    });

    setInputMessage('');
  };

  return (
    <div>
      {/* UI: Nút tư vấn, chọn topic, chat interface */}
    </div>
  );
}
```

### Staff/Admin Component - Qua Sessions (React/Vue)

```typescript
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

function StaffChatSessions() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unassignedSessions, setUnassignedSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // 1. Lấy danh sách unassigned sessions
  const fetchUnassignedSessions = async () => {
    const res = await fetch('/api/chat/sessions/unassigned', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const sessions = await res.json();
    setUnassignedSessions(sessions);
  };

  useEffect(() => {
    fetchUnassignedSessions();
    // Refresh mỗi 5 giây
    const interval = setInterval(fetchUnassignedSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Claim session
  const handleClaimSession = async (sessionId: number) => {
    const res = await fetch(`/api/chat/sessions/${sessionId}/join`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const session = await res.json();
    setCurrentSession(session);

    // Refresh danh sách
    fetchUnassignedSessions();

    // Kết nối WebSocket và join room
    const newSocket = io('http://your-api-url/chat', {
      auth: { token: yourJwtToken }
    });

    newSocket.on('connected', () => {
      newSocket.emit('join_room', { roomId: session.roomId });
    });

    newSocket.on('room_history', (data) => {
      setMessages(data.messages);
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);
  };

  // 3. End session
  const handleEndSession = async () => {
    if (!currentSession) return;

    await fetch(`/api/chat/sessions/${currentSession.id}/end`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Leave room
    if (socket) {
      socket.emit('leave_room', { roomId: currentSession.roomId });
      socket.close();
      setSocket(null);
    }

    setCurrentSession(null);
    setMessages([]);
    fetchUnassignedSessions();
  };

  // 4. Gửi tin nhắn
  const handleSendMessage = () => {
    if (!socket || !currentSession || !inputMessage.trim()) return;

    socket.emit('send_message', {
      roomId: currentSession.roomId,
      content: inputMessage
    });

    setInputMessage('');
  };

  return (
    <div>
      {!currentSession ? (
        <div>
          <h2>Danh sách sessions chưa được tư vấn</h2>
          {unassignedSessions.map(session => (
            <div key={session.id} onClick={() => handleClaimSession(session.id)}>
              <p>Topic: {session.title}</p>
              <p>Customer: {session.customer.firstName} {session.customer.lastName}</p>
              <button>Vào tư vấn</button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>Đang tư vấn: {currentSession.title}</h2>
          <div>
            {messages.map(msg => (
              <div key={msg.id}>{msg.content}</div>
            ))}
          </div>
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Gửi</button>
          <button onClick={handleEndSession}>Kết thúc tư vấn</button>
        </div>
      )}
    </div>
  );
}
```

### Staff/Admin Component - Qua Rooms (React/Vue)

```typescript
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

function StaffChatRooms() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unassignedRooms, setUnassignedRooms] = useState<any[]>([]);
  const [assignedRooms, setAssignedRooms] = useState<any[]>([]);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // 1. Lấy danh sách unassigned rooms
  const fetchUnassignedRooms = async () => {
    const res = await fetch('/api/chat/rooms/unassigned', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const rooms = await res.json();
    setUnassignedRooms(rooms);
  };

  // 2. Lấy danh sách assigned rooms
  const fetchAssignedRooms = async () => {
    const res = await fetch('/api/chat/rooms/assigned', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const rooms = await res.json();
    setAssignedRooms(rooms);
  };

  useEffect(() => {
    fetchUnassignedRooms();
    fetchAssignedRooms();
    // Refresh mỗi 5 giây
    const interval = setInterval(() => {
      fetchUnassignedRooms();
      fetchAssignedRooms();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 3. Join room và kết nối WebSocket
  const handleJoinRoom = (roomId: number) => {
    setCurrentRoom(unassignedRooms.find(r => r.id === roomId) || assignedRooms.find(r => r.id === roomId));

    // Kết nối WebSocket
    const newSocket = io('http://your-api-url/chat', {
      auth: { token: yourJwtToken }
    });

    newSocket.on('connected', () => {
      newSocket.emit('join_room', { roomId });
    });

    newSocket.on('joined_room', () => {
      console.log('Joined room', roomId);
    });

    newSocket.on('room_history', (data) => {
      setMessages(data.messages);
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      // Refresh assigned rooms nếu room được assign
      if (message.roomId === roomId) {
        fetchAssignedRooms();
      }
    });

    setSocket(newSocket);
  };

  // 4. Gửi tin nhắn (tự động assign nếu là unassigned room)
  const handleSendMessage = () => {
    if (!socket || !currentRoom || !inputMessage.trim()) return;

    socket.emit('send_message', {
      roomId: currentRoom.id,
      content: inputMessage
    });

    setInputMessage('');

    // Refresh sau khi gửi (để cập nhật assigned status)
    setTimeout(() => {
      fetchUnassignedRooms();
      fetchAssignedRooms();
    }, 500);
  };

  // 5. Leave room
  const handleLeaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('leave_room', { roomId: currentRoom.id });
      socket.close();
      setSocket(null);
    }
    setCurrentRoom(null);
    setMessages([]);
  };

  return (
    <div>
      {!currentRoom ? (
        <div>
          <div>
            <h2>Rooms chưa được assign</h2>
            {unassignedRooms.map(room => (
              <div key={room.id} onClick={() => handleJoinRoom(room.id)}>
                <p>Customer: {room.customer.firstName} {room.customer.lastName}</p>
                <p>Messages: {room._count.messages}</p>
                <button>Vào tư vấn</button>
              </div>
            ))}
          </div>
          <div>
            <h2>Rooms đã được assign cho tôi</h2>
            {assignedRooms.map(room => (
              <div key={room.id} onClick={() => handleJoinRoom(room.id)}>
                <p>Customer: {room.customer.firstName} {room.customer.lastName}</p>
                <p>Messages: {room._count.messages}</p>
                <button>Vào chat</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2>Chat với {currentRoom.customer.firstName} {currentRoom.customer.lastName}</h2>
          <button onClick={handleLeaveRoom}>Rời khỏi</button>
          <div>
            {messages.map(msg => (
              <div key={msg.id}>{msg.content}</div>
            ))}
          </div>
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Gửi</button>
        </div>
      )}
    </div>
  );
}
```

---

## 6. LƯU Ý QUAN TRỌNG

1. **Room không bị xóa**: Room là vĩnh viễn, chỉ session mới bị end
2. **Room.staffId không bị clear**: Khi end session, `room.staffId` vẫn giữ nguyên (không clear về null)
3. **Session chỉ có 1 staff claim**: First-come-first-served, sau khi claim thì không còn trong unassigned
4. **Auto-assign khi gửi tin nhắn**: Staff có thể join unassigned room trực tiếp, và sẽ tự động assign khi gửi tin nhắn đầu tiên
5. **Race condition protection**: Nếu nhiều staff cùng gửi tin nhắn vào unassigned room, chỉ người đầu tiên được assign
6. **WebSocket cần JWT token**: Phải gửi token khi kết nối
7. **Refresh danh sách**: Staff/Admin nên refresh định kỳ hoặc dùng WebSocket để realtime
8. **Error handling**: Luôn lắng nghe event `error` từ WebSocket
9. **Reconnect**: Xử lý reconnect khi mất kết nối WebSocket
10. **2 cách tư vấn**: Staff/Admin có thể tư vấn qua Sessions (khuyến nghị) hoặc qua Rooms (trực tiếp)

---

## 7. API ENDPOINTS TÓM TẮT

### Customer

- `GET /chat/rooms` - Lấy danh sách rooms
- `GET /chat/rooms/:id` - Lấy chi tiết room
- `GET /chat/rooms/:id/messages` - Lấy lịch sử tin nhắn
- `POST /chat/rooms/:id/sessions` - Tạo session (tư vấn)

### Staff/Admin

**Sessions:**

- `GET /chat/sessions/unassigned` - Lấy danh sách sessions chưa được tư vấn
- `POST /chat/sessions/:id/join` - Claim session (vào tư vấn)
- `POST /chat/sessions/:id/end` - Kết thúc session

**Rooms:**

- `GET /chat/rooms/unassigned` - Lấy danh sách rooms chưa được assign
- `GET /chat/rooms/assigned` - Lấy danh sách rooms đã được assign cho staff/admin
- `GET /chat/rooms` - Lấy danh sách rooms (staff thấy assigned rooms, admin thấy tất cả)

### WebSocket

- Namespace: `/chat`
- Events: `join_room`, `leave_room`, `send_message`, `join_session`, `leave_session`

---

## 8. TESTING

### Test Customer Flow

1. Customer tạo session với topic
2. Kiểm tra session xuất hiện trong unassigned
3. Kết nối WebSocket và join room
4. Gửi tin nhắn và kiểm tra nhận được

### Test Staff Flow

1. Staff xem danh sách unassigned
2. Claim session
3. Kiểm tra session không còn trong unassigned
4. Kết nối WebSocket và join room
5. Gửi/nhận tin nhắn
6. End session và kiểm tra quay lại danh sách

---

Chúc bạn implement thành công! 🚀
