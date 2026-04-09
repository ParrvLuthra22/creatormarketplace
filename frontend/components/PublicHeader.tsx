"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "./AuthModal";

export function PublicHeader() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

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
                    <Link
                        href="/pricing"
                        style={{
                            fontSize: "16px",
                            color: "#18181b",
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        Pricing
                    </Link>
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
