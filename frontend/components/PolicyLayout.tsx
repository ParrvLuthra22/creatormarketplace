"use client";

import { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";
import Footer from './Footer';
import Link from "next/link";

interface PolicyLayoutProps {
    title: string;
    lastUpdated: string;
    children: ReactNode;
    badge?: string;
}

export function PolicyLayout({ title, lastUpdated, children, badge }: PolicyLayoutProps) {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#FFFFFF",
                backgroundImage:
                    "radial-gradient(at 0% 0%, rgba(255,0,150,0.04) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255,77,0,0.04) 0px, transparent 50%)",
                color: "#18181b",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
        >
            <PublicHeader />

            {/* Hero Header — matches landing page spacing (nav is 100px tall) */}
            <div
                style={{
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    paddingTop: "160px",
                    paddingBottom: "48px",
                    paddingLeft: "80px",
                    paddingRight: "80px",
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}
            >
                {badge && (
                    <span
                        style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            background: "rgba(255,77,0,0.08)",
                            border: "1px solid rgba(255,77,0,0.2)",
                            color: "#FF4D00",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            borderRadius: "4px",
                            marginBottom: "20px",
                        }}
                    >
                        {badge}
                    </span>
                )}
                <h1
                    style={{
                        fontSize: "clamp(36px, 4vw, 64px)",
                        fontWeight: 950,
                        color: "#000000",
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                        marginBottom: "12px",
                    }}
                >
                    {title}
                </h1>
                <p
                    style={{
                        fontSize: "13px",
                        color: "#a1a1aa",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                    }}
                >
                    Last updated: {lastUpdated}
                </p>
            </div>

            {/* Content */}
            <main
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "48px 80px 80px",
                }}
            >
                {/* Orange accent rule */}
                <div
                    style={{
                        height: "2px",
                        background: "linear-gradient(to right, #FF4D00 0%, rgba(255,77,0,0.1) 40%, transparent 80%)",
                        marginBottom: "40px",
                        borderRadius: "2px",
                    }}
                />

                {/* Card */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.8)",
                        border: "1px solid rgba(0,0,0,0.07)",
                        borderRadius: "24px",
                        boxShadow: "0 8px 64px rgba(0,0,0,0.05)",
                        backdropFilter: "blur(20px)",
                        padding: "56px 64px",
                    }}
                >
                    {children}
                </div>

                {/* Back link */}
                <div style={{ marginTop: "36px", display: "flex", alignItems: "center", gap: "16px" }}>
                    <Link
                        href="/"
                        style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#a1a1aa",
                            textDecoration: "none",
                            transition: "color 150ms",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#FF4D00")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#a1a1aa")}
                    >
                        ← Back to Home
                    </Link>
                    <span style={{ color: "#e4e4e7" }}>·</span>
                    <a
                        href="mailto:parrvcodes@gmail.com"
                        style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#a1a1aa",
                            textDecoration: "none",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#FF4D00")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#a1a1aa")}
                    >
                        Contact Us
                    </a>
                </div>
            </main>

        </div>
    );
}
