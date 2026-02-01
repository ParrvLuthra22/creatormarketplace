"use client";

import { Proposal } from "@/lib/creatorData";
import { X, DollarSign, Calendar, FileText, Shield } from "lucide-react";
import { Button } from "./ui/Button";

interface ProposalDetailModalProps {
    proposal: Proposal;
    onClose: () => void;
}

export function ProposalDetailModal({ proposal, onClose }: ProposalDetailModalProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF6B9D] flex items-center justify-center text-white font-bold text-xl">
                                {proposal.brandLogo}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{proposal.brandName}</h2>
                                <p className="text-gray-600">{proposal.title}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6 space-y-6">
                        {/* Budget */}
                        <div className="bg-pink-50 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="w-6 h-6 text-[#FF6B9D]" />
                                <h3 className="text-lg font-semibold text-gray-900">Budget</h3>
                            </div>
                            <p className="text-3xl font-bold text-[#FF6B9D]">
                                ₹{proposal.budget.toLocaleString('en-IN')}
                            </p>
                        </div>

                        {/* Timeline */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Calendar className="w-5 h-5 text-[#FF6B9D]" />
                                <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
                            </div>
                            <p className="text-gray-700">
                                <span className="font-medium">Deadline:</span> {formatDate(proposal.deadline)}
                            </p>
                        </div>

                        {/* Deliverables */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <FileText className="w-5 h-5 text-[#FF6B9D]" />
                                <h3 className="text-lg font-semibold text-gray-900">Deliverables</h3>
                            </div>
                            <p className="text-gray-700">{proposal.deliverables}</p>
                        </div>

                        {/* Description */}
                        {proposal.description && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Campaign Brief</h3>
                                <p className="text-gray-700 leading-relaxed">{proposal.description}</p>
                            </div>
                        )}

                        {/* Usage Rights */}
                        {proposal.usageRights && (
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <Shield className="w-5 h-5 text-[#FF6B9D]" />
                                    <h3 className="text-lg font-semibold text-gray-900">Usage Rights</h3>
                                </div>
                                <p className="text-gray-700">{proposal.usageRights}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {proposal.status === 'new' && (
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 flex gap-4 rounded-b-2xl">
                            <Button
                                variant="primary"
                                className="flex-1 bg-[#FF6B9D] hover:bg-[#FF5A8D] py-3"
                            >
                                Accept Proposal
                            </Button>
                            <Button
                                variant="ghost"
                                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                            >
                                Decline
                            </Button>
                            <Button
                                variant="ghost"
                                className="border-2 border-[#FF6B9D] text-[#FF6B9D] hover:bg-pink-50 py-3"
                            >
                                Negotiate
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
