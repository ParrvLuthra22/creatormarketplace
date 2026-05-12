"use client";

import { useEffect, useState } from "react";
import CreatorSidebar from "@/components/dashboard/CreatorSidebar";
import TopBar from "@/components/dashboard/TopBar";
import { ToastProvider } from "@/components/dashboard/Toast";
import MobileSidebar from "@/components/dashboard/MobileSidebar";

export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
          <main className="flex-1 overflow-y-auto p-5 md:p-7" data-lenis-prevent>{children}</main>
        </div>
      </div>
      <MobileSidebar
        type="creator"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </ToastProvider>
  );
}
