"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ToastProvider, useToast } from "@/components/dashboard/Toast";
import { useAuthStore } from "@/lib/auth";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshUser, isLoading } = useAuthStore();

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) grid place-items-center">
        <div className="h-10 w-10 rounded-full border-2 border-(--border) border-t-(--accent) animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

function ToastBridge() {
  const { toast } = useToast();

  useEffect(() => {
    function handler(event: Event) {
      const detail = (event as CustomEvent).detail as
        | { message?: string; type?: "success" | "error" | "info" }
        | undefined;
      if (detail?.message) toast(detail.message, detail.type || "info");
    }
    window.addEventListener("app-toast", handler);
    return () => window.removeEventListener("app-toast", handler);
  }, [toast]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: true,
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ToastBridge />
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
}
