"use client";

import { RouteGuard } from "@/components/RouteGuard";
import { RecentProposals } from "@/components/RecentProposals";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BrandProposalsPage() {
    const { user } = useAuth();

    return (
        <RouteGuard allowedRole="brand">
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard/brand"
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span className="hidden md:inline">Back to Dashboard</span>
                                </Link>
                                <span className="text-xl font-bold text-[#1A1A1A]">My Proposals</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8F5D] flex items-center justify-center text-white font-semibold text-sm">
                                    {user?.fullName?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 md:px-6 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sent Proposals</h1>
                    <p className="text-gray-600 mb-8">Track all your collaboration proposals sent to creators</p>
                    <RecentProposals />
                </main>
            </div>
        </RouteGuard>
    );
}
