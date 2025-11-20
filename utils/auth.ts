export function clearAuth() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("onesignal-notification-prompt");

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
