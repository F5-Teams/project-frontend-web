"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPetsByUser } from "@/services/profile/profile-pet/api";
import type { Pet } from "@/services/profile/profile-pet/types";

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

export function HappyPawsChat({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Xin chào! Mình là trợ lý HappyPaws. Bạn muốn đặt lịch grooming/spa, hỏi giá khách sạn thú cưng, hay tư vấn sản phẩm?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
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

  const canSend = useMemo(
    () => input.trim().length > 0 && !sending,
    [input, sending]
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

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

  // Render bot message and convert [[btn Label|/path]] to real buttons
  const renderBotContent = useCallback(
    (text: string) => {
      const parts: React.ReactNode[] = [];
      const regex = /\[\[btn\s+([^|\]]+)\|([^\]]+)\]\]/g;
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

  return (
    // Giảm z-index để chat nằm dưới các overlay quan trọng khác (Header z-100, CartDrawer z-210)
    <div className={cn("fixed bottom-25 right-6 z-20", className)}>
      {!open && (
        <div className="relative" ref={containerRef}>
          <span
            ref={glowRef}
            className="absolute inset-0 -z-10 rounded-full bg-indigo-300/50 blur-xl opacity-60"
          />
          {/* Audio ripple waves */}
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
            className="rounded-full h-15 w-15 p-0 shadow-2xl bg-linear-to-br from-pink-500  to-indigo-400 text-white ring-2 ring-white/40 hover:ring-white/70"
            aria-label="Mở chat HappyPaws"
            onClick={() => setOpen(true)}
          >
            <Bot className="h-20 w-20" />
          </Button>
        </div>
      )}

      {open && (
        <div className="w-[340px] sm:w-[380px] h-[460px] bg-white border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b bg-white">
            <div className="font-poppins-regular">Trợ Lý Thú Cưng AI</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-3">
            <button
              type="button"
              className="text-xs text-primary hover:text-primary/80"
              onClick={() => setShowInfo((v) => !v)}
            >
              {showInfo ? "Ẩn thông tin (tuỳ chọn)" : "Thông tin (tuỳ chọn)"}
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
                          <span className="font-poppins-light">{p.name}</span>
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

          {/* Conversation */}
          <div ref={viewportRef} className="flex-1 px-3 py-2 overflow-y-auto">
            <ul className="space-y-3">
              {messages.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                      m.sender === "user"
                        ? "ml-auto bg-primary font-poppins-regular text-primary-foreground"
                        : "mr-auto bg-muted"
                    )}
                  >
                    {m.sender === "bot" ? renderBotContent(m.text) : m.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Composer */}
          <div className="border-t px-3 py-2 grid grid-cols-[1fr_auto] gap-2 font-poppins-light items-end bg-white">
            <Textarea
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
            />
            <Button
              onClick={() => void sendMessage()}
              disabled={!canSend}
              className="h-10"
            >
              {sending ? (
                <span>Đang gửi...</span>
              ) : (
                <span className="inline-flex font-poppins-light items-center gap-2">
                  <Send className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HappyPawsChat;
