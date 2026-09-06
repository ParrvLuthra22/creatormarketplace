"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatorSidebar from "@/components/dashboard/CreatorSidebar";
import TopBar from "@/components/dashboard/TopBar";
import { ToastProvider } from "@/components/dashboard/Toast";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { useAuthStore } from "@/lib/auth";

export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuthStore();

  // Middleware only checks that a token cookie exists — re-verify the actual
  // role here once the store hydrates, and bounce mismatches to the right dashboard.
  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login/creator");
      return;
    }
    if (user.accountType !== "Creator") {
      router.replace("/dashboard/brand");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const nav = document.querySelector("[data-global-nav]") as HTMLElement | null;
    const footer = document.querySelector("[data-global-footer]") as HTMLElement | null;
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";

    // Expose mobile nav opener for TopBar hamburger button
    (window as unknown as Record<string, unknown>).__openMobileNav = () =>
      setMobileNavOpen(true);

    return () => {
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
      delete (window as unknown as Record<string, unknown>).__openMobileNav;
    };
  }, []);

  return (
    <ToastProvider>
      <div
        className="flex bg-(--bg-primary)"
        style={{ height: "100dvh", overflow: "hidden" }}
      >
        <CreatorSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />
          {/* data-lenis-prevent: lets Lenis pass wheel events through so native
              overflow-y-auto scroll works without Lenis intercepting */}
          <main id="dashboard-scroll" className="flex-1 overflow-y-auto p-5 pb-24 md:p-7" data-lenis-prevent>{children}</main>
        </div>
      </div>
      <MobileSidebar
        type="creator"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <MobileBottomNav type="creator" />
    </ToastProvider>
  );
}
