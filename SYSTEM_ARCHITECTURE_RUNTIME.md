# System Architecture Runtime Documentation
## HappyPaws - Pet Care Service Platform

---

## 1. SYSTEM OVERVIEW

**Application Name:** HappyPaws  
**Type:** Full-stack Web Application  
**Framework:** Next.js 15.5.5 (React 19.2.0)  
**Architecture Pattern:** Client-Server with Real-time Communication  
**Deployment:** Server-side Rendering (SSR) with Client-side Hydration

### Core Business Domains
- **Pet Services:** Spa services, Hotel/Boarding, Grooming
- **E-commerce:** Product catalog, Shopping cart, Order management
- **Consultation:** Real-time chat consultation system
- **User Management:** Multi-role system (Customer, Staff, Admin, Groomer)
- **Payment:** Wallet system, Order payments

---

## 2. TECHNOLOGY STACK

### Frontend Stack
- **Framework:** Next.js 15.5.5 (App Router)
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS 4.x, CSS Modules
- **UI Components:** Radix UI, shadcn/ui, Ant Design 5.27.3
- **State Management:** 
  - Redux Toolkit 2.9.0 (Global state)
  - Zustand 5.0.8 (Local state stores)
  - React Query 5.87.1 (Server state)
- **Real-time:** Socket.IO Client 4.8.1
- **HTTP Client:** Axios 1.11.0
- **Form Handling:** React Hook Form
- **Date Management:** date-fns 4.1.0, react-day-picker
- **Animations:** Framer Motion 12.23.12, GSAP 3.13.0
- **Authentication:** JWT (jose 6.1.0)

### Backend Integration
- **API Base URL:** Configurable via `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8080/`)
- **Protocol:** HTTP/HTTPS REST API + WebSocket
- **Authentication:** Bearer Token (JWT)

---

## 3. RUNTIME ARCHITECTURE COMPONENTS

### 3.1 Client-Side Runtime Components

#### **Browser Environment**
- **Entry Point:** `app/layout.tsx` (Root Layout)
- **Providers Layer:**
  - `ReduxProvider` - Redux store with Redux Persist
  - `QueryClientProvider` - React Query for server state
  - `ThemeProvider` (next-themes) - Dark/Light mode
  - `Toaster` - Toast notifications (Sonner)

#### **Application State Management**
1. **Redux Store** (`stores/`)
   - Global application state
   - Persisted to localStorage via redux-persist
   - Middleware: Redux Saga for async operations

2. **Zustand Stores** (`stores/`)
   - `cart.store.ts` - Booking cart state (Spa, Hotel bookings)
   - `productCart.store.ts` - Product shopping cart
   - `productCartDrawer.store.ts` - Cart drawer UI state
   - `theme.store.ts` - Theme preferences

3. **React Query Cache**
   - Server data caching
   - Automatic refetching
   - Optimistic updates

#### **Routing & Navigation**
- **Next.js App Router** with route groups:
  - `(home)` - Public pages
  - `(auth)` - Authentication pages (`/login`, `/register`)
  - `(dashboard)` - Protected dashboard routes:
    - `/admin/*` - Admin dashboard
    - `/staff/*` - Staff dashboard
    - `/groomer/*` - Groomer dashboard
    - `/myorder` - Customer orders
    - `/wallet` - Wallet management
  - `profile/*` - User profile pages
  - `profile-pet/*` - Pet management pages

#### **Middleware Layer** (`middleware.ts`)
- **Authentication Guard:** Validates JWT token from cookies
- **Authorization:** Role-based access control (RBAC)
- **Route Protection:** Redirects based on user role
- **Public Routes:** `/login`, `/register`, `/about-us`

### 3.2 Server-Side Runtime Components

#### **Next.js Server Runtime**
- **API Routes:** Next.js API routes (if any)
- **Server Components:** React Server Components for SSR
- **Static Generation:** Pre-rendered pages where applicable
- **Image Optimization:** Next.js Image component with Cloudinary CDN

#### **External API Integration**
- **Base URL:** `process.env.NEXT_PUBLIC_API_BASE_URL`
- **HTTP Client:** Axios instance (`config/axios.ts`)
- **Request Interceptors:** Auto-inject JWT token from localStorage
- **Response Interceptors:** Error handling (if configured)

---

## 4. DATA FLOW & COMMUNICATION PATTERNS

### 4.1 REST API Communication

#### **Service Layer Architecture** (`services/`)
Each domain has its own service module:

