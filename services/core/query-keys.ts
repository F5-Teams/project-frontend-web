export const qk = {
  auth: {
    root: () => ["auth"] as const,
    me: () => ["auth", "me"] as const,
  },
  products: {
    root: () => ["products"] as const,
    list: (params?: unknown) => ["products", "list", params ?? {}] as const,
    detail: (id: string) => ["products", "detail", id] as const,
  },
  users: {
    list: (params?: unknown) => ["users", "list", params ?? {}] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
};
