"use client";

import React, { useState } from "react";

export default function EvidenceNotice() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="evidence-wrap">
        <button
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="badge"
          title="Xem quy định ảnh minh chứng"
          type="button"
        >
          <span className="mark">!</span>
        </button>

        {open && (
          <div
            className="panel"
            role="dialog"
            aria-label="Quy định ảnh minh chứng"
          >
            <div className="panel-section">
              <div className="panel-title">1) Chính sách / Quy định</div>
              <div className="panel-body font-poppins-light">
                - Mục đích: Bảo đảm minh chứng dịch vụ, đồng bộ thông tin
                trước–sau, xử lý khiếu nại và kiểm soát chất lượng.
                <br />
                - Phạm vi: Tất cả booking có thao tác nghiệp vụ (check-in, bắt
                đầu dịch vụ, đánh dấu hoàn thành, check-out).
                <br />- Nguyên tắc bắt buộc: Trước khi thực hiện bất kỳ thao tác
                nghiệp vụ nào trên booking, Groomer phải tải ảnh pet làm minh
                chứng.
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-title">2) Tiêu chuẩn ảnh minh chứng</div>
              <div className="panel-body font-poppins-light">
                - Rõ mặt pet, đủ sáng, không che khuất.
                <br />
                - Khung hình toàn thân hoặc vùng cần chăm sóc (tuỳ dịch vụ).
                <br />
                - Không dùng ảnh cũ/ảnh từ internet; phải là ảnh chụp tại thời
                điểm nhận/chuẩn bị thực hiện.
                <br />
                - Số lượng tối thiểu: 1 ảnh; khuyến nghị: 2–3 ảnh.
                <br />- Ảnh không chứa thông tin nhạy cảm, không làm lộ thông
                tin khách khác.
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .evidence-wrap {
          display: inline-block;
          position: relative;
          margin-left: 10px;
        }

        .badge {
          position: relative;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #ff6b6b, #ff9f43);
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(255, 99, 71, 0.18);
          padding: 0;
          transition: transform 160ms ease;
          outline: none;
          z-index: 20;
          overflow: visible;
        }

        .badge:active {
          transform: scale(0.98);
        }

        .mark {
          color: white;
          font-weight: 800;
          font-size: 18px;
          line-height: 1;
          position: relative;
          z-index: 30;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
        }

        /* stronger sonar rings: two expanding, more opaque concentric rings */
        .badge::before,
        .badge::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(0.6);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10;
          background: radial-gradient(
            circle at center,
            rgba(255, 74, 74, 0.3) 0%,
            rgba(255, 74, 74, 0.12) 45%,
            transparent 70%
          );
          mix-blend-mode: screen;
          opacity: 0;
          filter: blur(0.6px);
        }

        .badge::before {
          animation: sonar-strong 1800ms cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }

        .badge::after {
          width: 72px;
          height: 72px;
          animation: sonar-strong 2200ms cubic-bezier(0.22, 1, 0.36, 1) infinite;
          animation-delay: 650ms; /* stagger second ring */
          background: radial-gradient(
            circle at center,
            rgba(255, 74, 74, 0.2) 0%,
            rgba(255, 74, 74, 0.08) 45%,
            transparent 70%
          );
        }

        @keyframes sonar-strong {
          0% {
            transform: translate(-50%, -50%) scale(0.6);
            opacity: 0.9;
            filter: blur(0px);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0.36;
            filter: blur(3px);
          }
          100% {
            transform: translate(-50%, -50%) scale(2.6);
            opacity: 0;
            filter: blur(8px);
          }
        }

        .panel {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          z-index: 60;
          width: 340px;
          max-width: 86vw;
          background: #fff;
          border: 1px solid #e6e6e9;
          border-radius: 8px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
          padding: 12px;
          font-size: 13px;
          color: #0f172a;
        }

        .panel-section + .panel-section {
          margin-top: 8px;
          border-top: 1px dashed #f0eef6;
          padding-top: 8px;
        }

        .panel-title {
          font-weight: 600;
          margin-bottom: 6px;
          color: #111827;
          font-size: 13px;
        }
        .panel-body {
          color: #374151;
          line-height: 1.3;
          white-space: normal;
        }

        @media (prefers-reduced-motion: reduce) {
          .badge::before,
          .badge::after {
            animation: none;
            opacity: 0.18;
            transform: translate(-50%, -50%) scale(1);
            filter: none;
          }
        }
      `}</style>
    </>
  );
}
