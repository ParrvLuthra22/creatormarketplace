"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
    const [loading, setLoading] = useState(false);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !loading) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, loading, onClose]);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            // Modal will be closed or page redirected by parent
        } catch (error) {
            console.error("Delete account error:", error);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            style={{
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(4px)",
                animation: "fadeIn 200ms ease-out",
            }}
            onClick={() => !loading && onClose()}
        >
            <div
                className="bg-white border border-[#E5E5E5] rounded-md w-[380px] max-w-[90vw] px-8 pt-9 pb-7"
                style={{
                    animation: "scaleIn 250ms ease-out",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#2A1A1A] flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-[#FF4444]" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-[22px] font-milker text-black text-center mb-2">
                    Delete Account?
                </h2>

                {/* Description */}
                <p className="text-[13px] text-[#6B6B6B] text-center leading-[1.5] mb-7">
                    This action cannot be undone. All your data including profile and messages will be permanently removed.
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-2.5">
                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="w-full h-[46px] bg-[#FF4444] text-black rounded-sm font-angelo text-[15px] font-semibold hover:bg-[#D63E3E] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Deleting..." : "Yes, delete my account"}
                    </button>

                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full h-[46px] bg-transparent text-black border border-[#2A2A2A] rounded-sm font-angelo text-[15px] font-semibold hover:border-[#3D3D3D] transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.92);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
