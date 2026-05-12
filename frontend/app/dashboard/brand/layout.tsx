"use client";

import { useEffect, useState } from "react";
import BrandSidebar from "@/components/dashboard/BrandSidebar";
import TopBar from "@/components/dashboard/TopBar";
import { ToastProvider } from "@/components/dashboard/Toast";
import CreateCampaignModal from "@/components/dashboard/CreateCampaignModal";
import { CampaignModalProvider, useCampaignModal } from "@/lib/CampaignModalContext";
import MobileSidebar from "@/components/dashboard/MobileSidebar";

function BrandDashboardInner({ children }: { children: React.ReactNode }) {
  const { open, openModal, closeModal } = useCampaignModal();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const nav = document.querySelector("[data-global-nav]") as HTMLElement | null;
    const footer = document.querySelector("[data-global-footer]") as HTMLElement | null;

    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";

    (window as unknown as Record<string, unknown>).__openMobileNav = () =>
      setMobileNavOpen(true);

    return () => {
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
      delete (window as unknown as Record<string, unknown>).__openMobileNav;
    };
  }, []);

  return (
    <>
      {/* Full-screen flex layout — sits inside root layout's <main flex-1> */}
      <div
        className="flex bg-(--bg-primary)"
        style={{ height: "100dvh", marginTop: 0, overflow: "hidden" }}
      >
        <BrandSidebar onNewCampaign={openModal} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar onNewCampaign={openModal} />
          {/* data-lenis-prevent: tells Lenis not to call e.preventDefault() on
              wheel events inside here, so native overflow-y-auto scroll works. */}
          <main className="flex-1 overflow-y-auto p-5 md:p-7" data-lenis-prevent>
            {children}
          </main>
        </div>
        <CreateCampaignModal open={open} onClose={closeModal} />
      </div>
      <MobileSidebar
        type="brand"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onNewCampaign={openModal}
      />
    </>
  );
}

export default function BrandDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <CampaignModalProvider>
        <BrandDashboardInner>{children}</BrandDashboardInner>
      </CampaignModalProvider>
    </ToastProvider>
  );
}
