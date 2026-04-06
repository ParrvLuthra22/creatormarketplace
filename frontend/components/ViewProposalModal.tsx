"use client";

import { useState } from "react";
import { X, Check, XCircle, Calendar, DollarSign, Package, FileText } from "lucide-react";
import { acceptProposal, declineProposal, Proposal } from "@/lib/api";

interface ViewProposalModalProps {
    proposal: Proposal;
    isOpen: boolean;
    onClose: () => void;
    userRole: "brand" | "creator";
    onStatusChange?: (proposal: Proposal) => void;
}

export function ViewProposalModal({ proposal, isOpen, onClose, userRole, onStatusChange }: ViewProposalModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleAccept = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await acceptProposal(proposal._id);
            onStatusChange?.(res.proposal);
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to accept proposal");
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await declineProposal(proposal._id);
            onStatusChange?.(res.proposal);
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to decline proposal");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = () => {
        switch (proposal.status) {
            case "accepted":
                return <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-xs font-bold">✓ Accepted</span>;
            case "declined":
                return <span className="px-3 py-1 bg-[#FFEBEE] text-[#C62828] rounded-full text-xs font-bold">✗ Declined</span>;
            default:
                return <span className="px-3 py-1 bg-[#FFF3E0] text-[#E65100] rounded-full text-xs font-bold">⏳ Pending</span>;
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-md w-full max-w-lg shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
                    <div>
                        <h2 className="text-xl font-bold text-black">{proposal.title}</h2>
                        <p className="text-sm text-[#6B6B6B] mt-1">
                            {userRole === "creator"
                                ? `From ${proposal.brandId?.fullName || "Brand"}`
                                : `To ${proposal.creatorId?.fullName || "Creator"}`
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge()}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-sm">{error}</div>
                    )}

                    {/* Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-[#6B6B6B]" />
                            <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Description</span>
                        </div>
                        <p className="text-sm text-black leading-relaxed bg-[#F9F9F9] rounded-md p-4">{proposal.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#F9F9F9] rounded-md p-4 text-center">
                            <DollarSign className="w-5 h-5 text-[#FF4D00] mx-auto mb-1" />
                            <p className="text-lg font-bold text-black">₹{proposal.budget?.toLocaleString()}</p>
                            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Budget</p>
                        </div>
                        <div className="bg-[#F9F9F9] rounded-md p-4 text-center">
                            <Package className="w-5 h-5 text-[#FF4D00] mx-auto mb-1" />
                            <p className="text-sm font-bold text-black">{proposal.deliverables}</p>
                            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Deliverables</p>
                        </div>
                        <div className="bg-[#F9F9F9] rounded-md p-4 text-center">
                            <Calendar className="w-5 h-5 text-[#FF4D00] mx-auto mb-1" />
                            <p className="text-sm font-bold text-black">{formatDate(proposal.deadline)}</p>
                            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Deadline</p>
                        </div>
                    </div>

                    {/* Sent date */}
                    <p className="text-xs text-[#6B6B6B] text-center">
                        Sent on {formatDate(proposal.createdAt)}
                    </p>

                    {/* Action Buttons - Creator only, pending only */}
                    {userRole === "creator" && proposal.status === "pending" && (
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleDecline}
                                disabled={loading}
                                className="flex-1 h-12 bg-[#F5F5F5] text-black font-bold rounded-md hover:bg-[#FFEBEE] hover:text-[#C62828] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <XCircle className="w-4 h-4" />
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={loading}
                                className="flex-1 h-12 bg-[#FF4D00] text-black font-bold rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Check className="w-4 h-4" />
                                Accept
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
