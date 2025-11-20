"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Bot,
  Send,
  X,
  MessageSquare,
  Loader2,
  CheckCheck,
  Clock,
  Minus,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getPetsByUser } from "@/services/profile/profile-pet/api";
import type { Pet } from "@/services/profile/profile-pet/types";
import { useSocket } from "@/contexts/SocketContext";
import { chatApi, Message, Session } from "@/services/chat/api";
import { toast } from "sonner";

type ChatMessage = { sender: "user" | "bot"; text: string };

type UserInfo = {
  name?: string;
  phone?: string;
  petName?: string;
  petType?: string;
  breed?: string;
  age?: string | number;
  notes?: string;
};

type ChatMode = "ai" | "staff";

export function HappyPawsChat({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("ai");

  // AI Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Staff Chat States
  const { socket, isConnected } = useSocket();
  const [roomId, setRoomId] = useState<number | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [staffMessages, setStaffMessages] = useState<Message[]>([]);
  const [staffInput, setStaffInput] = useState("");
  const [staffSending, setStaffSending] = useState(false);
  const [staffJoined, setStaffJoined] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [consultationTitle, setConsultationTitle] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const staffMessagesEndRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesRef = useRef<HTMLSpanElement[]>([]);
  const setWaveRef = useCallback((el: HTMLSpanElement | null, idx: number) => {
    if (!el) return;
    wavesRef.current[idx] = el;
  }, []);
  const [showInfo, setShowInfo] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>();

  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !sending,
    [input, sending]
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Get current user ID for staff chat and check login status
  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");

      if (accessToken && userStr) {
        setIsLoggedIn(true);
        try {
          const user = JSON.parse(userStr);
          setCurrentUserId(user.id);
        } catch (error) {
          console.error("Failed to parse user:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        // Nếu đang ở tab staff mà không có đăng nhập, chuyển về AI
        if (chatMode === "staff") {
          setChatMode("ai");
        }
      }
    };

    // Check on mount and when chatMode changes
    checkAuthStatus();

    // Listen for storage changes (login/logout events)
    window.addEventListener("storage", checkAuthStatus);
    
    // Listen for custom auth events
    window.addEventListener("auth-changed", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("auth-changed", checkAuthStatus);
    };
  }, [chatMode]);

  // Initialize welcome message based on login status
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = isLoggedIn
        ? "Xin chào! Mình là trợ lý HappyPaws. Bạn muốn đặt lịch grooming/spa, hỏi giá khách sạn thú cưng, hay tư vấn sản phẩm?\n\n💡 Nếu cần hỗ trợ trực tiếp, bạn có thể chuyển sang tab Staff Support để chat với nhân viên tư vấn."
        : "Xin chào! Mình là trợ lý HappyPaws. Bạn muốn đặt lịch grooming/spa, hỏi giá khách sạn thú cưng, hay tư vấn sản phẩm?\n\n💡 Đăng nhập để sử dụng thêm tính năng chat với nhân viên tư vấn!";

      setMessages([{ sender: "bot", text: welcomeMessage }]);
    }
  }, [isLoggedIn, messages.length]);

  // Check existing staff chat session
  useEffect(() => {
    const checkExistingSession = async () => {
      if (
        typeof window === "undefined" ||
        !localStorage.getItem("accessToken")
      ) {
        return;
      }

      try {
        const rooms = await chatApi.getRooms();
        if (rooms && rooms.length > 0) {
          const room = rooms[0];
          setRoomId(room.id);

          const currentSession = await chatApi.getCurrentSession();
          if (currentSession) {
            setHasSession(true);
            setCurrentSession(currentSession);
            setStaffJoined(
              currentSession.status === "ACTIVE" && !!currentSession.staff
            );
          }
        }
      } catch (error) {
        console.error("Failed to check existing session:", error);
      }
    };

    checkExistingSession();
  }, []);

  // Setup WebSocket for staff chat
  useEffect(() => {
    if (
      !socket ||
      !isConnected ||
      !roomId ||
      !hasSession ||
      chatMode !== "staff"
    )
      return;

    socket.emit("join_room", { roomId });

    socket.on("joined_room", () => {
      console.log("✅ Joined staff chat room");
    });

    socket.on("room_history", (data) => {
      setStaffMessages(data.messages || []);
    });

    socket.on("new_message", (message: Message) => {
      setStaffMessages((prev) => [...prev, message]);
      if (message.sender.id !== currentUserId) {
        toast.info(`Tin nhắn mới từ ${message.sender.firstName}`);
      }
    });

    socket.on("session_joined", (data) => {
      setStaffJoined(true);
      setCurrentSession((prev) =>
        prev ? { ...prev, staff: data.staff, status: "ACTIVE" } : null
      );
      toast.success(`Staff ${data.staff.firstName} đã vào tư vấn!`);
    });

    socket.on("session_ended", () => {
      setCurrentSession((prev) =>
        prev ? { ...prev, status: "CLOSED" } : null
      );
      toast.info("Phiên tư vấn đã kết thúc");
    });

    return () => {
      socket.off("joined_room");
      socket.off("room_history");
      socket.off("new_message");
      socket.off("session_joined");
      socket.off("session_ended");
    };
  }, [socket, isConnected, roomId, hasSession, chatMode, currentUserId]);

  // Auto scroll for staff chat
  useEffect(() => {
    staffMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [staffMessages]);

  // Re-initialize launcher animations whenever the launcher re-appears (open === false)
  useEffect(() => {
    if (open) {
      // When chat is open, launcher is hidden; nothing to animate
      return;
    }
    const btn = btnRef.current;
    const glow = glowRef.current;
    const container = containerRef.current;
    if (!btn || !glow) return;

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: "power1.inOut" },
    });
    tl.to(btn, { scale: 1.06, duration: 1.2 })
      .to(btn, { rotate: 1.5, duration: 0.4 }, "<")
      .to(btn, { rotate: 0, duration: 0.4 })
      .to(btn, { scale: 1.0, duration: 1.0 });

    const glowTl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: "power1.inOut" },
    });
    glowTl
      .to(glow, { opacity: 0.9, scale: 1.15, duration: 1.2 })
      .to(glow, { opacity: 0.4, scale: 1.0, duration: 1.0 });

    // Gentle floating/levitation effect for the whole launcher container
    let floatTl: gsap.core.Tween | undefined;
    let glowFloatTl: gsap.core.Tween | undefined;
    if (container) {
      floatTl = gsap.to(container, {
        y: -8,
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      // slight glow drift to enhance the levitation feel
      glowFloatTl = gsap.to(glow, {
        y: -2,
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    const waves = wavesRef.current.filter(Boolean);
    let waveTl: gsap.core.Timeline | undefined;
    if (waves.length) {
      gsap.set(waves, { opacity: 0, scale: 1 });
      waveTl = gsap.timeline({ repeat: -1 });
      waveTl
        .to(waves, {
          opacity: 0.85,
          scale: 1.6,
          duration: 1.0,
          ease: "power2.out",
          stagger: 0.35,
        })
        .to(
          waves,
          {
            opacity: 0,
            scale: 2.3,
            duration: 1.2,
            ease: "power2.in",
            stagger: 0.35,
          },
          "<"
        );
    }

    const hoverIn = () => gsap.to(btn, { scale: 1.1, duration: 0.2 });
    const hoverOut = () => gsap.to(btn, { scale: 1.0, duration: 0.2 });
    btn.addEventListener("mouseenter", hoverIn);
    btn.addEventListener("mouseleave", hoverOut);
    return () => {
      btn.removeEventListener("mouseenter", hoverIn);
      btn.removeEventListener("mouseleave", hoverOut);
      tl.kill();
      glowTl.kill();
      floatTl?.kill();
      glowFloatTl?.kill();
      waveTl?.kill();
    };
  }, [open]);

  const sendMessage = useCallback(async () => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");

    const nextHistory = [...messages, { sender: "user" as const, text }];
    setMessages(nextHistory);
    setSending(true);
    try {
      const resp = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: nextHistory, userInfo }),
      });
      if (!resp.ok) {
        const detail = await resp.text();
        throw new Error(`AI service error (${resp.status}): ${detail}`);
      }
      const data = (await resp.json()) as { result?: string; message?: string };
      const reply = data.result ?? data.message ?? "(Không có phản hồi từ AI)";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Xin lỗi, hiện không thể phản hồi. Chi tiết: ${msg}`,
        },
      ]);
    } finally {
      setSending(false);
    }
  }, [canSend, input, messages, userInfo]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void sendMessage();
      }
    },
    [sendMessage]
  );

  // Render bot message and convert [[btn Label|/path]] to buttons or [[staff]] to staff chat trigger
  const renderBotContent = useCallback(
    (text: string) => {
      const parts: React.ReactNode[] = [];
      // Match both [[btn Label|/path]] and [[staff]]
      const regex = /\[\[btn\s+([^|\]]+)\|([^\]]+)\]\]|\[\[staff\]\]/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      let key = 0;

      while ((match = regex.exec(text))) {
        const before = text.slice(lastIndex, match.index);
        if (before.trim().length) {
          parts.push(
            <p key={`p-${key++}`} className="whitespace-pre-wrap">
              {before}
            </p>
          );
        }

        if (match[0] === "[[staff]]") {
          // Render "Chat với Staff" button
          parts.push(
            <Button
              key={`staff-${key++}`}
              variant="default"
              size="sm"
              className="self-start bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              onClick={() => {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                  toast.error(
                    "Vui lòng đăng nhập để chat với nhân viên tư vấn"
                  );
                  router.push("/login");
                  return;
                }
                setChatMode("staff");
                toast.info("Chuyển sang chat với nhân viên tư vấn");
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Nhắn tin với Staff
            </Button>
          );
        } else {
          // Regular button with link
          const label = match[1].trim();
          const href = match[2].trim();
          parts.push(
            <Button
              key={`btn-${key++}`}
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => {
                router.push(href);
                setOpen(false);
              }}
            >
              {label}
            </Button>
          );
        }
        lastIndex = regex.lastIndex;
      }

      const rest = text.slice(lastIndex);
      if (rest.trim().length) {
        parts.push(
          <p key={`p-${key++}`} className="whitespace-pre-wrap">
            {rest}
          </p>
        );
      }
      return <div className="flex flex-col gap-2">{parts}</div>;
    },
    [router]
  );

  // Load user's pets from localStorage cache first, fallback to API
  useEffect(() => {
    if (!open) return;
    // Only load when info section is visible to avoid unnecessary work
    if (!showInfo) return;
    try {
      const userStr =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const user = userStr ? (JSON.parse(userStr) as { id?: number }) : null;
      const userId = user?.id;
      if (!userId) return; // not logged in -> skip

      const cacheKeys = ["userPetsCache_v1", "userPets"]; // try both for compatibility
      let cache: { userId: number; pets: Pet[]; ts?: number } | null = null;
      for (const k of cacheKeys) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.userId && Array.isArray(parsed.pets)) {
            cache = parsed;
            break;
          }
          // legacy may store just array
          if (Array.isArray(parsed)) {
            cache = { userId, pets: parsed as Pet[] };
            break;
          }
        } catch {}
      }

      const FRESH_MS = 10 * 60 * 1000; // 10 minutes
      const isFresh = cache?.ts ? Date.now() - cache.ts < FRESH_MS : false;
      if (
        cache &&
        cache.userId === userId &&
        (isFresh || cache.ts === undefined)
      ) {
        setPets(cache.pets);
        return;
      }

      // Fallback to API
      setLoadingPets(true);
      getPetsByUser(userId)
        .then((data) => {
          setPets(data ?? []);
          try {
            localStorage.setItem(
              "userPetsCache_v1",
              JSON.stringify({ userId, pets: data ?? [], ts: Date.now() })
            );
          } catch {}
        })
        .catch(() => {
          // ignore errors; UI will keep manual fields
        })
        .finally(() => setLoadingPets(false));
    } catch {
      // ignore
    }
  }, [open, showInfo]);

  // When selecting a pet, fill userInfo fields
  const handleSelectPet = useCallback(
    (petId: string) => {
      setSelectedPetId(petId);
      const pet = pets.find((p) => String(p.id) === String(petId));
      if (!pet) return;
      setUserInfo((u) => ({
        ...u,
        petName: pet.name,
        petType: pet.species,
        breed: pet.breed,
        age: pet.age,
      }));
    },
    [pets]
  );

  // Staff Chat Functions
  const handleCreateStaffSession = async () => {
    if (!consultationTitle.trim()) {
      toast.error("Vui lòng nhập nội dung yêu cầu tư vấn");
      return;
    }

    if (typeof window === "undefined" || !localStorage.getItem("accessToken")) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    if (!roomId) {
      try {
        const rooms = await chatApi.getRooms();
        if (rooms && rooms.length > 0) {
          setRoomId(rooms[0].id);
        } else {
          toast.error("Không tìm thấy phòng chat của bạn");
          return;
        }
      } catch {
        toast.error("Không thể kết nối với hệ thống chat");
        return;
      }
    }

    setCreatingSession(true);
    try {
      const session = await chatApi.createSession(
        roomId!,
        consultationTitle.trim()
      );
      setHasSession(true);
      setCurrentSession(session);
      setConsultationTitle("");
      toast.success("Đã tạo yêu cầu tư vấn! Đang chờ staff...");
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Không thể tạo yêu cầu tư vấn");
    } finally {
      setCreatingSession(false);
    }
  };

  const handleSendStaffMessage = async () => {
    if (!socket || !staffInput.trim() || staffSending || !roomId) return;

    const messageContent = staffInput.trim();
    setStaffInput("");
    setStaffSending(true);

    try {
      socket.emit("send_message", {
        roomId,
        content: messageContent,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Không thể gửi tin nhắn");
      setStaffInput(messageContent);
    } finally {
      setStaffSending(false);
    }
  };

  const handleResetToNewSession = () => {
    setHasSession(false);
    setCurrentSession(null);
    setStaffMessages([]);
    setConsultationTitle("");
    setStaffJoined(false);
    toast.info("Hãy tạo yêu cầu tư vấn mới");
  };

  const handleBackToAI = () => {
    setChatMode("ai");
    toast.info("Quay lại chat với AI");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shouldHide =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp" ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/staff") ||
    pathname?.startsWith("/groomer");

  // Chỉ hiển thị chat button khi đã đăng nhập
  if (shouldHide || !isLoggedIn) {
    return null;
  }
  return (
    <div className={cn("fixed bottom-25 right-20 z-20", className)}>
      {!open && (
        <div className="relative" ref={containerRef}>
          <span
            ref={glowRef}
            className="absolute inset-0 -z-10 rounded-full bg-indigo-300/50 blur-xl opacity-60"
          />

          <span
            ref={(el) => setWaveRef(el, 0)}
            className="pointer-events-none absolute inset-0 z-0 rounded-full ring-4 ring-fuchsia-500/80"
          />
          <span
            ref={(el) => setWaveRef(el, 1)}
            className="pointer-events-none absolute inset-0 z-0 rounded-full ring-4 ring-pink-500/70"
          />
          <span
            ref={(el) => setWaveRef(el, 2)}
            className="pointer-events-none absolute inset-0 z-0 rounded-full ring-4 ring-violet-500/60"
          />
          <Button
            ref={btnRef}
            size="lg"
            className="rounded-full h-15 w-15 p-0 shadow-2xl bg-linear-to-br from-pink-500 to-indigo-400 text-white ring-2 ring-white/40 hover:ring-white/70"
            aria-label="Mở chat HappyPaws"
            onClick={() => setOpen(true)}
          >
            <Bot className="h-20 w-20" />
          </Button>
        </div>
      )}

      {open && (
        <div className="w-[340px] sm:w-[400px] h-[560px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header with Tabs */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-2xl">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="font-semibold text-lg">HappyPaws Chat</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 px-2">
              <button
                onClick={() => setChatMode("ai")}
                className={cn(
                  "px-4 py-2.5 font-medium text-sm transition-all rounded-t-xl relative",
                  isLoggedIn ? "flex-1" : "w-full",
                  chatMode === "ai"
                    ? "bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white before:content-[''] before:absolute before:bottom-0 before:left-[-8px] before:w-[8px] before:h-[8px] before:rounded-br-2xl before:shadow-[4px_4px_0_0] before:shadow-gray-50 dark:before:shadow-gray-800/50 after:content-[''] after:absolute after:bottom-0 after:right-[-8px] after:w-[8px] after:h-[8px] after:rounded-bl-2xl after:shadow-[-4px_4px_0_0] after:shadow-gray-50 dark:after:shadow-gray-800/50"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span>AI Assistant</span>
                </div>
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => setChatMode("staff")}
                  className={cn(
                    "flex-1 px-4 py-2.5 font-medium text-sm transition-all rounded-t-xl relative",
                    chatMode === "staff"
                      ? "bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white before:content-[''] before:absolute before:bottom-0 before:left-[-8px] before:w-[8px] before:h-[8px] before:rounded-br-2xl before:shadow-[4px_4px_0_0] before:shadow-gray-50 dark:before:shadow-gray-800/50 after:content-[''] after:absolute after:bottom-0 after:right-[-8px] after:w-[8px] after:h-[8px] after:rounded-bl-2xl after:shadow-[-4px_4px_0_0] after:shadow-gray-50 dark:after:shadow-gray-800/50"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Staff Support</span>
                    {chatMode === "staff" && hasSession && (
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          staffJoined ? "bg-green-500" : "bg-yellow-500"
                        )}
                      />
                    )}
                  </div>
                </button>
              )}
            </div>
          </div>

          {chatMode === "ai" ? (
            // AI Chat Mode
            <>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b">
                <button
                  type="button"
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                  onClick={() => setShowInfo((v) => !v)}
                >
                  {showInfo
                    ? "▼ Ẩn thông tin thú cưng"
                    : "▶ Thông tin thú cưng (tuỳ chọn)"}
                </button>
                {showInfo && (
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div className="col-span-1 font-poppins-light">
                      <Select
                        value={selectedPetId}
                        onValueChange={handleSelectPet}
                        disabled={loadingPets || pets.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            className="font-poppins-light"
                            placeholder={
                              loadingPets
                                ? "Đang tải thú cưng..."
                                : pets.length
                                ? "Chọn thú cưng của bạn"
                                : "Chưa có thú cưng để chọn"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent align="start">
                          {pets.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              <span className="font-poppins-light">
                                {p.name}
                              </span>
                              <span className="text-black font-poppins-light">
                                {" "}
                                — {p.species}
                                {p.breed ? ` / ${p.breed}` : ""}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Conversation */}
              <div
                ref={viewportRef}
                className="flex-1 px-4 py-3 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
              >
                <ul className="space-y-4">
                  {messages.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {m.sender === "bot" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                          m.sender === "user"
                            ? "ml-auto bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-tr-sm"
                            : "mr-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-sm"
                        )}
                      >
                        {m.sender === "bot" ? renderBotContent(m.text) : m.text}
                      </div>
                      {m.sender === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                          You
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Composer */}
              <div className="border-t px-4 py-3 bg-white dark:bg-gray-900">
                <div className="flex gap-2 items-end">
                  <Textarea
                    placeholder="Nhập câu hỏi của bạn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={2}
                    className="flex-1 resize-none rounded-xl"
                  />
                  <Button
                    onClick={() => void sendMessage()}
                    disabled={!canSend}
                    className="h-10 w-10 p-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    size="icon"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            // Staff Chat Mode
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Status Badge */}
              {hasSession && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {staffJoined ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-400">
                              Đang tư vấn
                            </span>
                          </div>
                          {currentSession?.staff && (
                            <span className="text-xs text-muted-foreground">
                              • {currentSession.staff.firstName}{" "}
                              {currentSession.staff.lastName}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                            Đang chờ staff...
                          </span>
                        </>
                      )}
                    </div>
                    {isConnected ? (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        ● Online
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 dark:text-red-400">
                        ○ Offline
                      </span>
                    )}
                  </div>
                </div>
              )}

              {!hasSession ? (
                // Create Staff Session Form
                <div className="flex-1 p-4 flex flex-col">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Nhập nội dung bạn cần tư vấn, đội ngũ staff sẽ hỗ trợ bạn
                      ngay
                    </p>
                    <Input
                      type="text"
                      placeholder="VD: Tư vấn về dịch vụ spa cho chó..."
                      value={consultationTitle}
                      onChange={(e) => setConsultationTitle(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateStaffSession();
                        }
                      }}
                      disabled={creatingSession}
                      className="w-full"
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {consultationTitle.length}/200 ký tự
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm mb-4">
                    <p className="text-blue-800 dark:text-blue-200">
                      💡 <strong>Lưu ý:</strong> Staff sẽ tham gia tư vấn cho
                      bạn trong thời gian sớm nhất.
                    </p>
                  </div>

                  <Button
                    onClick={handleCreateStaffSession}
                    disabled={!consultationTitle.trim() || creatingSession}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    {creatingSession ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Tạo yêu cầu tư vấn
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                // Staff Chat Messages
                <>
                  <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                    {staffMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center mb-4">
                          <MessageSquare className="h-8 w-8 text-pink-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Chưa có tin nhắn
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {staffJoined
                            ? "Bắt đầu trò chuyện với staff!"
                            : "Đang chờ staff tham gia..."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {staffMessages.map((msg) => {
                          const isOwn = currentUserId === msg.sender.id;

                          return (
                            <div
                              key={msg.id}
                              className={cn(
                                "flex gap-3 items-start",
                                isOwn ? "flex-row-reverse" : "flex-row"
                              )}
                            >
                              <Avatar className="h-8 w-8 flex-shrink-0 shadow-sm">
                                <AvatarFallback
                                  className={cn(
                                    "text-xs font-semibold",
                                    isOwn
                                      ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white"
                                      : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                                  )}
                                >
                                  {getInitials(
                                    msg.sender.firstName,
                                    msg.sender.lastName
                                  )}
                                </AvatarFallback>
                              </Avatar>

                              <div
                                className={cn(
                                  "flex flex-col max-w-[75%]",
                                  isOwn ? "items-end" : "items-start"
                                )}
                              >
                                <div
                                  className={cn(
                                    "flex items-center gap-2 mb-1 px-1",
                                    isOwn ? "flex-row-reverse" : "flex-row"
                                  )}
                                >
                                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    {isOwn ? "You" : msg.sender.firstName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(msg.createdAt)}
                                  </span>
                                </div>

                                <div
                                  className={cn(
                                    "px-4 py-3 rounded-2xl text-sm shadow-sm",
                                    isOwn
                                      ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-tr-sm"
                                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-sm"
                                  )}
                                >
                                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                                    {msg.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div ref={staffMessagesEndRef} />
                  </div>

                  {/* Staff Input */}
                  <div className="border-t p-4 bg-white dark:bg-gray-900">
                    {currentSession?.status === "CLOSED" ? (
                      <Button
                        onClick={handleResetToNewSession}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Tạo phiên tư vấn mới
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={staffInput}
                          onChange={(e) => setStaffInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendStaffMessage();
                            }
                          }}
                          placeholder="Nhập tin nhắn..."
                          disabled={staffSending || !isConnected}
                          className="flex-1 rounded-xl"
                        />
                        <Button
                          onClick={handleSendStaffMessage}
                          disabled={
                            !staffInput.trim() || staffSending || !isConnected
                          }
                          size="icon"
                          className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          {staffSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HappyPawsChat;
