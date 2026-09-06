import { PolicyLayout, PolicySection, policyDivider, PolicyBullet } from "@/components/PolicyLayout";

export default function DeliveryPolicy() {
  return (
    <PolicyLayout title="Delivery Policy" lastUpdated="February 3, 2026" badge="Legal">
      <PolicySection title="Shipping / Delivery Policy (Digital Service)">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">CreatorLyff provides digital services only.</p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Digital Service Delivery">
        <ul className="list-none p-0 m-0">
          <PolicyBullet>No physical products are shipped</PolicyBullet>
          <PolicyBullet>Platform access is granted immediately or within 24 hours after successful payment</PolicyBullet>
          <PolicyBullet>All services are delivered electronically via the website or email</PolicyBullet>
        </ul>
      </PolicySection>
    </PolicyLayout>
  );
}
