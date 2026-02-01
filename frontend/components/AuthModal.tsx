"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button } from "./ui/Button";
import { X, Eye, EyeOff, Briefcase, Star, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
    const { login, signup } = useAuth();

    // Sync with initialTab when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    // Signup step state (1: account type selection, 2: form)
    const [signupStep, setSignupStep] = useState(1);

    // Login form state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Signup form state
    const [signupFullName, setSignupFullName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [accountType, setAccountType] = useState<"Brand" | "Creator" | null>(null);
    const [instagramHandle, setInstagramHandle] = useState("");
    const [companyName, setCompanyName] = useState("");

    // Validation errors
    const [loginEmailError, setLoginEmailError] = useState("");
    const [signupNameError, setSignupNameError] = useState("");
    const [signupEmailError, setSignupEmailError] = useState("");
    const [signupPasswordError, setSignupPasswordError] = useState("");
    const [instagramHandleError, setInstagramHandleError] = useState("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // ESC key handler
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }

        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, loading]);

    const resetForms = () => {
        setLoginEmail("");
        setLoginPassword("");
        setSignupFullName("");
        setSignupEmail("");
        setSignupPassword("");
        setAccountType(null);
        setInstagramHandle("");
        setCompanyName("");
        setSignupStep(1);
        setError(null);
        setSuccessMessage(null);
        setLoginEmailError("");
        setSignupNameError("");
        setSignupEmailError("");
        setSignupPasswordError("");
        setInstagramHandleError("");
        setShowLoginPassword(false);
        setShowSignupPassword(false);
    };

    const handleClose = () => {
        if (!loading) {
            resetForms();
            onClose();
        }
    };

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) return "Password must be at least 8 characters";
        if (!/\d/.test(password)) return "Password must contain at least 1 number";
        return null;
    };

    const validateFullName = (name: string): string | null => {
        if (name.trim().length < 2) return "Name must be at least 2 characters";
        return null;
    };

    // Blur handlers for real-time validation
    const handleLoginEmailBlur = () => {
        if (loginEmail && !validateEmail(loginEmail)) {
            setLoginEmailError("Please enter a valid email address");
        } else {
            setLoginEmailError("");
        }
    };

    const handleSignupNameBlur = () => {
        const error = validateFullName(signupFullName);
        setSignupNameError(error || "");
    };

    const handleSignupEmailBlur = () => {
        if (signupEmail && !validateEmail(signupEmail)) {
            setSignupEmailError("Please enter a valid email address");
        } else {
            setSignupEmailError("");
        }
    };

    const handleSignupPasswordBlur = () => {
        const error = validatePassword(signupPassword);
        setSignupPasswordError(error || "");
    };

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validate
        if (!validateEmail(loginEmail)) {
            setLoginEmailError("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            await login({ email: loginEmail, password: loginPassword });
            setSuccessMessage("Login successful!");
            setTimeout(() => {
                handleClose();
            }, 1000);
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validate all fields
        const nameError = validateFullName(signupFullName);
        const emailValid = validateEmail(signupEmail);
        const passwordError = validatePassword(signupPassword);

        if (nameError) {
            setSignupNameError(nameError);
            return;
        }
        if (!emailValid) {
            setSignupEmailError("Please enter a valid email address");
            return;
        }
        if (passwordError) {
            setSignupPasswordError(passwordError);
            return;
        }
        if (accountType === "Creator" && !instagramHandle.trim()) {
            setInstagramHandleError("Instagram handle is required for creators");
            return;
        }

        setLoading(true);

        try {
            await signup({
                fullName: signupFullName,
                email: signupEmail,
                password: signupPassword,
                accountType: accountType!,
                ...(accountType === "Creator" && { instagramHandle }),
            });
            setSuccessMessage(`${accountType} account created successfully!`);
            setTimeout(() => {
                handleClose();
            }, 1000);
        } catch (err: any) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative bg-[#141414] border border-[#1F1F1F] rounded-3xl w-full max-w-md shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    disabled={loading}
                    className="absolute top-4 right-4 text-[#6B6B6B] hover:text-white p-2 rounded-full hover:bg-[#1F1F1F] transition-colors disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2 font-milker">
                        {activeTab === "login" ? "Welcome Back" : signupStep === 1 ? "What are you?" : "Create Account"}
                    </h2>
                    <p className="text-[#6B6B6B]">
                        {activeTab === "login"
                            ? "Sign in to access your dashboard"
                            : signupStep === 1
                                ? "Choose how you want to use CreatorSync"
                                : accountType === "Brand"
                                    ? "Join as a brand to discover creators"
                                    : "Join as a creator to get discovered"}
                    </p>
                </div>

                {/* Tabs */}
                <div className="relative flex p-1 bg-[#0F0F0F] rounded-full mb-8">
                    <button
                        onClick={() => {
                            setActiveTab("login");
                            setError(null);
                            setSuccessMessage(null);
                        }}
                        disabled={loading}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all relative z-10 font-angelo ${activeTab === "login"
                            ? "text-black"
                            : "text-[#6B6B6B] hover:text-white"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("signup");
                            setSignupStep(1);
                            setAccountType(null);
                            setError(null);
                            setSuccessMessage(null);
                        }}
                        disabled={loading}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all relative z-10 font-angelo ${activeTab === "signup"
                            ? "text-black"
                            : "text-[#6B6B6B] hover:text-white"
                            }`}
                    >
                        Create Account
                    </button>
                    {/* Animated background */}
                    <div
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white shadow-sm rounded-full transition-transform duration-300 ease-out ${activeTab === "signup" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
                            }`}
                    />
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-600/10 border border-red-600/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-600/10 border border-green-600/20 rounded-xl text-green-400 text-sm">
                        {successMessage}
                    </div>
                )}

                {/* Login Form */}
                {activeTab === "login" && (
                    <form className="space-y-4" onSubmit={handleLoginSubmit}>
                        <div>
                            <input
                                type="email"
                                placeholder="Email address"
                                value={loginEmail}
                                onChange={(e) => {
                                    setLoginEmail(e.target.value);
                                    setLoginEmailError("");
                                }}
                                onBlur={handleLoginEmailBlur}
                                required
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border ${loginEmailError ? "border-red-600/50" : "border-[#2A2A2A]"
                                    } focus:outline-none focus:border-white transition-all bg-[#0F0F0F] text-white placeholder-[#6B6B6B] disabled:opacity-50`}
                            />
                            {loginEmailError && (
                                <p className="mt-1 text-xs text-red-400">{loginEmailError}</p>
                            )}
                        </div>
                        <div>
                            <div className="relative">
                                <input
                                    type={showLoginPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-[#2A2A2A] focus:outline-none focus:border-white transition-all bg-[#0F0F0F] text-white placeholder-[#6B6B6B] disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-white transition-colors"
                                >
                                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-[#E5E5E5] py-6 text-lg mt-4 font-angelo"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>

                        <p className="text-center text-sm text-[#6B6B6B] mt-4">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab("signup");
                                    setSignupStep(1);
                                }}
                                className="text-white hover:text-[#E5E5E5] font-semibold transition-colors font-angelo"
                            >
                                Create account
                            </button>
                        </p>
                    </form>
                )}

                {/* Signup Form - Step 1: Role Selection */}
                {activeTab === "signup" && signupStep === 1 && (
                    <div className="space-y-4">
                        {/* Brand Card */}
                        <button
                            onClick={() => setAccountType("Brand")}
                            disabled={loading}
                            className={`w-full p-6 border rounded-2xl transition-all text-left disabled:opacity-50 ${accountType === "Brand"
                                ? "border-white bg-[#1A1A1A]"
                                : "border-[#2A2A2A] hover:border-[#6B6B6B] hover:bg-[#1A1A1A]/50"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#1F1F1F] flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1 font-angelo">Brand</h3>
                                    <p className="text-sm text-[#6B6B6B]">Discover & hire creators</p>
                                </div>
                            </div>
                        </button>

                        {/* Creator Card */}
                        <button
                            onClick={() => setAccountType("Creator")}
                            disabled={loading}
                            className={`w-full p-6 border rounded-2xl transition-all text-left disabled:opacity-50 ${accountType === "Creator"
                                ? "border-white bg-[#1A1A1A]"
                                : "border-[#2A2A2A] hover:border-[#6B6B6B] hover:bg-[#1A1A1A]/50"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#1F1F1F] flex items-center justify-center">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1 font-angelo">Creator</h3>
                                    <p className="text-sm text-[#6B6B6B]">Get discovered by brands</p>
                                </div>
                            </div>
                        </button>

                        {/* Continue Button */}
                        {accountType && (
                            <Button
                                onClick={() => setSignupStep(2)}
                                className="w-full bg-white text-black hover:bg-[#E5E5E5] py-6 text-lg mt-2 font-angelo flex items-center justify-center gap-2"
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Signup Form - Step 2: Account Details */}
                {activeTab === "signup" && signupStep === 2 && accountType && (
                    <form className="space-y-4" onSubmit={handleSignupSubmit}>
                        {/* Back button */}
                        <button
                            type="button"
                            onClick={() => setSignupStep(1)}
                            className="text-sm text-[#6B6B6B] hover:text-white mb-2 font-angelo flex items-center gap-1"
                        >
                            ← Back
                        </button>

                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={signupFullName}
                                onChange={(e) => {
                                    setSignupFullName(e.target.value);
                                    setSignupNameError("");
                                }}
                                onBlur={handleSignupNameBlur}
                                required
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border ${signupNameError ? "border-red-600/50" : "border-[#2A2A2A]"
                                    } focus:outline-none focus:border-white transition-all bg-[#0F0F0F] text-white placeholder-[#6B6B6B] disabled:opacity-50`}
                            />
                            {signupNameError && (
                                <p className="mt-1 text-xs text-red-400">{signupNameError}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email address"
                                value={signupEmail}
                                onChange={(e) => {
                                    setSignupEmail(e.target.value);
                                    setSignupEmailError("");
                                }}
                                onBlur={handleSignupEmailBlur}
                                required
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border ${signupEmailError ? "border-red-600/50" : "border-[#2A2A2A]"
                                    } focus:outline-none focus:border-white transition-all bg-[#0F0F0F] text-white placeholder-[#6B6B6B] disabled:opacity-50`}
                            />
                            {signupEmailError && (
                                <p className="mt-1 text-xs text-red-400">{signupEmailError}</p>
                            )}
                        </div>

                        {/* Brand-specific field */}
                        {accountType === "Brand" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Company Name (optional)"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border border-[#2A2A2A] focus:outline-none focus:border-white transition-all bg-[#0F0F0F] text-white placeholder-[#6B6B6B] disabled:opacity-50"
                                />
                            </div>
                        )}

                        {/* Creator-specific field */}
                        {accountType === "Creator" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Instagram Handle (required)"
                                    value={instagramHandle}
                                    onChange={(e) => {
                                        setInstagramHandle(e.target.value);
                                        setInstagramHandleError("");
                                    }}
                                    required
                                    disabled={loading}
                                    className={`w-full px-4 py-3 rounded-xl border ${instagramHandleError ? "border-red-600/50" : "border-[#2A2A2A]"
                                        } focus:outline-none focus:border-white transition-all bg-[#0F0F0F] text-white placeholder-[#6B6B6B] disabled:opacity-50`}
                                />
                                {instagramHandleError && (
                                    <p className="mt-1 text-xs text-red-400">{instagramHandleError}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <div className="relative">
                                <input
                                    type={showSignupPassword ? "text" : "password"}
                                    placeholder="Password (min 8 chars, 1 number)"
                                    value={signupPassword}
                                    onChange={(e) => {
                                        setSignupPassword(e.target.value);
                                        setSignupPasswordError("");
                                    }}
                                    onBlur={handleSignupPasswordBlur}
                                    required
                                    minLength={8}
                                    disabled={loading}
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border ${signupPasswordError ? "border-red-600/50" : "border-[#2A2A2A]"
                                        } focus:outline-none focus:border-white transition-all bg-[#0F0F0F] text-white placeholder-[#6B6B6B] disabled:opacity-50`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-white transition-colors"
                                >
                                    {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {signupPasswordError && (
                                <p className="mt-1 text-xs text-red-400">{signupPasswordError}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-[#E5E5E5] py-6 text-lg mt-4 font-angelo"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : `Create ${accountType} Account`}
                        </Button>

                        <p className="text-center text-sm text-[#6B6B6B] mt-4">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab("login");
                                    setSignupStep(1);
                                }}
                                className="text-white hover:text-[#E5E5E5] font-semibold transition-colors font-angelo"
                            >
                                Sign in →
                            </button>
                        </p>
                    </form>
                )}

                <p className="text-center text-xs text-[#3D3D3D] mt-6">
                    By continuing, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    );
}
