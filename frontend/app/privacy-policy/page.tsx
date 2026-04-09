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

export default function PrivacyPolicy() {
    return (
        <PolicyLayout title="Privacy Policy" lastUpdated="April 9, 2026" badge="Legal">

            <Section title="Overview">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    At CreatorSync, your privacy is fundamental to everything we build. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you use our platform — whether you&apos;re a brand discovering creators or a creator building your portfolio.
                </p>
            </Section>

            {divider}

            <Section title="Information We Collect">
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginBottom: "16px" }}>
                    We collect the following types of information to operate and improve CreatorSync:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <Bullet>Name, email address, and account credentials</Bullet>
                    <Bullet>Creator or brand profile information (bio, handles, company details)</Bullet>
                    <Bullet>Instagram profile data (username, follower count, media) — only when you authenticate with Instagram</Bullet>
                    <Bullet>Payment metadata processed by our third-party payment gateway (we do not store card numbers)</Bullet>
                    <Bullet>Usage data, including pages visited and features used, to improve the platform</Bullet>
                </ul>
            </Section>

            {divider}

            <Section title="Use of Information">
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginBottom: "16px" }}>
                    Your data is used exclusively to:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <Bullet>Operate, maintain, and improve the CreatorSync platform</Bullet>
                    <Bullet>Facilitate collaborations between brands and creators</Bullet>
                    <Bullet>Send service-related communications (new proposals, account alerts)</Bullet>
                    <Bullet>Display your profile and Instagram statistics to relevant brands (with your consent)</Bullet>
                    <Bullet>Comply with applicable laws and platform policies, including Meta&apos;s requirements</Bullet>
                </ul>
            </Section>

            {divider}

            <Section title="Data Sharing">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    We do not sell, rent, or trade your personal data. Information may be shared with trusted third-party service providers (such as payment processors and cloud infrastructure) strictly to operate the platform. These providers are contractually bound to keep data confidential.
                </p>
            </Section>

            {divider}

            <Section title="Instagram & Facebook Data">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9, marginBottom: "16px" }}>
                    When you connect your Instagram account via Facebook Login, we access your public profile data (username, bio, follower count, and recent posts) to populate your creator profile. This data is:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <Bullet>Stored securely and only shown to brands you choose to engage with</Bullet>
                    <Bullet>Never shared with third parties beyond platform operation</Bullet>
                    <Bullet>Deletable at any time — see our Data Deletion Instructions</Bullet>
                </ul>
            </Section>

            {divider}

            <Section title="Data Security">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    We implement industry-standard security measures including HTTPS encryption, secure cookie handling, bcrypt password hashing, and rate-limited authentication endpoints. While no system is 100% secure, we continuously work to protect your data.
                </p>
            </Section>

            {divider}

            <Section title="Your Rights">
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginBottom: "16px" }}>
                    You have the right to:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <Bullet>Access the personal data we hold about you</Bullet>
                    <Bullet>Correct inaccurate information in your profile</Bullet>
                    <Bullet>Delete your account and all associated data at any time from Settings</Bullet>
                    <Bullet>Revoke Instagram/Facebook access and request deletion of that data</Bullet>
                </ul>
                <p style={{ fontSize: "14px", color: "#52525b", lineHeight: 1.9, marginTop: "16px" }}>
                    To exercise any of these rights, contact us at{" "}
                    <a href="mailto:parrvcodes@gmail.com" style={{ color: "#FF4D00", textDecoration: "none" }}>parrvcodes@gmail.com</a>.
                </p>
            </Section>

            {divider}

            <Section title="Contact">
                <p style={{ fontSize: "15px", color: "#3f3f46", lineHeight: 1.9 }}>
                    For any privacy-related questions or concerns, reach us at{" "}
                    <a href="mailto:parrvcodes@gmail.com" style={{ color: "#FF4D00", textDecoration: "none" }}>parrvcodes@gmail.com</a>.
                    {" "}We aim to respond within 3 business days.
                </p>
            </Section>

        </PolicyLayout>
    );
}
