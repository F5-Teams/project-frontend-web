export type HttpError = {
  status?: number;
  message: string;
  data?: unknown;
};

export function normalizeHttpError(err: any): HttpError {
  if (err?.response) {
    return {
      status: err.response.status,
      message: err.response.data?.message || err.message || "Request failed",
      data: err.response.data,
    };
  }
  return { message: err?.message || "Network error" };
}
