"use client";

import { useEffect } from "react";
import CreatorSidebar from "@/components/dashboard/CreatorSidebar";
import TopBar from "@/components/dashboard/TopBar";
import { ToastProvider } from "@/components/dashboard/Toast";

export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <ToastProvider>
      <div
        className="flex bg-(--bg-primary) overflow-hidden"
        style={{ height: "100dvh" }}
      >
        <CreatorSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-5 md:p-7">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
