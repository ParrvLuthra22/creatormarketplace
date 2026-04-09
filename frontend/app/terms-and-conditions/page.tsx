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

export default function TermsAndConditions() {
    return (
        <PolicyLayout title="Terms & Conditions" lastUpdated="April 9, 2026" badge="Legal">
            <div className="space-y-0">
                <Section title="Agreement to Terms">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        Welcome to CreatorSync. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the platform.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Nature of Service">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        CreatorSync is a digital SaaS platform that enables brands to discover, evaluate, and collaborate with social media creators. We provide the technology and tools — we are not a marketing agency, talent agency, or campaign manager. All collaborations are negotiated directly between brands and creators.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="User Eligibility">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        You must be at least 18 years old to create an account and use CreatorSync. By registering, you confirm that all information you provide is accurate and that you have the authority to enter into these Terms on behalf of yourself or your organization.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Account Responsibilities">
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9] mb-4">
                        As a registered user, you are responsible for:
                    </p>
                    <ul className="space-y-3">
                        {[
                            "Maintaining the confidentiality of your account credentials",
                            "All activity that occurs under your account",
                            "Keeping your profile information accurate and up to date",
                            "Notifying us immediately of any unauthorized use of your account",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 block w-1.5 h-1.5 bg-[#FF4D00] rounded-full flex-shrink-0" />
                                <span className="text-[14px] text-[#8A8A8A] leading-[1.9]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Payments & Subscriptions">
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9] mb-4">
                        Payments made on the platform may include:
                    </p>
                    <ul className="space-y-3 mb-4">
                        {[
                            "Subscription fees for platform access (Free, Basic, or Pro tiers)",
                            "Any additional fees for premium features as introduced",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 block w-1.5 h-1.5 bg-[#FF4D00] rounded-full flex-shrink-0" />
                                <span className="text-[14px] text-[#8A8A8A] leading-[1.9]">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        All payments are processed securely through third-party payment gateways (Razorpay). We do not store card numbers or banking information. Subscription cancellations take effect at the end of the current billing period.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Prohibited Conduct">
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.9] mb-4">
                        You agree not to:
                    </p>
                    <ul className="space-y-3">
                        {[
                            "Misrepresent yourself, your brand, or your follower metrics",
                            "Bypass the platform to complete collaborations negotiated through CreatorSync",
                            "Upload or transmit harmful, unlawful, or infringing content",
                            "Attempt to gain unauthorized access to any part of the platform",
                            "Use automated bots or scrapers to extract data from the platform",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 block w-1.5 h-1.5 bg-[#FF4D00] rounded-full flex-shrink-0" />
                                <span className="text-[14px] text-[#8A8A8A] leading-[1.9]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Intellectual Property">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        All CreatorSync branding, code, and platform design are the intellectual property of CreatorSync and its developers. Users retain ownership of content they upload (profile photos, bios, portfolio). By uploading content, you grant CreatorSync a limited license to display it within the platform.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Limitation of Liability">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        CreatorSync provides a marketplace — we are not responsible for disputes, content quality, deliverable failures, or the outcome of any collaboration between brands and creators. To the maximum extent permitted by law, our liability is limited to the amount you paid to us in the 3 months preceding any claim.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Termination">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        We reserve the right to suspend or permanently terminate accounts that violate these Terms, engage in fraudulent activity, or harm other users. You may delete your own account at any time from your dashboard Settings page.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Changes to Terms">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        We may update these Terms from time to time. Continued use of CreatorSync after changes constitutes acceptance of the revised Terms. We will notify users of material changes via email or in-app notice.
                    </p>
                </Section>

                <div className="h-px bg-[#1F1F1F] my-8" />

                <Section title="Contact">
                    <p className="text-[15px] text-[#8A8A8A] leading-[1.9]">
                        Questions about these Terms? Reach us at{" "}
                        <a href="mailto:parrvcodes@gmail.com" className="text-[#FF4D00] hover:underline">
                            parrvcodes@gmail.com
                        </a>
                        .
                    </p>
                </Section>
            </div>
        </PolicyLayout>
    );
}
