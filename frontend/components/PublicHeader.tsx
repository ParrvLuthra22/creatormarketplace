"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function PublicHeader() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleDashboardClick = () => {
        if (user) {
            const dashboardPath = user.accountType === 'Brand' ? '/dashboard/brand' : '/dashboard/creator';
            router.push(dashboardPath);
        }
    };

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
                style={{
                    height: "100px",
                    padding: "0 80px",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(30px)",
                    WebkitBackdropFilter: "blur(30px)",
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        fontSize: "32px",
                        fontWeight: 950,
                        color: "#18181b",
                        letterSpacing: "-0.04em",
                        textDecoration: "none",
                        fontFamily: "inherit",
                    }}
                >
                    CreatorSync
                </Link>

                {/* Nav Links */}
                <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>


                    {user ? (
                        <>
                            <button
                                onClick={handleDashboardClick}
                                style={{
                                    fontSize: "16px",
                                    color: "#18181b",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    padding: 0,
                                }}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={logout}
                                style={{
                                    padding: "12px 28px",
                                    background: "#FF4D00",
                                    color: "#FFFFFF",
                                    borderRadius: "50px",
                                    fontSize: "15px",
                                    fontWeight: 800,
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
                                style={{
                                    fontSize: "16px",
                                    color: "#18181b",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    padding: 0,
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setAuthTab('signup'); setShowAuthModal(true); }}
                                style={{
                                    padding: "16px 36px",
                                    background: "#FF4D00",
                                    color: "#FFFFFF",
                                    borderRadius: "50px",
                                    fontSize: "16px",
                                    fontWeight: 800,
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </header>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialTab={authTab}
            />
        </>
    );
}
