"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/config/axios";
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<Record<
    string,
    unknown
  > | null>(null);

  useEffect(() => {
    setEmail(emailParam);
  }, [emailParam]);

  function getErrorMessage(
    err: unknown,
    fallback = "Mã OTP không đúng. Vui lòng thử lại."
  ) {
    if (typeof err === "object" && err !== null) {
      const e = err as Record<string, unknown>;
      const resp = e["response"];
      if (typeof resp === "object" && resp !== null) {
        const data = (resp as Record<string, unknown>)["data"];
        if (typeof data === "object" && data !== null) {
          const msg = (data as Record<string, unknown>)["message"];
          if (typeof msg === "string") return msg;
        }
      }
    }
    return fallback;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email không hợp lệ. Vui lòng quay lại trang đăng ký.");
      return;
    }
    if (!code.trim()) {
      setError("Vui lòng nhập mã OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    const payload = { email, otp: code.trim() };

    const verifyPromise = api.post("auth/verify-otp", payload).then((res) => {
      const resObj = res as unknown as Record<string, unknown>;
      const data =
        (resObj["data"] as Record<string, unknown> | undefined) ?? {};
      const statusCode =
        typeof resObj["status"] === "number"
          ? (resObj["status"] as number)
          : undefined;

      const hasSuccessField = Object.prototype.hasOwnProperty.call(
        data,
        "success"
      );
      const hasVerifiedField = Object.prototype.hasOwnProperty.call(
        data,
        "verified"
      );
      const hasStatusField = Object.prototype.hasOwnProperty.call(
        data,
        "status"
      );

      let isOk = false;

      // 1) If backend returns a numeric `code` field (common pattern: 0 = success)
      if (
        Object.prototype.hasOwnProperty.call(data, "code") &&
        typeof (data as Record<string, unknown>)["code"] === "number"
      ) {
        isOk = ((data as Record<string, unknown>)["code"] as number) === 0;
      } else if (
        hasSuccessField &&
        typeof (data as Record<string, unknown>)["success"] === "boolean"
      ) {
        isOk = (data as Record<string, unknown>)["success"] === true;
      } else if (
        hasVerifiedField &&
        typeof (data as Record<string, unknown>)["verified"] === "boolean"
      ) {
        isOk = (data as Record<string, unknown>)["verified"] === true;
      } else if (
        hasStatusField &&
        typeof (data as Record<string, unknown>)["status"] === "string"
      ) {
        const s = (
          (data as Record<string, unknown>)["status"] as string
        ).toLowerCase();
        isOk = s === "ok" || s === "success" || s === "verified";
      } else {
        // No explicit indicators in body — fall back to HTTP status code
        isOk =
          typeof statusCode === "number" &&
          statusCode >= 200 &&
          statusCode < 300;
      }

      // keep last response for debugging when something goes wrong
      setLastResponse(data ?? null);

      if (!isOk) {
        // Normalize error so getErrorMessage can read it
        const message =
          typeof (data as Record<string, unknown>)["message"] === "string"
            ? ((data as Record<string, unknown>)["message"] as string)
            : "Mã OTP không đúng. Vui lòng thử lại.";
        return Promise.reject({ response: { data: { message } } });
      }
      return res;
    });

    try {
      await toast.promise(verifyPromise, {
        loading: "Đang xác thực mã…",
        success: "Xác thực thành công.",
        error: (err: unknown) => getErrorMessage(err),
      });

      // ❷ Chỉ redirect khi promise THỰC SỰ resolve (tức là xác thực thành công)
      router.push("/login");
    } catch (err: unknown) {
      // ❸ Nếu reject → hiển thị lỗi và KHÔNG redirect
      setError(getErrorMessage(err));
      console.error("Verify OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-pink-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-pink-300 py-6 px-6">
        <h2 className="text-2xl font-poppins-regular text-center text-gray-900 mb-4">
          Xác thực mã OTP
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Một mã OTP đã được gửi đến email:{" "}
          <strong>{email || "(không có)"}</strong>
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {lastResponse && (
          <div className="mb-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <details>
              <summary className="cursor-pointer">
                Chi tiết response (debug)
              </summary>
              <pre className="whitespace-pre-wrap mt-2">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-md font-poppins-regular mb-1">
              Mã OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-sm font-poppins-light border border-ring rounded-lg px-3 py-2"
              disabled={isLoading}
              required
              placeholder="Nhập mã OTP"
              maxLength={10}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg text-white font-poppins-regular ${
              isLoading
                ? "bg-pink-500 opacity-80"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {isLoading ? "Xác thực…" : "Xác thực"}
          </button>
        </form>
      </div>
    </div>
  );
}
