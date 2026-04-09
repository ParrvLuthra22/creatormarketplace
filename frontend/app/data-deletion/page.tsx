"use client";

import { PolicyLayout } from "@/components/PolicyLayout";
import { Trash2, UserX, Mail, CheckCircle, AlertCircle, Clock } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ display: "block", width: "3px", height: "20px", background: "#FF4D00", borderRadius: "2px", flexShrink: 0 }} />
                <h2 style={{ fontSize: "10px", fontWeight: 800, color: "#FF4D00", textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>
                    {title}
                </h2>
            </div>
            <div style={{ paddingLeft: "15px" }}>{children}</div>
        </section>
    );
}

const divider = <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "32px 0" }} />;

function StepCard({ step, text, subdued = false }: { step: string; text: string; subdued?: boolean }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            background: subdued ? "rgba(0,0,0,0.02)" : "rgba(255,77,0,0.03)",
            border: `1px solid ${subdued ? "rgba(0,0,0,0.06)" : "rgba(255,77,0,0.12)"}`,
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "10px",
        }}>
            <div style={{
                flexShrink: 0,
                width: "24px",
                height: "24px",
                background: subdued ? "rgba(0,0,0,0.06)" : "rgba(255,77,0,0.1)",
                border: `1px solid ${subdued ? "rgba(0,0,0,0.1)" : "rgba(255,77,0,0.2)"}`,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: subdued ? "#71717a" : "#FF4D00" }}>{step}</span>
            </div>
            <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.8, margin: 0 }}>{text}</p>
        </div>
    );
}

