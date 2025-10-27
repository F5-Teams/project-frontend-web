# Pet Booking System

A comprehensive booking system for pet services including spa treatments, hotel rooms, and custom combos. Built with Next.js, TypeScript, Zustand, and Tailwind CSS.

## Features

### 🐾 Core Functionality

- **Multi-pet booking**: Select multiple pets for services
- **Service types**: Single services, combo packages, custom combos, and hotel rooms
- **Real-time validation**: Conflict detection and validation
- **Cart management**: Persistent cart with localStorage
- **Checkout flow**: Complete booking process with payment simulation

### 🎯 Service Types

1. **Single Services**: Individual spa/grooming services
2. **Combo Packages**: Pre-defined service combinations with discounts
3. **Custom Combos**: User-selected service combinations
4. **Hotel Rooms**: Pet accommodation with date selection

### 🔧 Technical Features

- **TypeScript**: Full type safety
- **Zustand**: State management with persistence
- **Mock API**: Simulated backend with configurable delays
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA-compliant components

## File Structure

```
├── types/
│   └── cart.ts                 # TypeScript interfaces and types
├── mock/
│   ├── data.ts                 # Mock data for services, pets, rooms
│   └── api.ts                  # Mock API functions
├── stores/
│   └── cart.store.ts           # Zustand cart store
├── components/
│   ├── modals/                 # Booking modals
│   │   ├── SelectPetsModal.tsx
│   │   ├── SingleServiceBookingModal.tsx
│   │   ├── ComboBookingModal.tsx
│   │   ├── CustomComboBookingModal.tsx
│   │   └── RoomBookingModal.tsx
│   ├── cart/                   # Cart components
│   │   ├── CartDrawer.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutModal.tsx
│   │   └── SuccessScreen.tsx
│   └── examples/
│       └── BookingExample.tsx  # Complete demo component
```

## Quick Start

### 1. Install Dependencies

```bash
npm install zustand date-fns lucide-react
```

### 2. Import Components

```tsx
import { CartDrawer, CheckoutModal } from "@/components/cart";
import {
  SelectPetsModal,
  SingleServiceBookingModal,
} from "@/components/modals";
import { useCartStore } from "@/stores/cart.store";
```

### 3. Basic Usage

```tsx
function MyComponent() {
  const { addItem, items } = useCartStore();

  const handleBookService = async () => {
    const result = await addItem({
      type: "single",
      petIds: ["pet-1"],
      price: 50,
      status: "draft",
      payload: {
        serviceId: "service-1",
        groomerId: "groomer-1",
        appointmentTime: new Date().toISOString(),
      },
    });

    if (result.success) {
      console.log("Item added to cart!");
    }
  };

  return (
    <div>
      <CartDrawer>
        <Button>View Cart ({items.length})</Button>
      </CartDrawer>
      <Button onClick={handleBookService}>Book Service</Button>
    </div>
  );
}
```

## Component Usage

### SelectPetsModal

```tsx
<SelectPetsModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={(petIds) => console.log("Selected pets:", petIds)}
  serviceId="service-1"
  maxPets={2}
  title="Select Pets"
  description="Choose which pets will receive this service"
/>
```

### SingleServiceBookingModal

```tsx
<SingleServiceBookingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={(item) => addItem(item)}
  serviceId="service-1"
  selectedPetIds={["pet-1", "pet-2"]}
/>
```

### CartDrawer

```tsx
<CartDrawer>
  <Button>
    <ShoppingCart className="mr-2 h-4 w-4" />
    View Cart
  </Button>
</CartDrawer>
```

### CheckoutModal

```tsx
<CheckoutModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={(bookingId) => console.log("Booking ID:", bookingId)}
/>
```

## Cart Store API

### State

```tsx
const {
  items, // Cart items array
  isCartOpen, // Cart drawer state
  isLoading, // Loading state
  errors, // Validation errors
  conflicts, // Scheduling conflicts
} = useCartStore();
```

### Actions

```tsx
const {
  addItem, // Add item to cart
  updateItem, // Update existing item
  removeItem, // Remove item from cart
  clearCart, // Clear entire cart
  toggleCart, // Toggle cart drawer
  validateCart, // Validate all items
  checkConflicts, // Check for conflicts
  calculateSummary, // Calculate totals
} = useCartStore();
```

### Selectors

```tsx
const items = useCartItems();
const summary = useCartSummary();
const errors = useCartErrors();
const conflicts = useCartConflicts();
const isOpen = useIsCartOpen();
const isLoading = useIsCartLoading();
```

## Mock API Usage

