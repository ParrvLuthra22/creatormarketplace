"use client";

export type AppToastType = "success" | "error" | "info";

export function showToast(message: string, type: AppToastType = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app-toast", { detail: { message, type } }));
}
