import React from "react";

type Props = {
  items:
    | {
        service?: { name?: string } | undefined;
        serviceId?: number | undefined;
        id?: number | undefined;
        name?: string | undefined;
      }[]
    | undefined;
  className?: string;
};

const PALETTE: { bg: string; text: string; border: string }[] = [
  { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200" },
  { bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200" },
  { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200" },
  { bg: "bg-lime-50", text: "text-lime-800", border: "border-lime-200" },
  { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
  {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
];

function getName(item: unknown, index: number): string {
  if (!item || typeof item !== "object") return `Dịch vụ ${index + 1}`;
  const obj = item as Record<string, unknown>;
  if ("service" in obj && obj.service && typeof obj.service === "object") {
    const svc = obj.service as Record<string, unknown>;
    if (typeof svc.name === "string") return svc.name;
  }
  if (typeof obj.name === "string") return obj.name;
  if (typeof obj.serviceId === "number") return `Dịch vụ ${obj.serviceId}`;
  if (typeof obj.id === "number") return `Dịch vụ ${obj.id}`;
  return `Dịch vụ ${index + 1}`;
}

function getKey(item: unknown, index: number): string {
  if (!item || typeof item !== "object") return `svc-${index}`;
  const obj = item as Record<string, unknown>;
  if (typeof obj.id === "number") return `id-${obj.id}`;
  if (typeof obj.serviceId === "number") return `svc-${obj.serviceId}-${index}`;
  return `svc-${index}`;
}

function colorFor(
  item: unknown,
  index: number
): { bg: string; text: string; border: string } {
  const name = getName(item, index);
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[h % PALETTE.length];
}

export const ServiceTagList: React.FC<Props> = ({ items, className }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 items-center ${className ?? ""}`}>
      {items.map((sl, i) => {
        const name = getName(sl, i);
        const key = getKey(sl, i);
        const c = colorFor(sl, i);
        // use only bottom border (border-b-2) with palette border color
        return (
          <span
            key={key}
            className={`inline-flex items-center text-sm font-poppins-light px-4 py-2 rounded-full ${c.bg} ${c.text} border-b-4 ${c.border}`}
          >
            {name}
          </span>
        );
      })}
    </div>
  );
};

export default ServiceTagList;