### Booking Services

```tsx
import { mockApi } from "@/mock/api";

// Book single service
const response = await mockApi.bookSingleService(
  "service-1",
  "groomer-1",
  ["pet-1"],
  "2024-01-15T10:00:00Z",
  "Special notes"
);

// Book combo
const response = await mockApi.bookCombo(
  "combo-1",
  ["pet-1", "pet-2"],
  "2024-01-15T10:00:00Z"
);

// Book room
const response = await mockApi.bookRoom(
  "room-1",
  ["pet-1"],
  "2024-01-15",
  "2024-01-17",
  2
);

// Checkout cart
const response = await mockApi.checkoutCart({
  cartItems: items,
  paymentMethod: paymentMethod,
  totalPrice: 200,
  totalDeposit: 100,
});
```

### Mock Configuration

```tsx
// Simulate network delay
const response = await mockApi.bookSingleService(
  "service-1",
  "groomer-1",
  ["pet-1"],
  "2024-01-15T10:00:00Z",
  undefined,
  { delay: 1000 } // 1 second delay
);

// Simulate error
const response = await mockApi.bookSingleService(
  "service-1",
  "groomer-1",
  ["pet-1"],
  "2024-01-15T10:00:00Z",
  undefined,
  { shouldFail: true, errorMessage: "Service unavailable" }
);
```

## Data Types

### CartItem Types

```tsx
type CartItemType = "single" | "combo" | "custom" | "room";

interface SingleServiceCartItem {
  type: "single";
  payload: {
    serviceId: string;
    groomerId: string;
    appointmentTime: string;
    notes?: string;
  };
}

interface ComboCartItem {
  type: "combo";
  payload: {
    comboId: string;
    appointmentTime?: string;
    notes?: string;
  };
}

interface CustomComboCartItem {
  type: "custom";
  payload: {
    selectedServiceIds: string[];
    groomerId?: string;
    appointmentTime?: string;
    notes?: string;
  };
}

interface RoomCartItem {
  type: "room";
  payload: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    notes?: string;
  };
}
```

### Service Types

```tsx
interface Service {
  id: string;
  name: string;
  category: "spa" | "grooming" | "medical" | "training";
  duration: number; // minutes
  price: number;
  description: string;
  groomerIds: string[];
  maxPets?: number;
  allowCustomCombo: boolean;
}

interface Combo {
  id: string;
  name: string;
  serviceIds: string[];
  price: number;
  benefits: string[];
  category: "spa" | "hotel" | "mixed";
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  photos: string[];
}
```

## Validation & Error Handling

### Cart Validation

```tsx
const errors = validateCart();
// Returns array of ValidationError objects

const conflicts = checkConflicts();
// Returns array of SlotConflict objects
```

### Error Types

```tsx
interface ValidationError {
  field: string;
  message: string;
}

interface SlotConflict {
  type: "groomer" | "time" | "room";
  message: string;
  conflictingItems: string[];
}
```

## Styling & Customization

### CSS Classes

The components use Tailwind CSS classes. Key patterns:

- `bg-blue-50` - Light blue backgrounds
- `text-green-600` - Green text for prices
- `ring-2 ring-blue-500` - Selected state borders
- `hover:shadow-md` - Hover effects

### Component Props

Most components accept standard props:

- `className` - Additional CSS classes
- `variant` - Button/card variants
- `size` - Component sizes

## Testing

### Manual Testing

1. Open the BookingExample component
2. Try booking different service types
3. Test cart functionality
4. Complete checkout flow
5. Verify localStorage persistence

### Mock Testing

```tsx
// Test error scenarios
const errorResponse = await mockApi.bookSingleService(
  "invalid-service",
  "invalid-groomer",
  [],
  "invalid-date",
  undefined,
  { shouldFail: true }
);

// Test success scenarios
const successResponse = await mockApi.bookSingleService(
  "service-1",
  "groomer-1",
  ["pet-1"],
  "2024-01-15T10:00:00Z"
);
```

## Performance Considerations

### Optimization Tips

1. **Lazy Loading**: Load modals only when needed
2. **Memoization**: Use React.memo for expensive components
3. **Debouncing**: Debounce search inputs
4. **Pagination**: Implement pagination for large lists

### Bundle Size

- Zustand: ~2KB
- Date-fns: ~13KB (tree-shakeable)
- Lucide React: ~1KB per icon

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow TypeScript best practices
2. Use consistent naming conventions
3. Add proper error handling
4. Include JSDoc comments
5. Test all functionality

## License

MIT License - see LICENSE file for details.
