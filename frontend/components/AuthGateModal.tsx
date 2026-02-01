"use client";

import { X } from "lucide-react";
import { Button } from "./ui/Button";

interface AuthGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
    onSignup: () => void;
}

export function AuthGateModal({ isOpen, onClose, onLogin, onSignup }: AuthGateModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-[#141414] border border-[#1F1F1F] rounded-2xl w-full max-w-md shadow-2xl p-10 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#6B6B6B] hover:text-white p-2 rounded-full hover:bg-[#1F1F1F] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 font-milker">
                        Sign in to discover more creators
                    </h2>
                    <p className="text-[#6B6B6B]">
                        Join 500+ brands finding the perfect creators
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={onLogin}
                        className="w-full bg-white hover:bg-[#E5E5E5] text-black py-6 text-lg rounded-xl shadow-lg font-angelo"
                    >
                        Sign In
                    </Button>

                    <Button
                        onClick={onSignup}
                        variant="ghost"
                        className="w-full border-2 border-white text-white hover:bg-[#1A1A1A] py-6 text-lg rounded-xl font-angelo"
                    >
                        Create Account
                    </Button>
                </div>

                <p className="text-center text-xs text-[#3D3D3D] mt-6">
                    Get access to 1000+ verified creators
                </p>
            </div>
        </div>
    );
}
