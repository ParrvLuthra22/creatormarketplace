import { PolicyLayout, PolicySection, policyDivider, PolicyBullet } from "@/components/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="April 9, 2026" badge="Legal">
      <PolicySection title="Overview">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          At CreatorLyff, your privacy is fundamental to everything we build. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you use our platform — whether you&apos;re a brand discovering creators or a creator building your portfolio.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Information We Collect">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-4">
          We collect the following types of information to operate and improve CreatorLyff:
        </p>
        <ul className="list-none p-0 m-0">
          <PolicyBullet>Name, email address, and account credentials</PolicyBullet>
          <PolicyBullet>Creator or brand profile information (bio, handles, company details)</PolicyBullet>
          <PolicyBullet>Instagram profile data (username, follower count, media) — only when you authenticate with Instagram</PolicyBullet>
          <PolicyBullet>Payment metadata processed by our third-party payment gateway (we do not store card numbers)</PolicyBullet>
          <PolicyBullet>Usage data, including pages visited and features used, to improve the platform</PolicyBullet>
        </ul>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Use of Information">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-4">Your data is used exclusively to:</p>
        <ul className="list-none p-0 m-0">
          <PolicyBullet>Operate, maintain, and improve the CreatorLyff platform</PolicyBullet>
          <PolicyBullet>Facilitate collaborations between brands and creators</PolicyBullet>
          <PolicyBullet>Send service-related communications (new proposals, account alerts)</PolicyBullet>
          <PolicyBullet>Display your profile and Instagram statistics to relevant brands (with your consent)</PolicyBullet>
          <PolicyBullet>Comply with applicable laws and platform policies, including Meta&apos;s requirements</PolicyBullet>
        </ul>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Data Sharing">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          We do not sell, rent, or trade your personal data. Information may be shared with trusted third-party service providers (such as payment processors and cloud infrastructure) strictly to operate the platform. These providers are contractually bound to keep data confidential.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Instagram & Facebook Data">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9] mb-4">
          When you connect your Instagram account via Facebook Login, we access your public profile data (username, bio, follower count, and recent posts) to populate your creator profile. This data is:
        </p>
        <ul className="list-none p-0 m-0">
          <PolicyBullet>Stored securely and only shown to brands you choose to engage with</PolicyBullet>
          <PolicyBullet>Never shared with third parties beyond platform operation</PolicyBullet>
          <PolicyBullet>Deletable at any time — see our Data Deletion Instructions</PolicyBullet>
        </ul>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Data Security">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          We implement industry-standard security measures including HTTPS encryption, secure cookie handling, bcrypt password hashing, and rate-limited authentication endpoints. While no system is 100% secure, we continuously work to protect your data.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Your Rights">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-4">You have the right to:</p>
        <ul className="list-none p-0 m-0">
          <PolicyBullet>Access the personal data we hold about you</PolicyBullet>
          <PolicyBullet>Correct inaccurate information in your profile</PolicyBullet>
          <PolicyBullet>Delete your account and all associated data at any time from Settings</PolicyBullet>
          <PolicyBullet>Revoke Instagram/Facebook access and request deletion of that data</PolicyBullet>
        </ul>
        <p className="text-sm text-(--text-secondary) leading-[1.9] mt-4">
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:parrvcodes@gmail.com" className="text-(--accent) no-underline">parrvcodes@gmail.com</a>.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Contact">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          For any privacy-related questions or concerns, reach us at{" "}
          <a href="mailto:parrvcodes@gmail.com" className="text-(--accent) no-underline">parrvcodes@gmail.com</a>. We aim to respond within 3 business days.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
