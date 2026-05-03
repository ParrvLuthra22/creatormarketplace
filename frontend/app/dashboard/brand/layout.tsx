"use client";

import { useEffect, useState } from "react";
import BrandSidebar from "@/components/dashboard/BrandSidebar";
import TopBar from "@/components/dashboard/TopBar";
import { ToastProvider } from "@/components/dashboard/Toast";
import CreateCampaignModal from "@/components/dashboard/CreateCampaignModal";

export default function BrandDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);

  useEffect(() => {
    // Directly hide/restore the global nav and footer elements —
    // more reliable than body-class CSS since the CSS bundle may be cached.
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
      {/* Full-screen flex layout — sits inside root layout's <main flex-1> */}
      <div
        className="flex bg-(--bg-primary) overflow-hidden"
        style={{ height: "100dvh", marginTop: 0 }}
      >
        <BrandSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar onNewCampaign={() => setCampaignModalOpen(true)} />
          <main className="flex-1 overflow-y-auto p-5 md:p-7">
            {children}
          </main>
        </div>
        <CreateCampaignModal open={campaignModalOpen} onClose={() => setCampaignModalOpen(false)} />
      </div>
    </ToastProvider>
  );
}
