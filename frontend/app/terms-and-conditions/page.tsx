"use client";

import { PolicyLayout } from "@/components/PolicyLayout";

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

function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
            <span style={{ marginTop: "8px", width: "5px", height: "5px", background: "#FF4D00", borderRadius: "50%", flexShrink: 0 }} />
            <span style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9 }}>{children}</span>
        </li>
    );
}

export default function TermsAndConditions() {
    return (
        <PolicyLayout title="Terms & Conditions" lastUpdated="April 9, 2026" badge="Legal">

            <Section title="Agreement to Terms">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    Welcome to CreatorSync. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the platform.
                </p>
            </Section>

            {divider}

            <Section title="Nature of Service">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    CreatorSync is a digital SaaS platform that enables brands to discover, evaluate, and collaborate with social media creators. We provide the technology and tools — we are not a marketing agency, talent agency, or campaign manager. All collaborations are negotiated directly between brands and creators.
                </p>
            </Section>

            {divider}

            <Section title="User Eligibility">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    You must be at least 18 years old to create an account and use CreatorSync. By registering, you confirm that all information you provide is accurate and that you have the authority to enter into these Terms on behalf of yourself or your organization.
                </p>
            </Section>

            {divider}

            <Section title="Account Responsibilities">
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginBottom: "16px" }}>
                    As a registered user, you are responsible for:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <Bullet>Maintaining the confidentiality of your account credentials</Bullet>
                    <Bullet>All activity that occurs under your account</Bullet>
                    <Bullet>Keeping your profile information accurate and up to date</Bullet>
                    <Bullet>Notifying us immediately of any unauthorized use of your account</Bullet>
                </ul>
            </Section>

            {divider}

            <Section title="Payments & Subscriptions">
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginBottom: "16px" }}>
                    Payments made on the platform may include:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <Bullet>Subscription fees for platform access (Free, Basic, or Pro tiers)</Bullet>
                    <Bullet>Any additional fees for premium features as introduced</Bullet>
                </ul>
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9, marginTop: "16px" }}>
                    All payments are processed securely through third-party payment gateways (Razorpay). We do not store card numbers or banking information. Subscription cancellations take effect at the end of the current billing period.
                </p>
            </Section>

            {divider}

            <Section title="Prohibited Conduct">
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginBottom: "16px" }}>
                    You agree not to:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <Bullet>Misrepresent yourself, your brand, or your follower metrics</Bullet>
                    <Bullet>Bypass the platform to complete collaborations negotiated through CreatorSync</Bullet>
                    <Bullet>Upload or transmit harmful, unlawful, or infringing content</Bullet>
                    <Bullet>Attempt to gain unauthorized access to any part of the platform</Bullet>
                    <Bullet>Use automated bots or scrapers to extract data from the platform</Bullet>
                </ul>
            </Section>

            {divider}

            <Section title="Intellectual Property">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    All CreatorSync branding, code, and platform design are the intellectual property of CreatorSync and its developers. Users retain ownership of content they upload (profile photos, bios, portfolio). By uploading content, you grant CreatorSync a limited license to display it within the platform.
                </p>
            </Section>

            {divider}

            <Section title="Limitation of Liability">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    CreatorSync provides a marketplace — we are not responsible for disputes, content quality, deliverable failures, or the outcome of any collaboration between brands and creators. To the maximum extent permitted by law, our liability is limited to the amount you paid to us in the 3 months preceding any claim.
                </p>
            </Section>

            {divider}

            <Section title="Termination">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    We reserve the right to suspend or permanently terminate accounts that violate these Terms, engage in fraudulent activity, or harm other users. You may delete your own account at any time from your dashboard Settings page.
                </p>
            </Section>

            {divider}

            <Section title="Changes to Terms">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    We may update these Terms from time to time. Continued use of CreatorSync after changes constitutes acceptance of the revised Terms. We will notify users of material changes via email or in-app notice.
                </p>
            </Section>

            {divider}

            <Section title="Contact">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    Questions about these Terms? Reach us at{" "}
                    <a href="mailto:parrvcodes@gmail.com" style={{ color: "#FF4D00", textDecoration: "none" }}>parrvcodes@gmail.com</a>.
                </p>
            </Section>

        </PolicyLayout>
    );
}
