"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                setShowCurrent(false);
                setShowNew(false);
                setShowConfirm(false);
            }, 300);
        }
    }, [isOpen]);

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

    const getPasswordStrength = (password: string): PasswordStrength => {
        if (password.length < 8) return "weak";

        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length >= 12 && hasUpper && hasLower && hasNumber && hasSpecial) {
            return "very-strong";
        }
        if (hasUpper && hasLower && (hasNumber || hasSpecial)) {
            return "strong";
        }
        return "medium";
    };

    const getStrengthConfig = (strength: PasswordStrength) => {
        const configs = {
            "weak": { width: "25%", bg: "#2A1A1A", label: "Weak", color: "#8B4545" },
            "medium": { width: "50%", bg: "#2A2A1A", label: "Medium", color: "#8B8B45" },
            "strong": { width: "75%", bg: "#1A2A1A", label: "Strong", color: "#458B45" },
            "very-strong": { width: "100%", bg: "#FFFFFF", label: "Very Strong", color: "#FFFFFF" },
        };
        return configs[strength];
    };

    const passwordStrength = getPasswordStrength(newPassword);
    const strengthConfig = getStrengthConfig(passwordStrength);
    const passwordsMatch = confirmPassword && newPassword === confirmPassword;
    const passwordsDontMatch = confirmPassword && newPassword !== confirmPassword;

    const canSubmit =
        currentPassword &&
        newPassword &&
        confirmPassword &&
        passwordsMatch &&
        passwordStrength !== "weak" &&
        !loading;

    const handleSubmit = async () => {
        if (!canSubmit) return;

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to update password");
                setLoading(false);
                return;
            }

            // Success
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 1500);

        } catch (err) {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[1000] flex items-center justify-center"
                style={{
                    background: "rgba(0, 0, 0, 0.65)",
                    backdropFilter: "blur(4px)",
                    animation: "fadeIn 200ms ease-out",
                }}
                onClick={() => !loading && onClose()}
            >
                {/* Modal */}
                <div
                    className="bg-white border border-[#E5E5E5] rounded-2xl w-[420px] max-w-[90vw] px-8 pt-8 pb-7"
                    style={{
                        animation: "scaleIn 250ms ease-out",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Heading */}
                    <h2 className="text-[22px] font-milker text-black text-center mb-2">
                        Change Password
                    </h2>

                    {/* Description */}
                    <p className="text-[13px] text-[#6B6B6B] text-center mb-6">
                        Enter your current password and choose a new one
                    </p>

                    {/* Fields */}
                    <div className="space-y-3.5">
                        {/* Current Password */}
                        <div>
                            <label className="block text-[11px] uppercase text-[#6B6B6B] font-angelo mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    disabled={loading}
                                    placeholder="••••••••"
                                    className="w-full h-[44px] px-4 pr-12 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-black text-sm focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-black transition-colors"
                                >
                                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-[11px] uppercase text-[#6B6B6B] font-angelo mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading}
                                    placeholder="••••••••"
                                    className="w-full h-[44px] px-4 pr-12 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-black text-sm focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-black transition-colors"
                                >
                                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Strength Bar */}
                            {newPassword && (
                                <div className="mt-2">
                                    <div className="w-full h-[3px] bg-gray-50 rounded-[2px] overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-300"
                                            style={{
                                                width: strengthConfig.width,
                                                backgroundColor: strengthConfig.bg,
                                            }}
                                        />
                                    </div>
                                    <p
                                        className="text-[10px] font-angelo mt-1"
                                        style={{ color: strengthConfig.color }}
                                    >
                                        {strengthConfig.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-[11px] uppercase text-[#6B6B6B] font-angelo mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    placeholder="••••••••"
                                    className="w-full h-[44px] px-4 pr-12 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-black text-sm focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-black transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Match Indicator */}
                            {confirmPassword && newPassword && (
                                <div className="mt-2 flex items-center gap-1.5">
                                    {passwordsMatch ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" style={{ color: "#458B45" }} />
                                            <p className="text-[11px] font-angelo" style={{ color: "#458B45" }}>
                                                Passwords match
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-3.5 h-3.5" style={{ color: "#8B4545" }} />
                                            <p className="text-[11px] font-angelo" style={{ color: "#8B4545" }}>
                                                Passwords do not match
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div
                            className="mt-4 px-3.5 py-2.5 rounded-lg bg-[#2A1A1A] border border-[#3D1A1A]"
                        >
                            <p className="text-[13px] text-black">{error}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col gap-2.5 mt-6">
                        {/* Update Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className={`w-full h-[46px] rounded-[10px] font-angelo text-[15px] font-semibold transition-opacity flex items-center justify-center gap-2 ${canSubmit
                                    ? "bg-white text-black hover:opacity-85 cursor-pointer"
                                    : "bg-[#2A2A2A] text-[#6B6B6B] cursor-not-allowed"
                                }`}
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Updating..." : "Update Password"}
                        </button>

                        {/* Cancel Button */}
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="w-full h-[46px] bg-transparent text-black border border-white rounded-[10px] font-angelo text-[15px] font-semibold hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div
                    className="fixed top-6 right-6 z-[1001] bg-white border border-[#1A2A1A] px-5 py-3 rounded-lg shadow-lg"
                    style={{
                        animation: "slideInFromRight 300ms ease-out",
                    }}
                >
                    <p className="text-[13px] text-black">Password updated successfully</p>
                </div>
            )}

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

                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
}
