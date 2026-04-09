"use client";

import { PolicyLayout } from "@/components/PolicyLayout";

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

export default function PrivacyPolicy() {
    return (
        <PolicyLayout title="Privacy Policy" lastUpdated="April 9, 2026" badge="Legal">
            <div className="space-y-0">
                <Section title="Overview">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        At CreatorSync, your privacy is fundamental to everything we build. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you use our platform — whether you&apos;re a brand discovering creators or a creator building your portfolio.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Information We Collect">
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9] mb-4">
                        We collect the following types of information to operate and improve CreatorSync:
                    </p>
                    <ul className="space-y-3">
                        {[
                            "Name, email address, and account credentials",
                            "Creator or brand profile information (bio, handles, company details)",
                            "Instagram profile data (username, follower count, media) — only when you authenticate with Instagram",
                            "Payment metadata processed by our third-party payment gateway (we do not store card numbers)",
                            "Usage data, including pages visited and features used, to improve the platform",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 block w-1.5 h-1.5 bg-[#FF4D00] rounded-full flex-shrink-0" />
                                <span className="text-[14px] text-[#8A8A8A] leading-[1.9]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Use of Information">
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9] mb-4">
                        Your data is used exclusively to:
                    </p>
                    <ul className="space-y-3">
                        {[
                            "Operate, maintain, and improve the CreatorSync platform",
                            "Facilitate collaborations between brands and creators",
                            "Send service-related communications (new proposals, account alerts)",
                            "Display your profile and Instagram statistics to relevant brands (with your consent)",
                            "Comply with applicable laws and platform policies, including Meta's requirements",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 block w-1.5 h-1.5 bg-[#FF4D00] rounded-full flex-shrink-0" />
                                <span className="text-[14px] text-[#8A8A8A] leading-[1.9]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Data Sharing">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        We do not sell, rent, or trade your personal data. Information may be shared with trusted third-party service providers (such as payment processors and cloud infrastructure) strictly to operate the platform. These providers are contractually bound to keep data confidential.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Instagram & Facebook Data">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9] mb-4">
                        When you connect your Instagram account via Facebook Login, we access your public profile data (username, bio, follower count, and recent posts) to populate your creator profile. This data is:
                    </p>
                    <ul className="space-y-3">
                        {[
                            "Stored securely in our database and only shown to brands you choose to engage with",
                            "Never shared with third parties beyond platform operation",
                            "Deletable at any time — see our Data Deletion Instructions",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 block w-1.5 h-1.5 bg-[#FF4D00] rounded-full flex-shrink-0" />
                                <span className="text-[14px] text-[#8A8A8A] leading-[1.9]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Data Security">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        We implement industry-standard security measures including HTTPS encryption, secure cookie handling, bcrypt password hashing, and rate-limited authentication endpoints. While no system is 100% secure, we continuously work to protect your data.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Your Rights">
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9] mb-4">
                        You have the right to:
                    </p>
                    <ul className="space-y-3 mb-4">
                        {[
                            "Access the personal data we hold about you",
                            "Correct inaccurate information in your profile",
                            "Delete your account and all associated data at any time from Settings",
                            "Revoke Instagram/Facebook access and request deletion of that data",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 block w-1.5 h-1.5 bg-[#FF4D00] rounded-full flex-shrink-0" />
                                <span className="text-[14px] text-[#8A8A8A] leading-[1.9]">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9]">
                        To exercise any of these rights, contact us at{" "}
                        <a href="mailto:parrvcodes@gmail.com" className="text-[#FF4D00] hover:underline">
                            parrvcodes@gmail.com
                        </a>
                        .
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Contact">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        For any privacy-related questions or concerns, reach us at{" "}
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