1. **Authentication Service** (`services/auth/`)
   - `api.ts` - Login, Register, Token refresh
   - `hooks.ts` - React Query hooks
   - `types.ts` - TypeScript types

2. **Product Service** (`services/product/`)
   - CRUD operations for products
   - Product catalog management
   - Stock management
   - Public/Admin product endpoints

3. **Booking Service** (`services/booking/`)
   - Spa service bookings
   - Hotel room bookings
   - Booking management

4. **Order Service** (`services/orders/`)
   - Order creation
   - Order management (get, update, delete)
   - GHN (Giao Hàng Nhanh) delivery integration
   - Order status tracking

5. **Chat Service** (`services/chat/`)
   - REST API for chat rooms, sessions
   - WebSocket client integration
   - Message history
   - Two consultation methods: Sessions-based (recommended) and Rooms-based (direct)

6. **Profile Service** (`services/profile/`)
   - User profile management
   - Pet profile management
   - Schedule management

7. **Wallet Service** (`services/wallets/`)
   - Wallet balance
   - Deposit operations
   - Transaction history

8. **Groomer Service** (`services/groomer/`)
   - Groomer booking management
   - Groomer availability
   - Progress reports

9. **Hotel Service** (`services/hotel/`)
   - Room management
   - Room availability
   - Booking operations

10. **Spa Service** (`services/spa/`)
    - Service catalog
    - Combo management
    - Booking operations

11. **Delivery Service** (`services/delivery/`)
    - Province/city data (GHN integration)
    - Shipping calculations

12. **User Service** (`services/users/`)
    - User management
    - Staff management

### 4.2 Real-time Communication (WebSocket)

#### **Socket.IO Client** (`services/chat/socket.ts`)
- **Connection:** Connects to `/chat` namespace
- **Authentication:** JWT token in auth payload
- **Transport:** WebSocket with polling fallback

#### **WebSocket Events Flow**

**Client → Server Events:**
- `join_room` - Join chat room
- `leave_room` - Leave chat room
- `send_message` - Send chat message
- `join_session` - Staff/Admin join consultation session
- `leave_session` - Leave consultation session

**Server → Client Events:**
- `connected` - Connection confirmation
- `joined_room` - Room join confirmation
- `room_history` - Chat message history
- `new_message` - New message received
- `session_joined` - Staff joined session notification
- `session_left` - User left session notification
- `user_joined` - User joined room notification
- `user_left` - User left room notification
- `error` - Error events

#### **Chat Architecture**

**Core Concepts:**
- **Room:** Permanent chat room per customer (created automatically on registration, never deleted)
- **Session:** Temporary consultation session within a room (created when customer needs consultation)
- **Two Consultation Methods for Staff/Admin:**
  1. **Sessions-based (Recommended):** Staff claims sessions from unassigned list
  2. **Rooms-based (Direct):** Staff joins unassigned rooms directly, auto-assigns on first message

**Customer Flow:**
1. Customer gets their permanent room (1 room per customer)
2. Customer creates session with topic → `POST /chat/rooms/:id/sessions`
3. Session appears in unassigned sessions list
4. Customer connects WebSocket and joins room
5. Real-time message exchange
6. Staff joins → Customer receives `session_joined` event
7. Room remains open after session ends (ready for new sessions)

**Staff/Admin Flow - Method 1 (Sessions):**
1. Staff views unassigned sessions → `GET /chat/sessions/unassigned`
2. Staff claims session → `POST /chat/sessions/:id/join` (first-come-first-served)
3. Session status changes to `IN_PROGRESS`, removed from unassigned list
4. Staff connects WebSocket and joins room
5. Real-time message exchange
6. Staff ends session → `POST /chat/sessions/:id/end`
7. Session status changes to `ENDED`, room remains open
8. **Important:** `room.staffId` is NOT cleared when session ends

**Staff/Admin Flow - Method 2 (Rooms - Direct):**
1. Staff views unassigned rooms → `GET /chat/rooms/unassigned`
2. Staff connects WebSocket and joins room directly
3. Staff sends first message → System automatically assigns staff to room
4. Race condition protection: Only first staff to send message gets assigned
5. Real-time message exchange
6. Staff views assigned rooms → `GET /chat/rooms/assigned`
7. **Admin:** Sees all assigned rooms (all staff)
8. **Staff:** Sees only rooms assigned to them (`staffId = userId`)

