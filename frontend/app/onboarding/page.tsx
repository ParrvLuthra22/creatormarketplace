"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Briefcase, Star, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
    const { user, refreshProfile } = useAuth();
    const router = useRouter();
    const [selected, setSelected] = useState<"Brand" | "Creator" | null>(null);
    const [instagramHandle, setInstagramHandle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // If user somehow lands here already onboarded, redirect
    if (user?.accountType && user.accountType !== "Creator") {
        router.push("/dashboard/brand");
        return null;
    }

    const handleContinue = async () => {
        if (!selected) return;
        if (selected === "Creator" && !instagramHandle.trim()) {
            setError("Instagram handle is required for creators.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const res = await fetch(`${apiBase}/api/auth/onboarding`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    accountType: selected,
                    instagramHandle: selected === "Creator" ? instagramHandle.replace(/^@+/, "") : undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Something went wrong. Please try again.");
                return;
            }

            await refreshProfile();

            if (selected === "Brand") {
                router.push("/dashboard/brand");
            } else {
                router.push("/dashboard/creator");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            {/* Header */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-[#FF4D00] rounded-md" />
                    <span className="text-xl font-bold text-zinc-900 tracking-tight">CreatorSync</span>
                </div>
                <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-3 lowercase">
                    one quick thing
                </h1>
                <p className="text-zinc-500 text-lg lowercase">
                    are you joining as a brand or a creator?
                </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl mb-8">
                {/* Brand */}
                <button
                    onClick={() => setSelected("Brand")}
                    className={`group relative p-8 rounded-md border-2 text-left transition-all duration-200 ${
                        selected === "Brand"
                            ? "border-[#FF4D00] bg-orange-50 shadow-lg shadow-orange-500/10"
                            : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
                    }`}
                >
                    <div className={`w-14 h-14 rounded-md flex items-center justify-center mb-5 transition-colors ${
                        selected === "Brand" ? "bg-[#FF4D00]" : "bg-zinc-100 group-hover:bg-zinc-200"
                    }`}>
                        <Briefcase className={`w-7 h-7 ${selected === "Brand" ? "text-white" : "text-zinc-600"}`} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2 lowercase">i&apos;m a brand</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed lowercase">
                        i want to discover creators and run influencer campaigns.
                    </p>
                    {selected === "Brand" && (
                        <div className="absolute top-5 right-5 w-6 h-6 bg-[#FF4D00] rounded-full flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </button>

                {/* Creator */}
                <button
                    onClick={() => setSelected("Creator")}
                    className={`group relative p-8 rounded-md border-2 text-left transition-all duration-200 ${
                        selected === "Creator"
                            ? "border-[#FF4D00] bg-orange-50 shadow-lg shadow-orange-500/10"
                            : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
                    }`}
                >
                    <div className={`w-14 h-14 rounded-md flex items-center justify-center mb-5 transition-colors ${
                        selected === "Creator" ? "bg-[#FF4D00]" : "bg-zinc-100 group-hover:bg-zinc-200"
                    }`}>
                        <Star className={`w-7 h-7 ${selected === "Creator" ? "text-white" : "text-zinc-600"}`} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2 lowercase">i&apos;m a creator</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed lowercase">
                        i create content and want to work with brands on campaigns.
                    </p>
                    {selected === "Creator" && (
                        <div className="absolute top-5 right-5 w-6 h-6 bg-[#FF4D00] rounded-full flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </button>
            </div>

            {/* Instagram handle — only for creators */}
            {selected === "Creator" && (
                <div className="w-full max-w-2xl mb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                        Your Instagram Handle
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold">@</span>
                        <input
                            type="text"
                            value={instagramHandle}
                            onChange={(e) => setInstagramHandle(e.target.value)}
                            placeholder="yourhandle"
                            className="w-full h-12 pl-9 pr-4 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-[#FF4D00] transition-colors"
                        />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2">
                        This is your public Instagram username — used to display your profile to brands.
                    </p>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 mb-4">{error}</p>
            )}

            {/* CTA Button */}
            <button
                onClick={handleContinue}
                disabled={!selected || loading}
                className="flex items-center gap-2 h-13 px-8 bg-[#FF4D00] text-white font-bold rounded-md hover:bg-[#ff5e1a] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <span className="lowercase">continue to dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>

            <p className="text-xs text-zinc-400 mt-6 text-center lowercase">
                you can change this later from your settings.
            </p>
        </div>
    );
}
