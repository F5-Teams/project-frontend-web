"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const readToken = () => localStorage.getItem("accessToken");

    setAuthToken(readToken());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "accessToken") {
        setAuthToken(event.newValue);
      }
    };

    const handleAuthChanged = () => {
      setAuthToken(readToken());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-changed", handleAuthChanged as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "auth-changed",
        handleAuthChanged as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const resolveSocketBaseUrl = () => {
      const explicitUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

      if (explicitUrl) {
        return explicitUrl;
      }

      if (typeof window !== "undefined") {
        return window.location.origin.replace(/\/$/, "");
      }

      return "https://project-backend-api-production.up.railway.app/";
    };

    if (!authToken) {
      setSocket((prevSocket) => {
        if (prevSocket) {
          console.log("🔌 Disconnecting socket because user is logged out");
          prevSocket.disconnect();
        }
        return null;
      });
      setIsConnected(false);
      return;
    }

    const socketBaseUrl = resolveSocketBaseUrl();
    const namespaceUrl = `${socketBaseUrl}/chat`;

    // Debug: log where we are connecting and ensure the access token is available
    console.log(`🔌 Attempting WebSocket connection to: ${namespaceUrl}`);
    console.log(
      `🔐 Has token: ${!!authToken} | token (truncated): ${authToken?.slice(
        0,
        12
      )}...`
    );

    const socketInstance = io(namespaceUrl, {
      auth: { token: authToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("✅ WebSocket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("reconnect_attempt", (attempt) => {
      console.log(`🔁 WebSocket reconnect attempt #${attempt}`);
    });

    socketInstance.on("reconnect", (attempt) => {
      console.log(`🔁 WebSocket reconnected on attempt #${attempt}`);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("🔴 WebSocket reconnection failed");
    });

    socketInstance.on("connected", (data) => {
      console.log("📡 Connected to chat server:", data);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ WebSocket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("🔴 Socket error:", error);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error.message);
      console.debug("🔴 Raw connection error:", error);
    });

    setSocket(socketInstance);

    return () => {
      console.log("🔌 Disconnecting socket...");
      socketInstance.disconnect();
      setIsConnected(false);
      setSocket(null);
    };
  }, [authToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