**Key Behaviors:**
- Room is permanent and never deleted
- `room.staffId` persists after session ends (not cleared)
- Auto-assign mechanism when staff sends first message in unassigned room
- First-come-first-served assignment with race condition protection

---

## 5. STATE MANAGEMENT RUNTIME

### 5.1 Redux Store Runtime
- **Store Configuration:** Configured in `redux/store.ts` (if exists)
- **Persistence:** Redux Persist with localStorage
- **Hydration:** PersistGate component ensures state hydration
- **Sagas:** Redux Saga for complex async flows

### 5.2 Zustand Stores Runtime

#### **Cart Store** (`stores/cart.store.ts`)
**State:**
- `items: BookingDraft[]` - Booking items in cart
- `itemPrices: Map<string, {price, deposit}>` - Cached prices
- `isCartOpen: boolean` - Cart drawer state
- `isLoading: boolean` - Loading state
- `errors: ValidationError[]` - Validation errors
- `conflicts: SlotConflict[]` - Booking conflicts

**Actions:**
- `addItem()` - Add booking to cart (validates, calculates price)
- `updateItem()` - Update booking item
- `removeItem()` - Remove from cart
- `calculateSummary()` - Calculate total price/deposit
- `validateCart()` - Validate all items
- `checkConflicts()` - Check for time slot/room conflicts

**Persistence:** Cart items persisted to localStorage (prices recalculated on hydration)

#### **Product Cart Store**
- Shopping cart for products (separate from booking cart)
- Product quantity management
- Cart drawer state

### 5.3 React Query Runtime
- **Query Client:** Singleton instance in `_providers.tsx`
- **Cache Strategy:** Stale-while-revalidate
- **DevTools:** React Query DevTools (development)
- **Hooks Pattern:** Custom hooks in each service module

---

## 6. AUTHENTICATION & AUTHORIZATION RUNTIME

### 6.1 Authentication Flow

1. **Login Process:**
   - User submits credentials → `POST /auth/login`
   - Server returns JWT token
   - Token stored in:
     - `localStorage` (for API requests)
     - `cookies` (for middleware validation)
   - User role stored in cookies

2. **Token Management:**
   - Axios interceptor adds `Authorization: Bearer {token}` header
   - Token read from `localStorage` on each request
   - Middleware reads token from cookies for route protection

3. **Logout Process:**
   - Clear localStorage
   - Clear cookies
   - Redirect to login

### 6.2 Authorization Runtime (RBAC)

**Roles:**
- `ADMIN` - Full system access
- `STAFF` - Staff dashboard, chat, orders
- `GROOMER` - Groomer dashboard, bookings
- `CUSTOMER` - Public pages, profile, orders

**Route Guards** (`middleware.ts`):
```typescript
- /admin/* → Only ADMIN
- /staff/* → STAFF, ADMIN
- /groomer/dashboard → GROOMER, ADMIN
- /login, /register → Public (no auth required)
```

**Role-based Redirects:**
- Unauthorized access → Redirect to role-specific home
- No token → Redirect to `/login`

---

## 7. UI COMPONENT ARCHITECTURE

### 7.1 Component Structure

#### **Layout Components**
- `app/layout.tsx` - Root layout with providers
- `app/(home)/layout.tsx` - Home page layout
- `app/(dashboard)/*/layout.tsx` - Dashboard layouts per role
- `app/profile/layout.tsx` - Profile layout
- `components/navigation/Navbar.tsx` - Main navigation
- `components/navigation/Sidebar.tsx` - Sidebar navigation
- `components/dashboard/shell.tsx` - Dashboard shell

#### **Feature Components**
- `components/cart/*` - Shopping cart components
- `components/chat/*` - Chat interface components
- `components/booking/*` - Booking modals and forms
- `components/profile/*` - Profile management
- `components/orders/*` - Order management
- `components/products/*` - Product management
- `components/groomer/*` - Groomer-specific components

#### **UI Components** (`components/ui/`)
- Built with Radix UI primitives
- Styled with Tailwind CSS
- Includes: Button, Dialog, Dropdown, Select, Toast, etc.

### 7.2 Page Components

**Public Pages:**
- `app/(home)/page.tsx` - Homepage
- `app/(home)/about-us/page.tsx` - About page
- `app/(home)/(service)/*` - Service pages

**Auth Pages:**
- `app/(auth)/login/page.tsx` - Login
- `app/(auth)/register/page.tsx` - Register

