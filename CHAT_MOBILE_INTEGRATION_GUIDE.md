# 📱 HƯỚNG DẪN TÍCH HỢP CHAT CHO MOBILE

## 📋 MỤC LỤC

1. [Tổng Quan](#tổng-quan)
2. [State Management](#state-management)
3. [API Endpoints](#api-endpoints)
4. [WebSocket Events](#websocket-events)
5. [Flow Logic](#flow-logic)
6. [UI Components](#ui-components)
7. [Code Examples](#code-examples)

---

## 🎯 TỔNG QUAN

### Architecture

```
Mobile App
    ├── WebSocket Connection (Socket.IO)
    │   ├── Connect với JWT token
    │   ├── Auto-reconnect
    │   └── Event listeners
    │
    ├── REST API (Axios/Fetch)
    │   ├── GET /chat/sessions/current
    │   ├── POST /chat/rooms/:id/sessions
    │   └── GET /chat/rooms
    │
    └── UI Components
        ├── Floating Chat Bubble
        ├── Create Session Form
        └── Chat Interface
```

---

## 💾 STATE MANAGEMENT

### Core States

```typescript
// UI States
const [isOpen, setIsOpen] = useState(false); // Chat bubble mở/đóng
const [hasSession, setHasSession] = useState(false); // Có session hay không
const [loading, setLoading] = useState(false); // Loading state

// Session States
const [roomId, setRoomId] = useState<number | null>(null);
const [currentSession, setCurrentSession] = useState<Session | null>(null);
const [staffJoined, setStaffJoined] = useState(false);

// Form States
const [title, setTitle] = useState(""); // Tiêu đề yêu cầu tư vấn
const [creating, setCreating] = useState(false); // Đang tạo session

// Chat States
const [messages, setMessages] = useState<Message[]>([]);
const [inputMessage, setInputMessage] = useState("");
const [sending, setSending] = useState(false);
const [unreadCount, setUnreadCount] = useState(0); // Số tin nhắn chưa đọc

// Connection States
const [socket, setSocket] = useState<Socket | null>(null);
const [isConnected, setIsConnected] = useState(false);
const [currentUserId, setCurrentUserId] = useState<number | null>(null);
```

### Session Status

```typescript
type SessionStatus = "OPEN" | "ACTIVE" | "CLOSED";

// OPEN: Mới tạo, chờ staff
// ACTIVE: Staff đã join, đang tư vấn
// CLOSED: Đã kết thúc
```

---

## 🌐 API ENDPOINTS

### 1. **GET /chat/rooms**

Lấy room của customer (tự động tạo nếu chưa có)

**Request:**

```http
GET /chat/rooms
Authorization: Bearer {token}
```

**Response:**

```json
[
  {
    "id": 123,
    "customer": {
      "id": 456,
      "userName": "customer1",
      "firstName": "Minh",
      "lastName": "Anh"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. **GET /chat/sessions/current**

Lấy session hiện tại của customer

**Request:**

```http
GET /chat/sessions/current
Authorization: Bearer {token}
```

**Response:**

```json
// Có session
{
  "id": 8,
  "title": "Tư vấn dịch vụ spa",
  "roomId": 123,
  "status": "ACTIVE",
  "customer": {...},
  "staff": {...},
  "startedAt": "2024-01-01T00:00:00.000Z"
}

// Không có session
null
```

### 3. **POST /chat/rooms/:id/sessions**

Tạo session tư vấn mới

**Request:**

```http
POST /chat/rooms/123/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tư vấn dịch vụ spa cho chó"
}
```

**Response:**

```json
{
  "id": 8,
  "title": "Tư vấn dịch vụ spa cho chó",
  "roomId": 123,
  "status": "OPEN",
  "customer": {...},
  "startedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## ⚡ WEBSOCKET EVENTS

### Connection Setup

```typescript
import io from "socket.io-client";

const SOCKET_URL = "https://api.happypaws.com";
const token = await getAccessToken(); // From AsyncStorage

const socket = io(`${SOCKET_URL}/chat`, {
  auth: { token },
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});
```

### Events EMIT (Client → Server)

#### 1. **join_room**

Join vào room để nhận tin nhắn

```typescript
socket.emit("join_room", { roomId: 123 });
```

#### 2. **send_message**

Gửi tin nhắn

```typescript
socket.emit("send_message", {
  roomId: 123,
  content: "Xin chào staff!",
});
```

### Events LISTEN (Server → Client)

#### 1. **joined_room**

Xác nhận đã join room thành công

```typescript
socket.on("joined_room", (data) => {
  console.log("✅ Joined room:", data);
});
```

#### 2. **room_history**

Nhận lịch sử tin nhắn khi mới join

```typescript
socket.on("room_history", (data) => {
  setMessages(data.messages);

  // Count unread messages
  const unread = data.messages.filter(
    (m) => !m.isRead && m.sender.id !== currentUserId
  ).length;
  setUnreadCount(unread);
});
```

#### 3. **new_message** (REALTIME)

Nhận tin nhắn mới

```typescript
socket.on("new_message", (message: Message) => {
  // Add message to list
  setMessages((prev) => [...prev, message]);

  // Update unread count if chat is closed
  if (!isChatOpen && message.sender.id !== currentUserId) {
    setUnreadCount((prev) => prev + 1);
    showNotification("Tin nhắn mới từ staff");
  }
});
```

#### 4. **session_joined**

Staff vào tư vấn

```typescript
socket.on("session_joined", (data) => {
  setStaffJoined(true);
  setCurrentSession((prev) => ({
    ...prev,
    staff: data.staff,
    status: "ACTIVE",
  }));
  showToast("Staff đã vào tư vấn!");
});
```

#### 5. **session_ended**

Session kết thúc

```typescript
socket.on("session_ended", (data) => {
  setCurrentSession((prev) => ({
    ...prev,
    status: "CLOSED",
  }));
  showToast("Phiên tư vấn đã kết thúc");
  // ⚠️ KHÔNG disconnect socket để còn nhận tin nhắn cuối
});
```

---

## 🔄 FLOW LOGIC

### 1. **App Launch Flow**

```typescript
// Step 1: Connect WebSocket
connectSocket();

// Step 2: Get user info
const userId = await getUserId();
setCurrentUserId(userId);

// Step 3: Get room
const rooms = await fetch("/chat/rooms");
const roomId = rooms[0].id;
setRoomId(roomId);

// Step 4: Check current session
const currentSession = await fetch("/chat/sessions/current");

if (currentSession) {
  // Có session → Show chat UI
  setHasSession(true);
  setCurrentSession(currentSession);
  setStaffJoined(currentSession.status === "ACTIVE");

  // Join room via socket
  socket.emit("join_room", { roomId });
} else {
  // Không có session → Show create form
  setHasSession(false);
}
```

### 2. **Create Session Flow**

```typescript
const handleCreateSession = async (title: string) => {
  if (!title.trim()) {
    showError("Vui lòng nhập nội dung");
    return;
  }

  setCreating(true);

  try {
    // Call API to create session
    const session = await fetch(`/chat/rooms/${roomId}/sessions`, {
      method: "POST",
      body: JSON.stringify({ title: title.trim() }),
    });

    // Update states
    setHasSession(true);
    setCurrentSession(session);
    setTitle("");

    // Join room
    socket.emit("join_room", { roomId });

    showSuccess("Đã tạo yêu cầu tư vấn! Đang chờ staff...");
  } catch (error) {
    showError("Không thể tạo yêu cầu tư vấn");
  } finally {
    setCreating(false);
  }
};
```

### 3. **Send Message Flow**

```typescript
const sendMessage = async () => {
  if (!inputMessage.trim() || sending) return;

  const messageContent = inputMessage.trim();
  setInputMessage(""); // Clear input immediately
  setSending(true);

  try {
    socket.emit("send_message", {
      roomId,
      content: messageContent,
    });
    // Message sẽ được add vào list qua event 'new_message'
  } catch (error) {
    showError("Không thể gửi tin nhắn");
    setInputMessage(messageContent); // Restore input
  } finally {
    setSending(false);
  }
};
```

### 4. **Session End Flow**

```typescript
// Listen for session_ended event
socket.on("session_ended", (data) => {
  setCurrentSession((prev) => ({
    ...prev,
    status: "CLOSED",
  }));

  // Show button to create new session
  setShowCreateNewButton(true);

  showToast("Phiên tư vấn đã kết thúc");
});

// Handle create new session
const handleCreateNewSession = () => {
  setHasSession(false);
  setCurrentSession(null);
  setMessages([]);
  setTitle("");
  setStaffJoined(false);
  setShowCreateNewButton(false);
};
```

---

## 🎨 UI COMPONENTS

### 1. **Floating Chat Bubble**

```jsx
// Position: Fixed bottom-right
// Show when: Not on chat screen

<TouchableOpacity
  style={{
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EC4899", // Pink
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // Shadow on Android
    shadowColor: "#000", // Shadow on iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }}
  onPress={openChat}
>
  <Icon name="message-circle" size={28} color="#FFF" />

  {/* Unread Badge */}
  {unreadCount > 0 && (
    <View
      style={{
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "#EF4444", // Red
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
      }}
    >
      <Text style={{ color: "#FFF", fontSize: 11, fontWeight: "bold" }}>
        {unreadCount > 9 ? "9+" : unreadCount}
      </Text>
    </View>
  )}
</TouchableOpacity>
```

### 2. **Create Session Form**

```jsx
<View style={{ padding: 16 }}>
  <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
    Yêu cầu tư vấn
  </Text>

  <Text style={{ color: "#666", marginBottom: 16 }}>
    Nhập nội dung bạn cần tư vấn, đội ngũ staff sẽ hỗ trợ bạn ngay
  </Text>

  <TextInput
    placeholder="VD: Tư vấn về dịch vụ spa cho chó..."
    value={title}
    onChangeText={setTitle}
    maxLength={200}
    multiline
    style={{
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderRadius: 8,
      padding: 12,
      minHeight: 80,
      marginBottom: 8,
    }}
  />

  <Text style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>
    {title.length}/200 ký tự
  </Text>

  <TouchableOpacity
    onPress={handleCreateSession}
    disabled={!title.trim() || creating}
    style={{
      backgroundColor: title.trim() ? "#10B981" : "#D1D5DB",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
    }}
  >
    <Text style={{ color: "#FFF", fontWeight: "600" }}>
      {creating ? "Đang tạo..." : "Tạo yêu cầu tư vấn"}
    </Text>
  </TouchableOpacity>
</View>
```

### 3. **Chat Interface**

```jsx
<View style={{ flex: 1 }}>
  {/* Header */}
  <View
    style={{
      backgroundColor: "#10B981",
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity onPress={closeChat}>
        <Icon name="arrow-left" size={24} color="#FFF" />
      </TouchableOpacity>
      <Text
        style={{
          color: "#FFF",
          fontSize: 18,
          fontWeight: "600",
          marginLeft: 12,
        }}
      >
        Chat tư vấn
      </Text>
    </View>

    {/* Status Badge */}
    <View
      style={{
        backgroundColor: staffJoined ? "#10B981" : "#F59E0B",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
      }}
    >
      <Text style={{ color: "#FFF", fontSize: 11 }}>
        {staffJoined ? "✓ Đã kết nối" : "⏳ Đang chờ staff"}
      </Text>
    </View>
  </View>

  {/* Messages List */}
  <FlatList
    data={messages}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <MessageBubble message={item} isOwn={item.sender.id === currentUserId} />
    )}
    ref={flatListRef}
    onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
  />

  {/* Input Box */}
  {currentSession?.status === "CLOSED" ? (
    // Show create new session button
    <TouchableOpacity
      onPress={handleCreateNewSession}
      style={{
        margin: 16,
        padding: 16,
        backgroundColor: "#EC4899",
        borderRadius: 8,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#FFF", fontWeight: "600" }}>
        Tạo phiên tư vấn mới
      </Text>
    </TouchableOpacity>
  ) : (
    // Show input
    <View
      style={{
        flexDirection: "row",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        alignItems: "center",
      }}
    >
      <TextInput
        value={inputMessage}
        onChangeText={setInputMessage}
        placeholder="Nhập tin nhắn..."
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginRight: 8,
        }}
      />
      <TouchableOpacity
        onPress={sendMessage}
        disabled={!inputMessage.trim() || sending}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: inputMessage.trim() ? "#10B981" : "#D1D5DB",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name="send" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  )}
</View>
```

### 4. **Message Bubble**

```jsx
const MessageBubble = ({ message, isOwn }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: isOwn ? "flex-end" : "flex-start",
      marginVertical: 4,
      marginHorizontal: 12,
    }}
  >
    {!isOwn && (
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#10B981",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        <Text style={{ color: "#FFF", fontWeight: "bold" }}>
          {message.sender.firstName[0]}
          {message.sender.lastName[0]}
        </Text>
      </View>
    )}

    <View
      style={{
        maxWidth: "70%",
        backgroundColor: isOwn ? "#EC4899" : "#F3F4F6",
        padding: 12,
        borderRadius: 16,
        borderBottomRightRadius: isOwn ? 4 : 16,
        borderBottomLeftRadius: isOwn ? 16 : 4,
      }}
    >
      {!isOwn && (
        <Text style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
          {message.sender.firstName} {message.sender.lastName}
        </Text>
      )}

      <Text
        style={{
          color: isOwn ? "#FFF" : "#1F2937",
          fontSize: 14,
        }}
      >
        {message.content}
      </Text>

      <Text
        style={{
          fontSize: 10,
          color: isOwn ? "#FFF9" : "#9CA3AF",
          marginTop: 4,
          textAlign: "right",
        }}
      >
        {formatTime(message.createdAt)}
      </Text>
    </View>
  </View>
);
```

---

## 💻 CODE EXAMPLES

### Complete React Native Implementation

```typescript
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = () => {
  // States
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [hasSession, setHasSession] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [title, setTitle] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [staffJoined, setStaffJoined] = useState(false);

  const flatListRef = useRef(null);

  // Initialize
  useEffect(() => {
    initializeChat();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initializeChat = async () => {
    // 1. Get token and user info
    const token = await AsyncStorage.getItem("accessToken");
    const userStr = await AsyncStorage.getItem("user");
    const user = JSON.parse(userStr);
    setCurrentUserId(user.id);

    // 2. Connect WebSocket
    const socketInstance = io("https://api.happypaws.com/chat", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // 3. Get room
    const rooms = await fetch("https://api.happypaws.com/chat/rooms", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    const room = rooms[0];
    setRoomId(room.id);

    // 4. Check current session
    const session = await fetch(
      "https://api.happypaws.com/chat/sessions/current",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((r) => r.json());

    if (session) {
      setHasSession(true);
      setCurrentSession(session);
      setStaffJoined(session.status === "ACTIVE");

      // Join room
      socketInstance.emit("join_room", { roomId: room.id });
    }
  };

  // Setup socket listeners
  useEffect(() => {
    if (!socket || !isConnected || !roomId || !hasSession) return;

    socket.on("room_history", (data) => {
      setMessages(data.messages);
    });

    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("session_joined", (data) => {
      setStaffJoined(true);
      setCurrentSession((prev) => ({
        ...prev,
        staff: data.staff,
        status: "ACTIVE",
      }));
      alert("Staff đã vào tư vấn!");
    });

    socket.on("session_ended", () => {
      setCurrentSession((prev) => ({
        ...prev,
        status: "CLOSED",
      }));
      alert("Phiên tư vấn đã kết thúc");
    });

    return () => {
      socket.off("room_history");
      socket.off("new_message");
      socket.off("session_joined");
      socket.off("session_ended");
    };
  }, [socket, isConnected, roomId, hasSession]);

  // Create session
  const handleCreateSession = async () => {
    const token = await AsyncStorage.getItem("accessToken");

    const session = await fetch(
      `https://api.happypaws.com/chat/rooms/${roomId}/sessions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      }
    ).then((r) => r.json());

    setHasSession(true);
    setCurrentSession(session);
    setTitle("");

    socket.emit("join_room", { roomId });
  };

  // Send message
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    socket.emit("send_message", {
      roomId,
      content: inputMessage.trim(),
    });

    setInputMessage("");
  };

  // Render
  return (
    <View style={{ flex: 1 }}>
      {!hasSession ? (
        // Create Session Form
        <View style={{ padding: 16 }}>
          <Text>Tạo yêu cầu tư vấn</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Nhập nội dung..."
          />
          <TouchableOpacity onPress={handleCreateSession}>
            <Text>Tạo yêu cầu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Chat Interface
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <Text>
                  {item.sender.firstName}: {item.content}
                </Text>
              </View>
            )}
          />

          {currentSession?.status === "CLOSED" ? (
            <TouchableOpacity
              onPress={() => {
                setHasSession(false);
                setCurrentSession(null);
                setMessages([]);
              }}
            >
              <Text>Tạo phiên tư vấn mới</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TextInput
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder="Nhập tin nhắn..."
              />
              <TouchableOpacity onPress={sendMessage}>
                <Text>Gửi</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ChatScreen;
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. **Authentication**

```typescript
// Socket.IO cần JWT token khi connect
const token = await AsyncStorage.getItem("accessToken");

const socket = io(SOCKET_URL, {
  auth: { token }, // ← Bắt buộc
});
```

### 2. **Session Status**

```typescript
// OPEN: Mới tạo, chờ staff
if (session.status === "OPEN") {
  showStatus("Đang chờ staff...");
}

// ACTIVE: Staff đã vào
if (session.status === "ACTIVE") {
  showStatus("Đang tư vấn");
}

// CLOSED: Đã kết thúc
if (session.status === "CLOSED") {
  showCreateNewButton();
}
```

### 3. **Don't Disconnect on Session End**

```typescript
// ❌ WRONG
socket.on("session_ended", () => {
  socket.disconnect(); // Sẽ không nhận được tin nhắn cuối
});

// ✅ CORRECT
socket.on("session_ended", () => {
  // Chỉ update UI, KHÔNG disconnect
  setSessionStatus("CLOSED");
});
```

### 4. **Unread Counter**

```typescript
// Count messages where:
// - isRead = false
// - sender.id !== currentUserId

const unread = messages.filter(
  (m) => !m.isRead && m.sender.id !== currentUserId
).length;
```

### 5. **Auto Scroll**

```typescript
// Scroll to bottom khi có tin nhắn mới
useEffect(() => {
  flatListRef.current?.scrollToEnd({ animated: true });
}, [messages]);
```

---

## 🎯 CHECKLIST IMPLEMENTATION

- [ ] Setup Socket.IO client
- [ ] Implement authentication flow
- [ ] Create WebSocket connection manager
- [ ] Implement API services (rooms, sessions, messages)
- [ ] Build Create Session Form UI
- [ ] Build Chat Interface UI
- [ ] Implement message sending/receiving
- [ ] Handle session lifecycle (OPEN → ACTIVE → CLOSED)
- [ ] Implement unread counter
- [ ] Add notifications (local notifications)
- [ ] Handle reconnection logic
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test edge cases (offline, session ended, etc.)

---

## 📚 RESOURCES

- Socket.IO Client: https://socket.io/docs/v4/client-api/
- React Native: https://reactnative.dev/
- Flutter Socket.IO: https://pub.dev/packages/socket_io_client
- AsyncStorage: https://react-native-async-storage.github.io/

---

**Made with ❤️ for Mobile Development Team**
