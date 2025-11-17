# 💬 CHAT BUBBLE - HƯỚNG DẪN SỬ DỤNG

## 🎯 Tổng quan

ChatBubble là một component bong bóng chat nổi ở góc phải dưới màn hình, cho phép customer:

1. Tạo yêu cầu tư vấn lần đầu
2. Chat trực tiếp với staff sau khi tạo
3. Thu gọn/mở rộng chat window
4. Nhận thông báo tin nhắn mới khi đang đóng

## ✨ Tính năng

### 🔔 Thông báo

- Badge đỏ hiển thị số tin nhắn chưa đọc
- Toast notification khi có tin nhắn mới (bubble đóng)
- Animation bounce-slow cho bubble

### 💬 Chat

- Realtime messaging qua WebSocket
- Hiển thị trạng thái staff (chờ/đang tư vấn)
- Auto-scroll tin nhắn
- Avatar với initials
- Timestamp cho mỗi tin nhắn

### 🎨 UI/UX

- Gradient background (pink to purple)
- Smooth animations (slide-in, bounce)
- Responsive design
- Dark mode support
- Loading states
- Disabled states khi session closed

## 📍 Vị trí

ChatBubble đã được tích hợp sẵn vào `app/(home)/layout.tsx`, hiển thị trên mọi trang customer.

```tsx
// app/(home)/layout.tsx
return (
  <PushLayout>
    <div>
      <Header />
      <main>{children}</main>
      <Footer />

      {/* Chat Bubble */}
      <ChatBubble />
    </div>
  </PushLayout>
);
```

## 🔧 Cách hoạt động

### Flow lần đầu (chưa có session):

1. Click bubble → Mở modal tạo yêu cầu
2. Nhập nội dung → Click "Tạo yêu cầu tư vấn"
3. API tạo session → Chuyển sang chat mode
4. Chờ staff join

### Flow đã có session:

1. Click bubble → Mở chat window
2. Xem lịch sử tin nhắn
3. Chat với staff
4. Thu gọn/mở rộng tùy ý

### Unread messages:

- Khi bubble đóng, tin nhắn mới sẽ tăng badge count
- Badge đỏ hiển thị số tin nhắn chưa đọc (max 9+)
- Click mở bubble → Badge reset về 0

## 🎨 Customization

### Colors

```tsx
// Bubble gradient
className = "bg-gradient-to-br from-pink-500 to-purple-600";

// Header gradient
className = "bg-gradient-to-r from-pink-500 to-purple-600";

// Message bubble (own)
className = "bg-pink-500 text-white";

// Message bubble (other)
className = "bg-gray-100 dark:bg-gray-800";
```

### Size

```tsx
// Bubble size
className = "rounded-full p-4";

// Chat window
className = "w-[380px] h-[600px]";
```

### Animation

```css
/* Bounce animation */
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
```

## 🐛 Troubleshooting

### Bubble không hiện

- Check user đã login chưa (localStorage có `accessToken`?)
- Check `SocketProvider` đã wrap app chưa
- Check console có lỗi không

### Không tạo được session

- Check backend đang chạy
- Check API endpoint `/chat/rooms` hoạt động
- Check user có room chưa

### Không kết nối WebSocket

- Check `NEXT_PUBLIC_SOCKET_URL` trong `.env.local`
- Check connection status badge (màu đỏ = mất kết nối)
- Check console logs

### Không nhận tin nhắn realtime

- Check WebSocket đã connected (F12 → Network → WS)
- Check socket events trong console
- Thử refresh page

## 💡 Tips

### Ẩn bubble ở một số trang

```tsx
// app/(home)/some-page/page.tsx
export default function SomePage() {
  useEffect(() => {
    // Hide bubble
    document.querySelector("[data-chat-bubble]")?.classList.add("hidden");

    return () => {
      // Show bubble again
      document.querySelector("[data-chat-bubble]")?.classList.remove("hidden");
    };
  }, []);
}
```

### Custom position

```tsx
// Thay đổi position
className = "fixed bottom-6 right-6 z-50";

// VD: Góc trái dưới
className = "fixed bottom-6 left-6 z-50";
```

### Custom unread badge

```tsx
{
  unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  );
}
```

## 🔒 Security

- Tất cả API calls có JWT token
- WebSocket auth qua SocketContext
- Chỉ customer mới thấy ChatBubble (ở home layout)

## 📱 Mobile Responsive

ChatBubble hoạt động tốt trên mobile:

- Width auto-adjust (max 380px)
- Touch-friendly buttons
- Keyboard auto-show khi focus input

## 🎯 Best Practices

1. **Không remove bubble khỏi layout** - Nó cần ở đó cho mọi customer
2. **Không disable WebSocket** - Chat cần realtime
3. **Keep z-index cao (z-50)** - Bubble phải nổi trên mọi thứ
4. **Test với staff** - Đảm bảo staff có thể nhận và reply

## 📊 State Management

```tsx
// Session states
hasSession: boolean        // Đã có session?
currentSession: Session    // Session hiện tại
staffJoined: boolean       // Staff đã join?

// UI states
isOpen: boolean           // Bubble đang mở?
unreadCount: number       // Số tin nhắn chưa đọc

// Chat states
messages: Message[]       // Danh sách tin nhắn
sending: boolean          // Đang gửi?
isConnected: boolean      // WebSocket connected?
```

## 🚀 Performance

- Auto-refresh disabled khi bubble closed
- Lazy load messages on open
- Debounce typing events
- Clean up WebSocket on unmount

---

**Lưu ý**: ChatBubble chỉ hiển thị cho customer (trong home layout), không hiển thị cho staff/admin/groomer.
