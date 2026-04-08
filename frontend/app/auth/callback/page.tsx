"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshProfile, user } = useAuth();

    const isNew = searchParams.get("new") === "1";
    const error = searchParams.get("error");

    useEffect(() => {
        // If backend reported an error, redirect home
        if (error) {
            router.push(`/?error=${error}`);
            return;
        }

        // Refresh frontend state from the newly set cookie
        const handleCallback = async () => {
            try {
                await refreshProfile();
            } catch (err) {
                console.error("Auth callback refresh error:", err);
                router.push("/?error=auth_failed");
            }
        };

        handleCallback();
    }, [refreshProfile, router, error]);

    // Once user is loaded, route them
    useEffect(() => {
        if (!user) return;

        if (isNew) {
            // New OAuth user — must choose their role
            router.push("/onboarding");
        } else if (user.accountType === "Brand") {
            router.push("/dashboard/brand");
        } else if (user.accountType === "Creator") {
            router.push("/dashboard/creator");
        } else {
            // Unknown state — send to onboarding to be safe
            router.push("/onboarding");
        }
    }, [user, isNew, router]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm text-center">
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#FF4D00] animate-spin" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight lowercase mb-3">
                    syncing your account...
                </h1>
                <p className="text-zinc-500 font-medium lowercase">
                    almost there. we&apos;re setting up your workspace.
                </p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#FF4D00] animate-spin" />
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
