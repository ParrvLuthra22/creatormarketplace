"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { usePublicCreators } from "@/lib/hooks/useCreators";
import { useCreateProposal } from "@/lib/hooks/useProposals";
import { useCampaignModal } from "@/lib/CampaignModalContext";
import { showToast } from "@/lib/toast";
import { getProfilePhotoUrl } from "@/lib/api";
import MagneticButton from "./MagneticButton";

const STEPS = ["Brief", "Deliverables", "Budget", "Creators", "Review"];
const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className="flex items-center justify-center h-6 w-6 rounded-full border font-mono-utility text-mono-sm transition-colors duration-300"
            style={{
              borderColor: i <= step ? "var(--accent)" : "var(--border)",
              background: i < step ? "var(--accent)" : "transparent",
              color: i < step ? "var(--bg-primary)" : i === step ? "var(--accent)" : "var(--text-tertiary)",
            }}
          >
            {i < step ? <Check size={11} /> : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="h-px w-4 transition-colors duration-300"
              style={{ background: i < step ? "var(--accent)" : "var(--border)" }}
              aria-hidden
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Step({ children, dir }: { children: React.ReactNode; dir: 1 | -1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 * dir }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 * dir }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export default function CreateCampaignModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { prefilledCreatorId } = useCampaignModal();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [niches, setNiches] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([""]);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const creatorsQuery = usePublicCreators({ search });
  const createProposal = useCreateProposal();

  useEffect(() => {
    if (open && prefilledCreatorId) {
      setSelectedCreatorIds((prev) => (prev.includes(prefilledCreatorId) ? prev : [...prev, prefilledCreatorId]));
    }
  }, [open, prefilledCreatorId]);

  const creators = useMemo(
    () =>
      (creatorsQuery.data?.creators || []).filter((creator: any) =>
        `${creator.name} ${creator.handle} ${(creator.niches || []).join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [creatorsQuery.data, search]
  );

  function reset() {
    setStep(0);
    setDir(1);
    setTitle("");
    setDescription("");
    setNiches("");
    setDeliverables([""]);
    setBudget("");
    setDeadline("");
    setSearch("");
    setSelectedCreatorIds([]);
  }

  function handleClose() {
    onClose();
    reset();
  }

  if (!open) return null;

  function goNext() {
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function goBack() {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  const deliverablesText = deliverables.filter(Boolean).join("\n");
  const canContinue =
    step === 0 ? Boolean(title && description && niches) :
    step === 1 ? deliverables.some(Boolean) :
    step === 2 ? Number(budget) > 0 && Boolean(deadline) :
    step === 3 ? selectedCreatorIds.length > 0 :
    true;

  async function submit() {
    await Promise.all(
      selectedCreatorIds.map((creatorId) =>
        createProposal.mutateAsync({
          creatorId,
          title,
          description,
          budget: Number(budget),
          deliverables: deliverablesText,
          deadline,
        })
      )
    );
    showToast(`Campaign sent to ${selectedCreatorIds.length} creator(s)`, "success");
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-(--border) bg-(--bg-secondary) text-(--text-primary) shadow-xl">
        <div className="flex items-center justify-between border-b border-(--border) p-5">
          <div>
            <p className="font-mono-utility text-mono-sm text-(--accent)">NEW CAMPAIGN</p>
            <h2 className="text-h3 font-display">{STEPS[step]}</h2>
          </div>
          <button onClick={handleClose} className="h-9 w-9 rounded-lg hover:bg-(--bg-surface) grid place-items-center" aria-label="Close" data-interactive>
            <X size={18} />
          </button>
        </div>

        <div className="p-5 border-b border-(--border)">
          <ProgressDots step={step} />
        </div>

        <div className="p-5 min-h-[360px] overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            {step === 0 && (
              <Step key="brief" dir={dir}>
                <div className="grid gap-4">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Campaign title"
                    data-interactive
                    className="h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Campaign brief, goals, and tone"
                    rows={6}
                    data-interactive
                    className="rounded-xl bg-(--bg-surface) border border-(--border) px-4 py-3 outline-none resize-none"
                  />
                  <input
                    value={niches}
                    onChange={(e) => setNiches(e.target.value)}
                    placeholder="Niches, comma-separated"
                    data-interactive
                    className="h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none"
                  />
                </div>
              </Step>
            )}

            {step === 1 && (
              <Step key="deliverables" dir={dir}>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">DELIVERABLES</p>
                <div className="space-y-2">
                  {deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={d}
                        onChange={(e) =>
                          setDeliverables((prev) => prev.map((item, idx) => (idx === i ? e.target.value : item)))
                        }
                        placeholder={`Deliverable ${i + 1} — e.g. "1 Instagram Reel"`}
                        data-interactive
                        className="flex-1 h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none"
                      />
                      {deliverables.length > 1 && (
                        <button
                          onClick={() => setDeliverables((prev) => prev.filter((_, idx) => idx !== i))}
                          className="h-9 w-9 rounded-lg hover:bg-(--bg-surface) grid place-items-center text-(--text-tertiary) hover:text-(--text-primary)"
                          aria-label="Remove deliverable"
                          data-interactive
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setDeliverables((prev) => [...prev, ""])}
                  className="mt-3 flex items-center gap-2 font-mono-utility text-mono-sm text-(--accent) hover:opacity-80 transition-opacity"
                  data-interactive
                >
                  <Plus size={13} /> ADD DELIVERABLE
                </button>
              </Step>
            )}

            {step === 2 && (
              <Step key="budget" dir={dir}>
                <div className="grid gap-6">
                  <div>
                    <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">BUDGET</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-h2 font-display text-(--text-tertiary)">₹</span>
                      <input
                        value={budget}
                        onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ""))}
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        data-interactive
                        className="text-h1 font-display tabular-nums bg-transparent outline-none w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">DEADLINE</p>
                    <input
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      type="date"
                      data-interactive
                      className="h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none"
                    />
                  </div>
                </div>
              </Step>
            )}

            {step === 3 && (
              <Step key="creators" dir={dir}>
                <div className="space-y-4">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search creators"
                    data-interactive
                    className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none"
                  />
                  <div className="grid sm:grid-cols-2 gap-3 max-h-72 overflow-auto">
                    {creators.map((creator: any) => {
                      const selected = selectedCreatorIds.includes(creator.id);
                      return (
                        <button
                          key={creator.id}
                          onClick={() =>
                            setSelectedCreatorIds((prev) =>
                              selected ? prev.filter((id) => id !== creator.id) : [...prev, creator.id]
                            )
                          }
                          data-interactive
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-150 ${selected ? "border-(--accent) bg-(--bg-surface)" : "border-(--border)"}`}
                        >
                          <div className="h-9 w-9 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-xs shrink-0">
                            {creator.profilePicture ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={getProfilePhotoUrl(creator.profilePicture)} alt={creator.name} className="h-full w-full object-cover" />
                            ) : (
                              creator.name.charAt(0)
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{creator.name}</p>
                            <p className="text-xs text-(--text-tertiary) truncate">{creator.handle} · {(creator.niches || []).join(", ")}</p>
                          </div>
                          {selected && <Check size={15} className="text-(--accent) ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Step>
            )}

            {step === 4 && (
              <Step key="review" dir={dir}>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-(--border) py-2.5">
                    <dt className="text-(--text-tertiary)">Title</dt>
                    <dd className="text-right">{title}</dd>
                  </div>
                  <div className="flex justify-between border-b border-(--border) py-2.5">
                    <dt className="text-(--text-tertiary)">Niches</dt>
                    <dd className="text-right">{niches}</dd>
                  </div>
                  <div className="flex justify-between border-b border-(--border) py-2.5">
                    <dt className="text-(--text-tertiary)">Deliverables</dt>
                    <dd className="text-right">{deliverables.filter(Boolean).length} item(s)</dd>
                  </div>
                  <div className="flex justify-between border-b border-(--border) py-2.5">
                    <dt className="text-(--text-tertiary)">Budget</dt>
                    <dd className="text-right font-mono-utility">₹{Number(budget || 0).toLocaleString("en-IN")}</dd>
                  </div>
                  <div className="flex justify-between border-b border-(--border) py-2.5">
                    <dt className="text-(--text-tertiary)">Deadline</dt>
                    <dd className="text-right">{deadline}</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-(--text-tertiary)">Creators</dt>
                    <dd className="text-right">{selectedCreatorIds.length} selected</dd>
                  </div>
                </dl>
              </Step>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-(--border) p-5">
          <MagneticButton variant="ghost" disabled={step === 0} onClick={goBack}>
            Back
          </MagneticButton>
          {step < STEPS.length - 1 ? (
            <MagneticButton variant="primary" disabled={!canContinue} onClick={goNext}>
              Continue
            </MagneticButton>
          ) : (
            <MagneticButton variant="primary" disabled={createProposal.isPending} onClick={submit}>
              {createProposal.isPending ? "Launching…" : "Launch Campaign"}
            </MagneticButton>
          )}
        </div>
      </div>
    </div>
  );
}
