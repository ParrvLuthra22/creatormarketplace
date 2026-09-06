import { PolicyLayout, PolicySection, policyDivider, PolicyBullet } from "@/components/PolicyLayout";

export default function TermsAndConditions() {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="April 9, 2026" badge="Legal">
      <PolicySection title="Agreement to Terms">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          Welcome to CreatorLyff. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the platform.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Nature of Service">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          CreatorLyff is a digital SaaS platform that enables brands to discover, evaluate, and collaborate with social media creators. We provide the technology and tools — we are not a marketing agency, talent agency, or campaign manager. All collaborations are negotiated directly between brands and creators.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="User Eligibility">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          You must be at least 18 years old to create an account and use CreatorLyff. By registering, you confirm that all information you provide is accurate and that you have the authority to enter into these Terms on behalf of yourself or your organization.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Account Responsibilities">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-4">As a registered user, you are responsible for:</p>
        <ul className="list-none p-0 m-0">
          <PolicyBullet>Maintaining the confidentiality of your account credentials</PolicyBullet>
          <PolicyBullet>All activity that occurs under your account</PolicyBullet>
          <PolicyBullet>Keeping your profile information accurate and up to date</PolicyBullet>
          <PolicyBullet>Notifying us immediately of any unauthorized use of your account</PolicyBullet>
        </ul>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Payments & Subscriptions">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-4">Payments made on the platform may include:</p>
        <ul className="list-none p-0 m-0">
          <PolicyBullet>Subscription fees for platform access (Free, Basic, or Pro tiers)</PolicyBullet>
          <PolicyBullet>Any additional fees for premium features as introduced</PolicyBullet>
        </ul>
        <p className="text-[15px] text-(--text-secondary) leading-[1.9] mt-4">
          All payments are processed securely through third-party payment gateways (Razorpay). We do not store card numbers or banking information. Subscription cancellations take effect at the end of the current billing period.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Prohibited Conduct">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-4">You agree not to:</p>
        <ul className="list-none p-0 m-0">
          <PolicyBullet>Misrepresent yourself, your brand, or your follower metrics</PolicyBullet>
          <PolicyBullet>Bypass the platform to complete collaborations negotiated through CreatorLyff</PolicyBullet>
          <PolicyBullet>Upload or transmit harmful, unlawful, or infringing content</PolicyBullet>
          <PolicyBullet>Attempt to gain unauthorized access to any part of the platform</PolicyBullet>
          <PolicyBullet>Use automated bots or scrapers to extract data from the platform</PolicyBullet>
        </ul>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Intellectual Property">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          All CreatorLyff branding, code, and platform design are the intellectual property of CreatorLyff and its developers. Users retain ownership of content they upload (profile photos, bios, portfolio). By uploading content, you grant CreatorLyff a limited license to display it within the platform.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Limitation of Liability">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          CreatorLyff provides a marketplace — we are not responsible for disputes, content quality, deliverable failures, or the outcome of any collaboration between brands and creators. To the maximum extent permitted by law, our liability is limited to the amount you paid to us in the 3 months preceding any claim.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Termination">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          We reserve the right to suspend or permanently terminate accounts that violate these Terms, engage in fraudulent activity, or harm other users. You may delete your own account at any time from your dashboard Settings page.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Changes to Terms">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          We may update these Terms from time to time. Continued use of CreatorLyff after changes constitutes acceptance of the revised Terms. We will notify users of material changes via email or in-app notice.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Contact">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          Questions about these Terms? Reach us at{" "}
          <a href="mailto:parrvcodes@gmail.com" className="text-(--accent) no-underline">parrvcodes@gmail.com</a>.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
