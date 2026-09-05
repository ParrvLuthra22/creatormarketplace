"use client";

import { createContext, useContext, useState } from "react";

interface CampaignModalContextValue {
  open: boolean;
  /** Creator id to pre-select when the modal opens via an "Invite" action. */
  prefilledCreatorId?: string;
  openModal: (creatorId?: string) => void;
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
  const [prefilledCreatorId, setPrefilledCreatorId] = useState<string | undefined>(undefined);

  return (
    <CampaignModalContext.Provider
      value={{
        open,
        prefilledCreatorId,
        openModal: (creatorId) => {
          setPrefilledCreatorId(creatorId);
          setOpen(true);
        },
        closeModal: () => {
          setOpen(false);
          setPrefilledCreatorId(undefined);
        },
      }}
    >
      {children}
    </CampaignModalContext.Provider>
  );
}

export function useCampaignModal() {
  return useContext(CampaignModalContext);
}