export default function DataDeletion() {
    return (
        <PolicyLayout title="Data Deletion Instructions" lastUpdated="April 9, 2026" badge="Your Rights">

            <Section title="Your Right to Delete">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    CreatorSync is committed to respecting your privacy and your right to be forgotten. You can request the deletion of your personal data — including any Instagram data accessed through Facebook Login — at any time using the methods below.
                </p>
            </Section>

            {divider}

            <Section title="Method 1 — Delete from Dashboard (Recommended)">
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginBottom: "20px" }}>
                    The fastest way to delete all your data is directly from your account settings:
                </p>
                <StepCard step="1" text="Log in to your CreatorSync account" />
                <StepCard step="2" text="Go to Dashboard → Settings" />
                <StepCard step="3" text="Scroll down to the Danger Zone section" />
                <StepCard step="4" text='Click "Delete Account" and confirm the action' />
                <StepCard step="5" text="Your account, profile, and all associated data will be permanently deleted immediately" />

                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    background: "rgba(255,77,0,0.05)",
                    border: "1px solid rgba(255,77,0,0.15)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginTop: "20px",
                }}>
                    <AlertCircle style={{ width: "16px", height: "16px", color: "#FF4D00", marginTop: "2px", flexShrink: 0 }} />
                    <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.8, margin: 0 }}>
                        <strong style={{ color: "#18181b" }}>This is permanent.</strong> Account deletion removes your user record, creator/brand profile, Instagram data, and all proposals or conversations associated with your account. This action cannot be undone.
                    </p>
                </div>
            </Section>

            {divider}

            <Section title="Method 2 — Revoke via Facebook App Settings">
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginBottom: "20px" }}>
                    If you connected via Instagram/Facebook Login, you can revoke our app&apos;s permissions directly through Meta — this triggers an automatic data deletion:
                </p>
                <StepCard step="1" text="Go to facebook.com/settings" subdued />
                <StepCard step="2" text="Navigate to Security & Login → Apps and Websites" subdued />
                <StepCard step="3" text='Find "CreatorSync" in the list of connected apps' subdued />
                <StepCard step="4" text='Click "Remove" next to CreatorSync' subdued />
                <StepCard step="5" text="Meta will automatically send us a deletion request and we will remove all your Instagram data within 30 days" subdued />
            </Section>

            {divider}

            <Section title="Method 3 — Email Request">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9, marginBottom: "24px" }}>
                    You can also request data deletion by emailing us directly. We will process your request within <strong style={{ color: "#18181b" }}>7 business days</strong> and send you a confirmation once completed.
                </p>
                <a
                    href="mailto:parrvcodes@gmail.com?subject=Data Deletion Request&body=Hello,%0A%0AI would like to request the deletion of all my personal data from CreatorSync.%0A%0AAccount email: [your email here]%0A%0AThank you."
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "#FF4D00",
                        color: "#FFFFFF",
                        padding: "16px 36px",
                        borderRadius: "50px",
                        fontWeight: 800,
                        fontSize: "15px",
                        textDecoration: "none",
                        letterSpacing: "-0.01em",
                    }}
                >
                    <Mail style={{ width: "16px", height: "16px" }} />
                    Send Deletion Request Email
                </a>
            </Section>

            {divider}

            <Section title="What Gets Deleted">
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginBottom: "20px" }}>
                    Upon account deletion, the following data is permanently removed from our systems:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                    {[
                        { icon: <UserX style={{ width: "14px", height: "14px" }} />, label: "User account & credentials" },
                        { icon: <Trash2 style={{ width: "14px", height: "14px" }} />, label: "Creator or brand profile" },
                        { icon: <Trash2 style={{ width: "14px", height: "14px" }} />, label: "Instagram username & follower data" },
                        { icon: <Trash2 style={{ width: "14px", height: "14px" }} />, label: "Cached Instagram media posts" },
                        { icon: <Trash2 style={{ width: "14px", height: "14px" }} />, label: "All sent and received proposals" },
                        { icon: <Trash2 style={{ width: "14px", height: "14px" }} />, label: "Chat messages and conversations" },
                        { icon: <Trash2 style={{ width: "14px", height: "14px" }} />, label: "Stored access tokens" },
                        { icon: <Trash2 style={{ width: "14px", height: "14px" }} />, label: "Subscription and billing metadata" },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "rgba(0,0,0,0.02)",
                            border: "1px solid rgba(0,0,0,0.06)",
                            borderRadius: "10px",
                            padding: "12px 16px",
                        }}>
                            <span style={{ color: "#FF4D00" }}>{item.icon}</span>
                            <span style={{ fontSize: "13px", color: "#52525b" }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </Section>

            {divider}

            <Section title="Deletion Timeline">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                        { icon: <CheckCircle style={{ width: "15px", height: "15px", color: "#FF4D00" }} />, time: "Immediate", text: "Account deletion from your dashboard takes effect instantly" },
                        { icon: <Clock style={{ width: "15px", height: "15px", color: "#a1a1aa" }} />, time: "Within 30 days", text: "Data deleted via Facebook app revocation or email request" },
                        { icon: <Clock style={{ width: "15px", height: "15px", color: "#a1a1aa" }} />, time: "Within 90 days", text: "Residual data in encrypted backups is purged during routine backup cycles" },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "16px",
                            background: "rgba(0,0,0,0.02)",
                            border: "1px solid rgba(0,0,0,0.06)",
                            borderRadius: "12px",
                            padding: "16px 20px",
                        }}>
                            <div style={{ flexShrink: 0, marginTop: "2px" }}>{item.icon}</div>
                            <div>
                                <p style={{ fontSize: "10px", fontWeight: 800, color: "#FF4D00", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px 0" }}>{item.time}</p>
                                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.8, margin: 0 }}>{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {divider}

            <Section title="Questions?">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    If you have any questions about data deletion or want to confirm your data has been removed, contact us at{" "}
                    <a href="mailto:parrvcodes@gmail.com" style={{ color: "#FF4D00", textDecoration: "none" }}>parrvcodes@gmail.com</a>.
                    {" "}We aim to respond within 3 business days.
                </p>
            </Section>

        </PolicyLayout>
    );
}