**Dashboard Pages:**
- `app/(dashboard)/admin/*` - Admin pages
- `app/(dashboard)/staff/*` - Staff pages
- `app/(dashboard)/groomer/*` - Groomer pages
- `app/(dashboard)/myorder/page.tsx` - Customer orders
- `app/(dashboard)/wallet/page.tsx` - Wallet

**Profile Pages:**
- `app/profile/page.tsx` - User profile
- `app/profile/info/page.tsx` - Profile info
- `app/profile/orders/page.tsx` - User orders
- `app/profile/chat/page.tsx` - Chat interface
- `app/profile/calendar/page.tsx` - Calendar view

---

## 8. EXTERNAL SERVICES & INTEGRATIONS

### 8.1 Backend API
- **Base URL:** `NEXT_PUBLIC_API_BASE_URL` environment variable
- **Protocol:** HTTP/HTTPS
- **Authentication:** JWT Bearer token
- **Endpoints:** RESTful API structure

### 8.2 CDN & Media
- **Cloudinary:** Image hosting (`res.cloudinary.com`)
- **Next.js Image Optimization:** Automatic image optimization
- **Remote Image Sources:** 
  - Cloudinary
  - Unsplash
  - Flaticon
  - Custom domains

### 8.3 Third-party Services
- **GHN (Giao Hàng Nhanh):** Delivery service integration
  - Shipping calculations
  - Order tracking
  - Delivery status updates

### 8.4 WebSocket Server
- **Namespace:** `/chat`
- **Protocol:** Socket.IO over WebSocket
- **Authentication:** JWT token in connection auth
- **Transport:** WebSocket primary, polling fallback

### 8.5 Chat API Endpoints

#### **Customer Endpoints:**
- `GET /chat/rooms` - Get customer's rooms (typically 1 permanent room)
- `GET /chat/rooms/:id` - Get room details
- `GET /chat/rooms/:id/messages` - Get message history
- `POST /chat/rooms/:id/sessions` - Create consultation session

#### **Staff/Admin Endpoints - Sessions (Recommended):**
- `GET /chat/sessions/unassigned` - Get unassigned sessions list
- `POST /chat/sessions/:id/join` - Claim session (first-come-first-served)
- `POST /chat/sessions/:id/end` - End consultation session

#### **Staff/Admin Endpoints - Rooms (Direct):**
- `GET /chat/rooms/unassigned` - Get unassigned rooms list
- `GET /chat/rooms/assigned` - Get assigned rooms list
  - **Admin:** Sees all assigned rooms (all staff)
  - **Staff:** Sees only rooms assigned to them (`staffId = userId`)

---

## 9. RUNTIME DATA FLOW DIAGRAMS

### 9.1 User Authentication Flow
```
User → Login Form → POST /auth/login
  ↓
Backend API → JWT Token
  ↓
Store in localStorage + cookies
  ↓
Middleware validates token
  ↓
Redirect to role-specific dashboard
```

### 9.2 Booking Flow
```
User selects service → Add to cart (Zustand)
  ↓
Validate booking → Check conflicts
  ↓
Calculate price → Cache in store
  ↓
User proceeds to checkout
  ↓
POST /bookings → Create booking
  ↓
Update cart state → Clear cart
  ↓
Redirect to success page
```

### 9.3 Real-time Chat Flow

#### **Customer Flow:**
```
Customer gets permanent room → GET /chat/rooms
  ↓
Customer creates session → POST /chat/rooms/:id/sessions
  ↓
Session appears in unassigned list (status: OPEN)
  ↓
Customer connects WebSocket → Join room
  ↓
Receive room_history → Display old messages
  ↓
Send/receive messages via WebSocket
  ↓
Listen for session_joined → Staff has joined
  ↓
Continue chatting with staff
```

#### **Staff/Admin Flow - Method 1 (Sessions - Recommended):**
```
Staff views unassigned sessions → GET /chat/sessions/unassigned
  ↓
Staff claims session → POST /chat/sessions/:id/join
  ↓
Session status: OPEN → IN_PROGRESS
Session removed from unassigned list
  ↓
Staff connects WebSocket → Join room
  ↓
Receive room_history → Display old messages
  ↓
Send/receive messages via WebSocket
  ↓
Staff ends session → POST /chat/sessions/:id/end
  ↓
Session status: IN_PROGRESS → ENDED
room.staffId remains (NOT cleared)
  ↓
Leave room via WebSocket
  ↓
Return to unassigned sessions list
```

