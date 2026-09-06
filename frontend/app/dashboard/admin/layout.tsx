"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { ToastProvider } from "@/components/dashboard/Toast";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { useAuthStore } from "@/lib/auth";

function NotAuthorized() {
  return (
    <div className="min-h-screen grid place-items-center bg-(--bg-primary) text-(--text-primary) px-6">
      <div className="text-center max-w-sm">
        <p className="font-mono-utility text-mono-sm text-(--warning) mb-4">403</p>
        <ShieldAlert size={40} className="mx-auto mb-5 text-(--warning)" />
        <h1 className="text-h3 font-display mb-2">Not authorized.</h1>
        <p className="text-sm text-(--text-secondary)">This area is restricted to CreatorLyff admins. Redirecting you back…</p>
      </div>
    </div>
  );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (isLoading) return;
    setChecked(true);

    if (!user) {
      router.replace("/login");
      return;
    }
    if (!user.isAdmin) {
      const fallback = user.accountType === "Brand" ? "/dashboard/brand" : "/dashboard/creator";
      const t = setTimeout(() => router.replace(fallback), 1400);
      return () => clearTimeout(t);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const nav = document.querySelector("[data-global-nav]") as HTMLElement | null;
    const footer = document.querySelector("[data-global-footer]") as HTMLElement | null;
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";
    return () => {
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  if (isLoading || !checked) {
    return (
      <div className="min-h-screen grid place-items-center bg-(--bg-primary)">
        <div className="h-8 w-8 rounded-full border-2 border-(--border) border-t-(--warning) animate-spin" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <NotAuthorized />;
  }

  return (
    <ToastProvider>
      <div className="flex bg-(--bg-primary)" style={{ height: "100dvh", overflow: "hidden" }}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminTopBar />
          <main id="dashboard-scroll" className="flex-1 overflow-y-auto p-5 pb-24 md:p-7" data-lenis-prevent>
            {children}
          </main>
        </div>
      </div>
      <MobileBottomNav type="admin" />
    </ToastProvider>
  );
}
