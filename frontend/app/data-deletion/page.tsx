"use client";

import { PolicyLayout } from "@/components/PolicyLayout";
import { Trash2, UserX, Mail, CheckCircle, AlertCircle, Clock } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10 last:mb-0">
            <div className="flex items-center gap-3 mb-4">
                <span className="block w-1 h-5 bg-[#FF4D00] rounded-full flex-shrink-0" />
                <h2 className="text-[11px] font-angelo text-[#FF4D00] uppercase tracking-[2px]">
                    {title}
                </h2>
            </div>
            <div className="pl-4">{children}</div>
        </section>
    );
}

export default function DataDeletion() {
    return (
        <PolicyLayout
            title="Data Deletion Instructions"
            lastUpdated="April 9, 2026"
            badge="Your Rights"
        >
            <div className="space-y-0">

                {/* Intro */}
                <Section title="Your Right to Delete">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        CreatorSync is committed to respecting your privacy and your right to be forgotten. You can request the deletion of your personal data — including any Instagram data accessed through Facebook Login — at any time using the methods below.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                {/* Method 1 */}
                <Section title="Method 1 — Delete from Dashboard (Recommended)">
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9] mb-6">
                        The fastest way to delete all your data is directly from your account settings:
                    </p>
                    <div className="space-y-4">
                        {[
                            { icon: <CheckCircle className="w-4 h-4 text-[#FF4D00]" />, step: "1", text: "Log in to your CreatorSync account" },
                            { icon: <CheckCircle className="w-4 h-4 text-[#FF4D00]" />, step: "2", text: "Go to Dashboard → Settings" },
                            { icon: <CheckCircle className="w-4 h-4 text-[#FF4D00]" />, step: "3", text: "Scroll down to the Danger Zone section" },
                            { icon: <CheckCircle className="w-4 h-4 text-[#FF4D00]" />, step: "4", text: 'Click "Delete Account" and confirm the action' },
                            { icon: <CheckCircle className="w-4 h-4 text-[#FF4D00]" />, step: "5", text: "Your account, profile, and all associated data will be permanently deleted immediately" },
                        ].map((item) => (
                            <div key={item.step} className="flex items-start gap-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-sm px-5 py-4">
                                <div className="flex-shrink-0 w-6 h-6 bg-[#FF4D00]/10 border border-[#FF4D00]/20 rounded-sm flex items-center justify-center">
                                    <span className="text-[10px] font-angelo text-[#FF4D00] font-bold">{item.step}</span>
                                </div>
                                <p className="text-[14px] text-[#8A8A8A] leading-[1.7]">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Visual note */}
                    <div className="mt-6 flex items-start gap-3 bg-[#FF4D00]/5 border border-[#FF4D00]/15 rounded-sm px-5 py-4">
                        <AlertCircle className="w-4 h-4 text-[#FF4D00] mt-0.5 flex-shrink-0" />
                        <p className="text-[13px] text-[#6B6B6B] leading-[1.8]">
                            <span className="text-white font-semibold">This is permanent.</span> Account deletion removes your user record, creator/brand profile, Instagram data, and all proposals or conversations associated with your account. This action cannot be undone.
                        </p>
                    </div>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                {/* Method 2 */}
                <Section title="Method 2 — Revoke via Facebook App Settings">
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9] mb-6">
                        If you connected via Instagram/Facebook Login, you can revoke our app's permissions directly through Meta — this triggers an automatic data deletion:
                    </p>
                    <div className="space-y-4">
                        {[
                            { step: "1", text: "Go to facebook.com/settings" },
                            { step: "2", text: 'Navigate to Security & Login → Apps and Websites' },
                            { step: "3", text: 'Find "CreatorSync" in the list of connected apps' },
                            { step: "4", text: 'Click "Remove" next to CreatorSync' },
                            { step: "5", text: "Meta will automatically send us a deletion request, and we will remove all your Instagram data from our servers within 30 days" },
                        ].map((item) => (
                            <div key={item.step} className="flex items-start gap-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-sm px-5 py-4">
                                <div className="flex-shrink-0 w-6 h-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-sm flex items-center justify-center">
                                    <span className="text-[10px] font-angelo text-[#6B6B6B] font-bold">{item.step}</span>
                                </div>
                                <p className="text-[14px] text-[#8A8A8A] leading-[1.7]">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                {/* Method 3 */}
                <Section title="Method 3 — Email Request">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9] mb-5">
                        You can also request data deletion by emailing us directly. We will process your request within <strong className="text-white">7 business days</strong> and send you a confirmation once completed.
                    </p>

                    <a
                        href="mailto:parrvcodes@gmail.com?subject=Data Deletion Request&body=Hello,%0A%0AI would like to request the deletion of all my personal data from CreatorSync.%0A%0AAccount email: [your email here]%0A%0AThank you."
                        className="inline-flex items-center gap-3 bg-[#FF4D00] text-white px-6 py-3 rounded-sm font-angelo uppercase tracking-widest text-[11px] hover:bg-[#e64400] transition-colors group"
                    >
                        <Mail className="w-4 h-4" />
                        Send Deletion Request Email
                    </a>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                {/* What gets deleted */}
                <Section title="What Gets Deleted">
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9] mb-4">
                        Upon account deletion, the following data is permanently removed from our systems:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { icon: <UserX className="w-4 h-4" />, label: "User account & credentials" },
                            { icon: <Trash2 className="w-4 h-4" />, label: "Creator or brand profile" },
                            { icon: <Trash2 className="w-4 h-4" />, label: "Instagram username & follower data" },
                            { icon: <Trash2 className="w-4 h-4" />, label: "Cached Instagram media posts" },
                            { icon: <Trash2 className="w-4 h-4" />, label: "All sent and received proposals" },
                            { icon: <Trash2 className="w-4 h-4" />, label: "Chat messages and conversations" },
                            { icon: <Trash2 className="w-4 h-4" />, label: "Stored access tokens" },
                            { icon: <Trash2 className="w-4 h-4" />, label: "Subscription and billing metadata" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-[#0D0D0D] border border-[#1F1F1F] rounded-sm px-4 py-3">
                                <span className="text-[#FF4D00]">{item.icon}</span>
                                <span className="text-[13px] text-[#8A8A8A]">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                {/* Timeline */}
                <Section title="Deletion Timeline">
                    <div className="space-y-4">
                        {[
                            { icon: <CheckCircle className="w-4 h-4 text-[#FF4D00]" />, time: "Immediate", text: "Account deletion from your dashboard takes effect instantly" },
                            { icon: <Clock className="w-4 h-4 text-[#6B6B6B]" />, time: "Within 30 days", text: "Data deleted via Facebook app revocation or email request" },
                            { icon: <Clock className="w-4 h-4 text-[#6B6B6B]" />, time: "Within 90 days", text: "Residual data in encrypted backups is purged during routine backup cycles" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-sm px-5 py-4">
                                <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                                <div>
                                    <p className="text-[11px] font-angelo text-[#FF4D00] uppercase tracking-widest mb-1">{item.time}</p>
                                    <p className="text-[14px] text-[#8A8A8A] leading-[1.7]">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                {/* Contact */}
                <Section title="Questions?">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        If you have any questions about data deletion or want to confirm your data has been removed, contact us at{" "}
                        <a href="mailto:parrvcodes@gmail.com" className="text-[#FF4D00] hover:underline">
                            parrvcodes@gmail.com
                        </a>
                        . We aim to respond within 3 business days.
                    </p>
                </Section>

            </div>
        </PolicyLayout>
    );
}
