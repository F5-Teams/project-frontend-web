export function clearAuth() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("role");

    const isHttps = window.location.protocol === "https:";
    const secure = isHttps ? "; Secure" : "";
    document.cookie = `accessToken=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    document.cookie = `role=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
  } catch {
    /* silent */
  }
}

// Default redirect to home so homepage is always viewable logged-out
export function logout(redirectTo: string = "/") {
  if (typeof window === "undefined") return;
  try {
    // Cancel all ongoing queries and clear cache
    if (
      typeof window !== "undefined" &&
      (window as any).__REACT_QUERY_CLIENT__
    ) {
      const queryClient = (window as any).__REACT_QUERY_CLIENT__;
      queryClient.cancelQueries();
      queryClient.clear();
    }

    // Clear application-specific persisted stores (cart data)
    try {
      // Remove raw localStorage keys used by zustand persist to be safe
      window.localStorage.removeItem("cart-storage");
      window.localStorage.removeItem("product-cart-storage");

      // Dynamically import stores and call their clear methods (client-only)
      // Use dynamic import to avoid SSR/module-init issues
      import("../stores/cart.store")
        .then((mod) => {
          // `useCartStore` is a zustand hook; call getState().clearCart()
          try {
            mod.useCartStore?.getState?.().clearCart?.();
          } catch {
            // ignore
          }
        })
        .catch(() => {
          /* ignore */
        });

      import("../stores/productCart.store")
        .then((mod) => {
          try {
            mod.useProductCartStore?.getState?.().clearCart?.();
          } catch {
            // ignore
          }
        })
        .catch(() => {
          /* ignore */
        });
    } catch (e) {
      /* silent */
    }

    clearAuth();
  } finally {
    // Small delay to ensure cleanup completes
    setTimeout(() => {
      try {
        window.location.assign(redirectTo);
      } catch {
        window.location.href = redirectTo;
      }
    }, 100);
  }
}