#### **Staff/Admin Flow - Method 2 (Rooms - Direct):**
```
Staff views unassigned rooms → GET /chat/rooms/unassigned
  ↓
Staff connects WebSocket → Join room directly
  ↓
Receive room_history → Display old messages
  ↓
Staff sends first message → Auto-assign to room
Race condition protection: Only first staff gets assigned
  ↓
Send/receive messages via WebSocket
  ↓
View assigned rooms → GET /chat/rooms/assigned
  ↓
Leave room via WebSocket when done
```

### 9.4 Product Order Flow
```
Browse products → Add to product cart
  ↓
Checkout → Select delivery address
  ↓
Calculate shipping (GHN API)
  ↓
Create order → POST /orders
  ↓
Create GHN shipment → POST /orders/ghn
  ↓
Track order status
  ↓
Update delivery status → PUT /orders/ghn/delivered
```

---

## 10. RUNTIME ENVIRONMENT CONFIGURATION

### 10.1 Environment Variables
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- Other environment-specific configurations

### 10.2 Build & Runtime
- **Development:** `next dev --turbopack`
- **Production Build:** `next build --turbopack`
- **Production Server:** `next start`
- **HTTPS Dev:** `next dev --turbopack --experimental-https`

### 10.3 Browser Storage
- **localStorage:**
  - JWT access token
  - Redux persisted state
  - Zustand persisted stores (cart, theme)
- **Cookies:**
  - JWT token (for middleware)
  - User role
  - Session data

---

## 11. SECURITY RUNTIME CONSIDERATIONS

### 11.1 Client-Side Security
- JWT tokens stored in localStorage (XSS risk mitigated by React)
- Cookies used for middleware validation
- HTTPS enforced in production
- CORS handled by backend

### 11.2 Route Protection
- Middleware validates every request
- Role-based access control
- Public routes whitelist
- Automatic redirects for unauthorized access

### 11.3 API Security
- Bearer token authentication
- Token auto-injection via Axios interceptor
- Token validation on backend

---

## 12. PERFORMANCE OPTIMIZATIONS

### 12.1 Next.js Optimizations
- Server-side rendering (SSR)
- Static generation where possible
- Image optimization via Next.js Image
- Code splitting via App Router
- Turbopack for faster builds

### 12.2 State Management Optimizations
- React Query caching reduces API calls
- Zustand selective subscriptions
- Redux Persist for offline capability
- Price caching in cart store

### 12.3 Bundle Optimization
- Tree shaking
- Dynamic imports for heavy components
- Font optimization (Poppins with subset)

---

## 13. ERROR HANDLING RUNTIME

### 13.1 Error Boundaries
- `app/error.tsx` - Global error boundary
- `app/global-error.tsx` - Root error boundary
- `app/loading.tsx` - Loading states

### 13.2 API Error Handling
- Axios interceptors for error handling
- React Query error states
- Toast notifications for user feedback

### 13.3 WebSocket Error Handling
- `error` event listener
- Reconnection logic (if implemented)
- User notifications for connection issues

---

## 14. DEPLOYMENT ARCHITECTURE

### 14.1 Build Output
- Next.js standalone build
- Static assets optimization
- Server-side rendering capability

### 14.2 Runtime Requirements
- Node.js runtime for SSR
- Environment variables configuration
- Backend API connectivity
- WebSocket server connectivity

---

## 15. SYSTEM RUNTIME DIAGRAM SUMMARY

### Key Runtime Components:
1. **Browser Client** - React application with Next.js
2. **Next.js Server** - SSR and API routes
3. **State Management Layer** - Redux, Zustand, React Query
4. **API Client** - Axios with interceptors
5. **WebSocket Client** - Socket.IO client
6. **Backend API Server** - REST API endpoints
7. **WebSocket Server** - Real-time communication
8. **External Services** - GHN, Cloudinary CDN

### Data Flow Patterns:
- **Synchronous:** REST API calls via Axios
- **Asynchronous:** WebSocket real-time events
- **State Updates:** React Query mutations, Zustand actions
- **Persistence:** localStorage, cookies, Redux Persist

### Communication Protocols:
- **HTTP/HTTPS** - REST API
- **WebSocket** - Real-time chat
- **JWT** - Authentication

---

## END OF DOCUMENTATION

This document provides a comprehensive overview of the HappyPaws system architecture at runtime. Use this documentation to generate system runtime architecture diagrams, including component interactions, data flows, and communication patterns.

