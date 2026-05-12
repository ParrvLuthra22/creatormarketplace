"use client";

import { createContext, useContext, useState } from "react";

interface CampaignModalContextValue {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CampaignModalContext = createContext<CampaignModalContextValue>({
  open: false,
  openModal: () => {},
  closeModal: () => {},
});

export function CampaignModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <CampaignModalContext.Provider
      value={{ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }}
    >
      {children}
    </CampaignModalContext.Provider>
  );
}

export function useCampaignModal() {
  return useContext(CampaignModalContext);
}
