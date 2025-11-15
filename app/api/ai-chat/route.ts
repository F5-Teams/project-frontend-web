import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { spaApi } from "@/services/spa/api";
import type { SpaCombo } from "@/services/spa/api";
import { hotelApi } from "@/services/hotel/api";
import type { HotelRoom } from "@/services/hotel/api";
import { getAllProduct } from "@/services/product/getProductPublic/api";
import type { Product } from "@/services/product/getProductPublic/type";

export const runtime = "nodejs"; // Ensure Node runtime to access process.env

type Data = { result?: string; message?: string };
type Message = { sender: "user" | "bot"; text: string };

// Base instruction tailored for HappyPaws
const BASE_INSTRUCTION =
  "Bạn là AI chatbot của HappyPaws với phong cách tận tâm, chuyên nghiệp và nhẹ nhàng. Hãy hỗ trợ khách hàng về dịch vụ thú cưng (spa, grooming, khách sạn, đặt lịch, sản phẩm) dựa trên lịch sử hội thoại. Khi thông tin chưa đủ, hãy hỏi lại ngắn gọn để làm rõ trước khi tư vấn. Khi mô tả chi tiết combo spa, CHỈ sử dụng đúng nội dung 'Mô tả' và danh sách dịch vụ đi kèm từ dữ liệu tham chiếu cung cấp; không bịa đặt hay suy đoán thêm. Nếu dữ liệu tham chiếu thiếu thông tin, hãy nói rõ là hiện chưa có và đề xuất người dùng xem trang chi tiết combo.";

function buildSystemInstruction(input?: {
  userInfo?: {
    name?: string;
    phone?: string;
    petName?: string;
    petType?: string;
    breed?: string;
    age?: string | number;
    notes?: string;
  };
}): string {
  let systemInstruction = BASE_INSTRUCTION.trim();
  const { userInfo } = input || {};
  if (userInfo && Object.keys(userInfo).length > 0) {
    systemInstruction += `\n\nThông tin khách hàng/thú cưng (nếu có):\n• Tên KH: ${
      userInfo.name ?? "-"
    }\n• SĐT: ${userInfo.phone ?? "-"}\n• Tên thú cưng: ${
      userInfo.petName ?? "-"
    }\n• Loài: ${userInfo.petType ?? "-"}\n• Giống: ${
      userInfo.breed ?? "-"
    }\n• Tuổi: ${userInfo.age ?? "-"}\n• Ghi chú: ${userInfo.notes ?? "-"}`;
  }
  systemInstruction +=
    "\n\nQuy ước trả lời: ngắn gọn, rõ ràng, dùng tiếng Việt, không bịa đặt thông tin chính sách/giá nếu không chắc chắn; đề xuất người dùng để lại thông tin hoặc liên hệ tổng đài khi cần.";
  // CTA embedding instruction: bot can include navigation buttons directly in reply
  systemInstruction +=
    "\n\nNếu phù hợp, hãy đề xuất điều hướng bằng cách chèn các nút theo cú pháp: [[btn Nhãn|/duong-dan]]. Ví dụ: [[btn Xem dịch vụ Spa|/spa]] [[btn Đặt phòng khách sạn|/hotel]] [[btn Xem cửa hàng|/product]]. Hãy đặt các nút ở cuối câu trả lời và giữ nội dung còn lại ở dạng văn bản thường.";
  return systemInstruction;
}

async function buildReferenceContext() {
  try {
    const [combos, rooms, products] = await Promise.all([
      spaApi.getAvailableCombos().catch(() => [] as SpaCombo[]),
      hotelApi.getAvailableRooms().catch(() => [] as HotelRoom[]),
      getAllProduct().catch(() => [] as Product[]),
    ]);

    const comboText = (combos as SpaCombo[])
      .slice(0, 20)
      .map((c) => {
        const desc = (c.description ?? "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 400);
        const services = Array.isArray(c.serviceLinks)
          ? c.serviceLinks
              .map((sl) => sl?.service?.name)
              .filter(Boolean)
              .join(", ")
          : "";
        const lines = [
          `• Combo #${c.id}: ${c.name} — giá ${c.price} — ${c.duration} phút`,
        ];
        if (desc) lines.push(`  Mô tả: ${desc}`);
        if (services) lines.push(`  Bao gồm: ${services}`);
        return lines.join("\n");
      })
      .join("\n");
    const roomText = (rooms as HotelRoom[])
      .slice(0, 20)
      .map(
        (r) =>
          `• Phòng #${r.id}: ${r.name} (${r.class ?? r.size ?? "?"}) — giá ${
            r.price ?? "?"
          }`
      )
      .join("\n");
    const productText = (Array.isArray(products) ? (products as Product[]) : [])
      .slice(0, 30)
      .map(
        (p) =>
          `• SP #${p.id}: ${p.name} — ${p.type} — ${p.price}đ (kho: ${p.stocks})`
      )
      .join("\n");

    const ref =
      "\n\nDữ liệu tham chiếu (tóm tắt):\n" +
      (comboText ? `\nCombo Spa:\n${comboText}\n` : "") +
      (roomText ? `\nPhòng Khách Sạn:\n${roomText}\n` : "") +
      (productText ? `\nSản Phẩm:\n${productText}\n` : "");
    return ref;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" as const },
      { status: 405 }
    );
  }

  try {
    const body = (await req.json()) as {
      history?: Message[];
      userInfo?: {
        name?: string;
        phone?: string;
        petName?: string;
        petType?: string;
        breed?: string;
        age?: string | number;
        notes?: string;
      };
      model?: string; // optional override
    };

    const history = body?.history;
    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json(
        { message: "Missing or invalid history" },
        { status: 400 }
      );
    }

    // Prefer server-only env var; keep some fallbacks for existing setups
    const apiKey =
      process.env.AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "Server missing AI API key. Please set AI_API_KEY or GEMINI_API_KEY.",
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Prefer a modern model first; provide fallbacks to avoid 404 per region/API version
    const modelCandidates = [
      body?.model,
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-001",
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-pro-latest",
    ].filter(Boolean) as string[];

    // Map our history to Gemini content format + add reference data as a system/user leading context
    const reference = await buildReferenceContext();
    const intro = reference
      ? `Ngữ cảnh hệ thống về dịch vụ/sản phẩm hiện có (tóm tắt, có thể không đầy đủ, hãy xác minh khi cần):\n${reference}\n\n`.concat(
          "Hãy dùng dữ liệu trên cho câu trả lời nếu phù hợp."
        )
      : "";
    const contents = [
      ...(intro ? [{ role: "user" as const, parts: [{ text: intro }] }] : []),
      ...history.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text ?? "" }],
      })),
    ];

    let lastErr: unknown = null;
    for (const name of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: name,
          systemInstruction: buildSystemInstruction({
            userInfo: body?.userInfo,
          }),
        });
        const result = await model.generateContent({ contents });
        const text = result.response.text();
        return NextResponse.json({ result: text } satisfies Data, {
          status: 200,
        });
      } catch (e) {
        lastErr = e;
        // try next model
      }
    }

    const message =
      lastErr instanceof Error
        ? `All models failed. Last error: ${lastErr.message}`
        : `All models failed. Last error: ${String(lastErr)}`;
    return NextResponse.json({ message }, { status: 500 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message }, { status: 500 });
  }
}
