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
    clearAuth();
  } finally {
    try {
      window.location.assign(redirectTo);
    } catch {
      window.location.href = redirectTo;
    }
  }
}
