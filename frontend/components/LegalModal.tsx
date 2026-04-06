"use client";

import { useEffect } from "react";
import { X, ArrowRight } from "lucide-react";

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "privacy" | "terms";
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isPrivacy = type === "privacy";
    const title = isPrivacy ? "Privacy Policy" : "Terms of Service";

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            style={{
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(4px)",
                animation: "fadeIn 200ms ease-out",
            }}
            onClick={onClose}
        >
            <div
                className="bg-[#141414] border border-[#1F1F1F] rounded-md w-[680px] max-w-[92vw] max-h-[80vh] flex flex-col"
                style={{
                    animation: "scaleIn 250ms ease-out",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-7 pt-6 pb-4 border-b border-[#1F1F1F] flex items-center justify-between flex-shrink-0">
                    <h2 className="text-xl font-milker text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-[#6B6B6B] hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="px-7 py-6 overflow-y-auto flex-1 legal-modal-body">
                    {isPrivacy ? <PrivacyContent /> : <TermsContent />}
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.92);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .legal-modal-body {
                    scrollbar-width: thin;
                    scrollbar-color: #2A2A2A transparent;
                }

                .legal-modal-body::-webkit-scrollbar {
                    width: 6px;
                }

                .legal-modal-body::-webkit-scrollbar-track {
                    background: transparent;
                }

                .legal-modal-body::-webkit-scrollbar-thumb {
                    background-color: #2A2A2A;
                    border-radius: 3px;
                }

                @media (max-width: 768px) {
                    .legal-modal-body h3 {
                        font-size: 13px !important;
                    }
                    .legal-modal-body p, .legal-modal-body li {
                        font-size: 13px !important;
                    }
                }

                @media (max-width: 480px) {
                    .legal-modal-body {
                        padding: 14px !important;
                    }
                }
            `}</style>
        </div>
    );
}

function PrivacyContent() {
    return (
        <div className="space-y-6">
            <Section title="Information We Collect">
                <p>
                    We collect information you provide directly to us when you create an account,
                    set up your profile, send or receive proposals, and use our messaging features.
                    This includes your name, email address, password, Instagram handle,
                    and any profile details you choose to share. We also collect usage data
                    such as pages visited, features used, and interaction patterns to improve
                    our platform.
                </p>
            </Section>

            <Section title="How We Use Your Information">
                <ul>
                    <li>To create and manage your account</li>
                    <li>To connect brands with creators through our marketplace</li>
                    <li>To facilitate proposals and collaboration communications</li>
                    <li>To improve and personalize your experience</li>
                    <li>To send important notifications about your account</li>
                    <li>To comply with legal obligations</li>
                </ul>
            </Section>

            <Section title="Data Sharing">
                <p>
                    We do not sell your personal information to third parties.
                    We may share information in the following cases:
                </p>
                <ul>
                    <li>Between matched brands and creators after a proposal is accepted</li>
                    <li>With service providers who assist in operating our platform</li>
                    <li>When required by law or legal process</li>
                    <li>To protect the safety and security of our users</li>
                </ul>
            </Section>

            <Section title="Data Security">
                <p>
                    We use industry-standard encryption to protect data in transit.
                    Passwords are hashed using bcrypt before storage. We conduct regular
                    security reviews and updates to maintain the integrity of our systems.
                    No method of transmission over the internet is 100 percent secure,
                    and we cannot guarantee absolute security.
                </p>
            </Section>

            <Section title="Your Rights">
                <p>You have the right to:</p>
                <ul>
                    <li>Access your personal data at any time</li>
                    <li>Update or correct your information</li>
                    <li>Delete your account and associated data</li>
                    <li>Opt out of non-essential communications</li>
                </ul>
                <p className="mt-3">
                    Contact us at privacy@creatorsync.com for any data-related requests.
                </p>
            </Section>

            <Section title="Cookies">
                <p>
                    We use essential cookies to keep you logged in and maintain your session.
                    We do not use tracking cookies or third-party advertising cookies.
                    You can manage cookies through your browser settings.
                </p>
            </Section>

            <Section title="Changes to This Policy">
                <p>
                    We may update this Privacy Policy from time to time. We will notify you
                    of significant changes via email. Your continued use of CreatorSync
                    after changes constitutes acceptance.
                </p>
            </Section>
        </div>
    );
}

function TermsContent() {
    return (
        <div className="space-y-6">
            <Section title="Acceptance of Terms">
                <p>
                    By creating an account and using CreatorSync, you agree to be bound
                    by these Terms of Service. If you do not agree, please do not use
                    our platform. These terms apply to all users, both Brands and Creators.
                </p>
            </Section>

            <Section title="Account Responsibilities">
                <p>
                    You are responsible for maintaining the security of your account.
                    Do not share your credentials with anyone. You must provide accurate
                    and truthful information during registration. You are responsible
                    for all activity that occurs under your account.
                </p>
            </Section>

            <Section title="Brand Obligations">
                <p>Brands must:</p>
                <ul>
                    <li>Provide accurate campaign briefs and budgets in proposals</li>
                    <li>Honor agreed-upon terms once a collaboration is accepted</li>
                    <li>Pay creators as agreed within the specified timeline</li>
                    <li>Not misrepresent their company or products</li>
                    <li>Not contact creators outside of CreatorSync messaging system</li>
                </ul>
            </Section>

            <Section title="Creator Obligations">
                <p>Creators must:</p>
                <ul>
                    <li>Maintain an authentic and accurate profile</li>
                    <li>Deliver content as specified in accepted proposals</li>
                    <li>Meet agreed-upon timelines and quality standards</li>
                    <li>Disclose any conflicts of interest</li>
                    <li>Not accept proposals they cannot fulfill</li>
                </ul>
            </Section>

            <Section title="Prohibited Activities">
                <p>You must not:</p>
                <ul>
                    <li>Create fake accounts or misrepresent yourself</li>
                    <li>Spam other users or send unsolicited messages</li>
                    <li>Post illegal, harmful, or misleading content</li>
                    <li>Attempt to bypass our platform for direct communication</li>
                    <li>Manipulate reviews or ratings</li>
                    <li>Use the platform for any illegal purpose</li>
                </ul>
            </Section>

            <Section title="Intellectual Property">
                <p>
                    CreatorSync and its logos are our intellectual property. Content created
                    by Creators remains their property unless otherwise agreed in a specific
                    collaboration contract. Brands gain usage rights only as specified
                    in accepted proposals.
                </p>
            </Section>

            <Section title="Dispute Resolution">
                <p>
                    In case of disputes between Brands and Creators, we encourage resolution
                    through our platform messaging system first. Unresolved disputes may
                    be escalated to our support team. CreatorSync reserves the right to
                    mediate but is not liable for the outcome of disputes between users.
                </p>
            </Section>

            <Section title="Limitation of Liability">
                <p>
                    CreatorSync is not liable for any indirect, incidental, or consequential
                    damages arising from your use of the platform. We provide the service
                    as is without warranties.
                </p>
            </Section>

            <Section title="Termination">
                <p>
                    We may terminate your account if you violate these Terms. You may
                    delete your account at any time through Settings. Upon termination,
                    your data will be removed within 30 days.
                </p>
            </Section>

            <Section title="Governing Law">
                <p>
                    These Terms are governed by the laws of India. Any legal proceedings
                    will be subject to the jurisdiction of courts in Delhi, India.
                </p>
            </Section>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-[15px] font-angelo text-white uppercase tracking-wider mb-3">
                {title}
            </h3>
            <div className="space-y-3 text-sm text-[#AAAAAA] leading-[1.7]">
                {children}
            </div>
        </div>
    );
}

// Styled list component
const styledListCSS = `
    .legal-modal-body ul {
        padding-left: 18px;
        list-style: none;
    }
    .legal-modal-body ul li {
        position: relative;
        padding-left: 0;
        color: #6B6B6B;
        font-size: 13px;
        margin-bottom: 8px;
    }
    .legal-modal-body ul li:before {
        content: "•";
        color: white;
        position: absolute;
        left: -18px;
    }
`;

if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.textContent = styledListCSS;
    document.head.appendChild(style);
}
