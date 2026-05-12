"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { createProposal } from "@/lib/api";

interface SendProposalModalProps {
    creatorId: string;
    creatorName: string;
    isOpen: boolean;
    onClose: () => void;
    onSent?: () => void;
}

export function SendProposalModal({ creatorId, creatorName, isOpen, onClose, onSent }: SendProposalModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [deliverables, setDeliverables] = useState("");
    const [deadline, setDeadline] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title || !description || !budget || !deliverables || !deadline) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        try {
            await createProposal({
                creatorId,
                title,
                description,
                budget: Number(budget),
                deliverables,
                deadline,
            });
            onSent?.();
            onClose();
            setTitle("");
            setDescription("");
            setBudget("");
            setDeliverables("");
            setDeadline("");
        } catch (err: any) {
            setError(err.message || "Failed to send proposal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-md w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
                    <div>
                        <h2 className="text-xl font-bold text-black">Send Proposal</h2>
                        <p className="text-sm text-[#6B6B6B] mt-1">To {creatorName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-sm">{error}</div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Campaign Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Summer Collection Launch"
                            className="w-full h-11 px-4 bg-[#F9F9F9] border border-[#E5E5E5] rounded-md text-sm text-black focus:outline-none focus:border-[#FF4D00] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what you need from this collaboration..."
                            rows={3}
                            className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-md text-sm text-black focus:outline-none focus:border-[#FF4D00] transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Budget (₹)</label>
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="15000"
                                className="w-full h-11 px-4 bg-[#F9F9F9] border border-[#E5E5E5] rounded-md text-sm text-black focus:outline-none focus:border-[#FF4D00] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Deadline</label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full h-11 px-4 bg-[#F9F9F9] border border-[#E5E5E5] rounded-md text-sm text-black focus:outline-none focus:border-[#FF4D00] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Deliverables</label>
                        <input
                            type="text"
                            value={deliverables}
                            onChange={(e) => setDeliverables(e.target.value)}
                            placeholder="e.g. 2 Reels, 3 Stories, 1 Post"
                            className="w-full h-11 px-4 bg-[#F9F9F9] border border-[#E5E5E5] rounded-md text-sm text-black focus:outline-none focus:border-[#FF4D00] transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[#FF4D00] text-white font-bold rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                        {loading ? "Sending..." : "Send Proposal"}
                    </button>
                </form>
            </div>
        </div>
    );
}
