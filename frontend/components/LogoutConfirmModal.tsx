"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function LogoutConfirmModal({ isOpen, onConfirm, onCancel }: LogoutConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onCancel]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            style={{
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(4px)",
                animation: "fadeIn 200ms ease-out",
            }}
            onClick={onCancel}
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
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <LogOut className="w-[22px] h-[22px] text-black" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-[22px] font-milker text-black text-center mb-2">
                    Are you sure?
                </h2>

                {/* Description */}
                <p className="text-sm text-[#6B6B6B] text-center leading-[1.5] mb-7">
                    You will be logged out of your account. You can log back in anytime.
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-2.5">
                    {/* Confirm Button */}
                    <button
                        onClick={onConfirm}
                        className="w-full h-[46px] bg-white text-black rounded-sm font-angelo text-[15px] font-semibold hover:opacity-85 transition-opacity"
                    >
                        Yes, log out
                    </button>

                    {/* Cancel Button */}
                    <button
                        onClick={onCancel}
                        className="w-full h-[46px] bg-transparent text-black border border-[#2A2A2A] rounded-sm font-angelo text-[15px] font-semibold hover:border-[#3D3D3D] transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
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
        </div>,
        document.body
    );
}
