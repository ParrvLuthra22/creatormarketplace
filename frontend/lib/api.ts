/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { showToast } from "@/lib/toast";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type ApiConfig = InternalAxiosRequestConfig & {
  skipAuthRedirect?: boolean;
  skipErrorToast?: boolean;
};

function isProtectedRoute() {
  if (typeof window === "undefined") return false;
  return ["/dashboard", "/onboarding", "/admin"].some((path) =>
    window.location.pathname.startsWith(path)
  );
}

function extractErrorMessage(error: AxiosError<any>) {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    "Something went wrong"
  );
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: ApiConfig) => {
  config.headers = config.headers || {};
  config.headers["X-Request-ID"] =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const config = (error.config || {}) as ApiConfig;
    const message = extractErrorMessage(error);

    if (!config.skipErrorToast) {
      showToast(message, "error");
    }

    if (
      error.response?.status === 401 &&
      !config.skipAuthRedirect &&
      isProtectedRoute() &&
      typeof window !== "undefined"
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export function unwrap<T = any>(response: { data: any }): T {
  const payload = response.data;
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
}

export function apiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) return extractErrorMessage(error);
  return error instanceof Error ? error.message : "Something went wrong";
}
