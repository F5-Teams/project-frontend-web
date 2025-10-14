import { useMemo } from "react";

export function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  userName?: string | null
): string {
  const s = (v?: string | null) => (v ?? "").trim();

  const f = s(firstName);
  const l = s(lastName);

  if (f || l) {
    const a = f ? f[0] : "";
    const b = l ? l[0] : "";
    const res = (a + b).toLocaleUpperCase("vi");
    if (res) return res;
  }

  const u = s(userName);
  if (u) {
    const parts = u.match(/[A-Za-z0-9]+/g) ?? [];
    const a = parts[0]?.[0] ?? u[0];
    const b = parts[1]?.[0] ?? "";
    const res = (a + b).toLocaleUpperCase("vi");
    if (res) return res;
  }

  return "?";
}

export function useInitials(args: {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
}) {
  const { firstName, lastName, userName } = args;
  return useMemo(
    () => getInitials(firstName, lastName, userName),
    [firstName, lastName, userName]
  );
}
