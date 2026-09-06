import { PolicyLayout, PolicySection, policyDivider, PolicyBullet } from "@/components/PolicyLayout";

export default function RefundPolicy() {
  return (
    <PolicyLayout title="Refund & Cancellation Policy" lastUpdated="February 3, 2026" badge="Legal">
      <PolicySection title="Overview">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          This policy outlines how we handle refunds and cancellations.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Subscriptions">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          Subscription fees are non-refundable once the billing cycle has started.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Commission-Based Fees">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          Commission fees are charged only on successful collaborations. Once a collaboration is completed, commissions are non-refundable.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Exceptional Cases">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-4">Refunds, if any, are processed only in cases of:</p>
        <ul className="list-none p-0 m-0">
          <PolicyBullet>Duplicate payments</PolicyBullet>
          <PolicyBullet>Technical errors</PolicyBullet>
        </ul>
        <p className="text-[15px] text-(--text-secondary) leading-[1.9] mt-4">
          Approved refunds will be processed within 5–7 business days.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
