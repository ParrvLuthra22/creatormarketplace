"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatorSidebar from "@/components/dashboard/CreatorSidebar";
import TopBar from "@/components/dashboard/TopBar";
import { ToastProvider } from "@/components/dashboard/Toast";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import AuthLoading from "@/components/dashboard/AuthLoading";
import { useAuthStore } from "@/lib/auth";

export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuthStore();

  // This is the only auth guard for the dashboard: the API is on a different
  // site than the frontend in production, so its httpOnly cookie is invisible
  // to Next middleware. Verify the session (and role) here once the store
  // hydrates, and bounce mismatches to the right place.
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

  // Don't render the shell (or mount child pages that fire API calls) until
  // we know this is a signed-in Creator; the effects above handle redirects.
  if (isLoading || !user || user.accountType !== "Creator") return <AuthLoading />;

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
