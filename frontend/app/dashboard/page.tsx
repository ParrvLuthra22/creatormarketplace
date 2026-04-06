"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { User, BarChart3, Settings, MessageSquare, CreditCard, Bell } from "lucide-react";

/**
 * Dashboard Page (Placeholder)
 * 
 * Protected route - only accessible to authenticated users.
 * Shows placeholder dashboard with sidebar navigation.
 */

function DashboardContent() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header
                user={user}
                onLoginClick={() => { }}
                onSignupClick={() => { }}
                onLogoutClick={handleLogout}
            />

            <div className="pt-20 flex">
                {/* Sidebar */}
                <aside className="w-64 bg-[#FF4D00] border-r border-gray-200 min-h-[calc(100vh-80px)] p-4 hidden md:block">
                    <nav className="space-y-2">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-sm bg-orange-50 text-[#FF6B35] font-medium">
                            <BarChart3 className="w-5 h-5" />
                            Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-sm text-gray-600 hover:bg-gray-50">
                            <User className="w-5 h-5" />
                            My Profile
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-sm text-gray-600 hover:bg-gray-50">
                            <MessageSquare className="w-5 h-5" />
                            Messages
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-sm text-gray-600 hover:bg-gray-50">
                            <CreditCard className="w-5 h-5" />
                            Billing
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-sm text-gray-600 hover:bg-gray-50">
                            <Bell className="w-5 h-5" />
                            Notifications
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-sm text-gray-600 hover:bg-gray-50">
                            <Settings className="w-5 h-5" />
                            Settings
                        </a>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-4xl">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome back, {user?.fullName}!
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Here&apos;s what&apos;s happening with your account today.
                        </p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-[#FF4D00] rounded-md p-6 border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">Total Views</p>
                                <p className="text-3xl font-bold text-gray-900">12.5K</p>
                                <p className="text-sm text-green-500 mt-2">+12% from last month</p>
                            </div>
                            <div className="bg-[#FF4D00] rounded-md p-6 border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">Active Campaigns</p>
                                <p className="text-3xl font-bold text-gray-900">3</p>
                                <p className="text-sm text-gray-500 mt-2">2 pending approval</p>
                            </div>
                            <div className="bg-[#FF4D00] rounded-md p-6 border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">Earnings</p>
                                <p className="text-3xl font-bold text-gray-900">₹45,000</p>
                                <p className="text-sm text-green-500 mt-2">+8% from last month</p>
                            </div>
                        </div>

                        {/* Placeholder Content */}
                        <div className="bg-[#FF4D00] rounded-md p-8 border border-gray-100 shadow-sm">
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BarChart3 className="w-8 h-8 text-[#FF6B35]" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Dashboard Coming Soon
                                </h2>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    We&apos;re building amazing features for your dashboard.
                                    Stay tuned for analytics, campaign management, and more!
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
