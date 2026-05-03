"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { usePublicCreators } from "@/lib/hooks/useCreators";
import { useCreateProposal } from "@/lib/hooks/useProposals";
import { showToast } from "@/lib/toast";

const steps = ["Brief", "Deliverables", "Budget", "Creators", "Review"];

export default function CreateCampaignModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [niches, setNiches] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const creatorsQuery = usePublicCreators({ search });
  const createProposal = useCreateProposal();

  const creators = useMemo(
    () =>
      (creatorsQuery.data?.creators || []).filter((creator: any) =>
        `${creator.name} ${creator.handle} ${(creator.niches || []).join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [creatorsQuery.data, search]
  );

  if (!open) return null;

  const canContinue =
    step === 0 ? title && description && niches :
    step === 1 ? deliverables :
    step === 2 ? Number(budget) > 0 && deadline :
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
          deliverables,
          deadline,
        })
      )
    );
    showToast(`Campaign sent to ${selectedCreatorIds.length} creator(s)`, "success");
    onClose();
    setStep(0);
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-(--border) bg-(--bg-secondary) text-(--text-primary) shadow-xl">
        <div className="flex items-center justify-between border-b border-(--border) p-5">
          <div>
            <p className="font-mono-utility text-mono-sm text-(--accent)">NEW CAMPAIGN</p>
            <h2 className="text-h3 font-display">{steps[step]}</h2>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-lg hover:bg-(--bg-surface) grid place-items-center">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 p-5 border-b border-(--border)">
          {steps.map((label, index) => (
            <div key={label} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-(--accent)" : "bg-(--border)"}`} />
          ))}
        </div>

        <div className="p-5 min-h-[360px]">
          {step === 0 && (
            <div className="grid gap-4">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Campaign title" className="h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Campaign brief, goals, and tone" rows={6} className="rounded-xl bg-(--bg-surface) border border-(--border) px-4 py-3 outline-none resize-none" />
              <input value={niches} onChange={(e) => setNiches(e.target.value)} placeholder="Niches, comma-separated" className="h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
            </div>
          )}

          {step === 1 && (
            <textarea value={deliverables} onChange={(e) => setDeliverables(e.target.value)} placeholder="Deliverables, timelines, usage terms" rows={10} className="w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 py-3 outline-none resize-none" />
          )}

          {step === 2 && (
            <div className="grid md:grid-cols-2 gap-4">
              <input value={budget} onChange={(e) => setBudget(e.target.value)} type="number" min={0} placeholder="Budget" className="h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
              <input value={deadline} onChange={(e) => setDeadline(e.target.value)} type="date" className="h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search creators" className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
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
                      className={`rounded-xl border p-3 text-left ${selected ? "border-(--accent) bg-(--bg-surface)" : "border-(--border)"}`}
                    >
                      <p className="font-semibold">{creator.name}</p>
                      <p className="text-xs text-(--text-tertiary)">{creator.handle} · {(creator.niches || []).join(", ")}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm">
              <p><b>Title:</b> {title}</p>
              <p><b>Niches:</b> {niches}</p>
              <p><b>Deliverables:</b> {deliverables}</p>
              <p><b>Budget:</b> ${budget}</p>
              <p><b>Deadline:</b> {deadline}</p>
              <p><b>Creators:</b> {selectedCreatorIds.length} selected</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-(--border) p-5">
          <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="h-10 px-4 rounded-lg border border-(--border) disabled:opacity-40">
            Back
          </button>
          {step < steps.length - 1 ? (
            <button disabled={!canContinue} onClick={() => setStep((s) => s + 1)} className="h-10 px-4 rounded-lg bg-(--accent) text-(--bg-primary) font-semibold disabled:opacity-50">
              Continue
            </button>
          ) : (
            <button disabled={createProposal.isPending} onClick={submit} className="h-10 px-4 rounded-lg bg-(--accent) text-(--bg-primary) font-semibold disabled:opacity-50">
              {createProposal.isPending ? "Sending..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
