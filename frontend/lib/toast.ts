"use client";

export type AppToastType = "success" | "error" | "info";

export function showToast(message: string, type: AppToastType = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app-toast", { detail: { message, type } }));
}

/** `toast.success(...)`/`toast.error(...)`/`toast.info(...)` sugar over showToast. */
export const toast = {
  success: (message: string) => showToast(message, "success"),
  error: (message: string) => showToast(message, "error"),
  info: (message: string) => showToast(message, "info"),
};
