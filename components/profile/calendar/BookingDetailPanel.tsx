"use client";

import React from "react";
import Image from "next/image";
import { StatusBadge } from "./StatusBadge";
import { formatDMY, toDate } from "@/utils/dateRange";
import { CalendarBooking } from "@/types/calendarType";
import {
  ApiBooking,
  ApiRoom,
  ApiPet,
  ApiCombo,
  ApiServiceLink,
} from "@/services/profile/profile-schedule/types";
import ServiceTagList from "./ServiceTagList";

type Props = {
  booking?: CalendarBooking | ApiBooking | null;
};

function isApiBooking(b: unknown): b is ApiBooking {
  return (
    !!b &&
    typeof b === "object" &&
    "bookingDate" in (b as Record<string, unknown>) &&
    ("pet" in (b as Record<string, unknown>) ||
      "slot" in (b as Record<string, unknown>) ||
      "room" in (b as Record<string, unknown>) ||
      "room" in (b as Record<string, unknown>))
  );
}

export function BookingDetailPanel({ booking }: Props) {
  if (!booking) {
    return (
      <div className="bg-white rounded-2xl p-6 text-sm text-gray-600">
        Chọn một booking để xem chi tiết.
      </div>
    );
  }

  const api = isApiBooking(booking) ? booking : null;

  const petObj: ApiPet | CalendarBooking["pet"] | null = api
    ? api.pet ?? null
    : (booking as CalendarBooking).pet ?? null;

  const petNameFromMeta: string | undefined = !api
    ? (booking as CalendarBooking).meta?.pet ?? undefined
    : undefined;

  const petImg: string | null = petObj?.imageUrl ?? null;
  const petName: string | undefined =
    petObj?.name ?? petNameFromMeta ?? undefined;

  const roomObj: ApiRoom | CalendarBooking["room"] | null = api
    ? api.room ?? api.Room ?? null
    : (booking as CalendarBooking).room ?? null;

  const roomNameFromMeta: string | undefined = !api
    ? (booking as CalendarBooking).meta?.room ?? undefined
    : undefined;

  const comboObj: ApiCombo | CalendarBooking["combo"] | null = api
    ? api.combo ?? null
    : (booking as CalendarBooking).combo ?? null;

  function hasServiceLinks(
    c: unknown
  ): c is { serviceLinks: ApiServiceLink[] } {
    if (!c || typeof c !== "object") return false;
    const obj = c as Record<string, unknown>;
    if (!("serviceLinks" in obj)) return false;
    const val = obj["serviceLinks"];
    return Array.isArray(val) && val.every((it) => typeof it === "object");
  }

  const serviceLinks: ApiServiceLink[] = hasServiceLinks(comboObj)
    ? comboObj.serviceLinks
    : [];

  // safe getter for combo image (handles multiple shapes returned by API or mapped CalendarBooking)
  function getComboImage(c: unknown): string | null {
    if (!c || typeof c !== "object") return null;
    const obj = c as Record<string, unknown>;

    // direct image on combo
    if ("imageUrl" in obj && typeof obj.imageUrl === "string") {
      return obj.imageUrl;
    }

    // serviceLinks -> service.imageUrl
    const sl = obj["serviceLinks"];
    if (Array.isArray(sl) && sl.length > 0) {
      const first = sl[0] as Record<string, unknown> | undefined;
      const svc = first?.["service"];
      if (
        svc &&
        typeof svc === "object" &&
        typeof (svc as Record<string, unknown>)["imageUrl"] === "string"
      ) {
        return (svc as Record<string, unknown>)["imageUrl"] as string;
      }
    }

    // legacy "services" shape from API: services[].imageUrl
    const services = obj["services"];
    if (Array.isArray(services) && services.length > 0) {
      const s0 = services[0] as Record<string, unknown> | undefined;
      if (s0 && typeof s0["imageUrl"] === "string") {
        return s0["imageUrl"] as string;
      }
    }

    return null;
  }

  const comboImage: string | null = getComboImage(comboObj);

  const rawStart =
    api?.slot?.startDate ??
    (booking as CalendarBooking).startDate ??
    (booking as CalendarBooking).meta?.startDate ??
    (booking as CalendarBooking).meta?.bookingDate ??
    (booking as ApiBooking)?.bookingDate;
  const rawEnd =
    api?.slot?.endDate ??
    (booking as CalendarBooking).endDate ??
    (booking as CalendarBooking).meta?.endDate ??
    (booking as ApiBooking)?.bookingDate;

  const start = toDate(rawStart);
  const end = toDate(rawEnd);
  const bookingDate = toDate(
    api?.bookingDate ??
      (booking as CalendarBooking).bookingDate ??
      (booking as CalendarBooking).meta?.bookingDate
  );

  return (
    <div className="bg-white rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          {petImg ? (
            <Image
              src={petImg}
              alt={petName ?? "pet"}
              className="rounded-lg object-cover border"
              width={120}
              height={120}
            />
          ) : (
            <div className="w-16 h-16 rounded-lg border border-dashed flex items-center justify-center text-xs text-gray-400">
              Chưa có ảnh
            </div>
          )}

          <div>
            <div className="text-lg font-poppins-regular text-gray-900 mb-2">
              Tên pet:{" "}
            </div>
            {petName && (
              <div className="text-lg text-center bg-pink-50 text-black border rounded-2xl transition-all duration-200 ease-in-out transform hover:bg-primary-card/10 hover:text-primary hover:-translate-y-1 hover:shadow-sm hover:font-poppins-medium p-2">
                {petName}
              </div>
            )}
          </div>
          <br />
          <div>
            {start && end ? (
              <div>
                <div>Thời gian:</div>
                <div className="font-poppins-regular space-y-1">
                  {start.getTime() !== end.getTime() ? (
                    <>
                      <div>
                        <div className="text-sm font-poppins-light text-gray-500">
                          Bắt đầu
                        </div>
                        <div>{formatDMY(start)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-poppins-light text-gray-500">
                          Kết thúc
                        </div>
                        <div>{formatDMY(end)}</div>
                      </div>
                    </>
                  ) : (
                    <div>{formatDMY(start)}</div>
                  )}
                </div>
              </div>
            ) : bookingDate ? (
              <div>
                <div className="text-md font-poppins-regular text-gray-800">
                  Thời gian:{" "}
                  <span className="text-sm font-poppins-light">
                    {formatDMY(bookingDate)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Chưa có đủ thông tin ngày.
              </div>
            )}
          </div>
        </div>

        <StatusBadge
          status={api?.status ?? (booking as CalendarBooking).status}
        />
      </div>

      {roomObj || roomNameFromMeta ? (
        <div className="text-md text-gray-800 space-y-2">
          <div>
            Hạng:{" "}
            <span className="font-poppins-medium">
              {roomObj?.name ?? roomNameFromMeta}
            </span>
          </div>

          {roomObj?.imageUrl && (
            <div className="pt-2">
              <Image
                src={roomObj.imageUrl}
                alt=""
                width={320}
                height={180}
                className="w-full max-w-xs rounded-md object-cover border"
              />
            </div>
          )}
        </div>
      ) : comboObj ? (
        <div className="text-sm text-gray-800 space-y-2">
          <div>
            Gói: <span className="font-medium">{comboObj.name}</span>
          </div>
          {comboObj.duration != null && (
            <div>
              Thời lượng:{" "}
              <span className="font-medium">{comboObj.duration} phút</span>
            </div>
          )}

          {/* replaced list with horizontal tags */}
          {serviceLinks.length ? (
            <div>
              <div className="text-sm text-gray-700 mb-1">Dịch vụ:</div>
              <ServiceTagList items={serviceLinks} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
