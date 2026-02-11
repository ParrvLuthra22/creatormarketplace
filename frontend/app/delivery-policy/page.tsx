"use client";

import { PolicyLayout } from "@/components/PolicyLayout";

export default function DeliveryPolicy() {
    return (
        <PolicyLayout title="Delivery Policy" lastUpdated="February 3, 2026">
            <div className="space-y-7">
                {/* Section 1 */}
                <section>
                    <h2 className="text-base font-angelo text-[#0A0A0A] uppercase tracking-[1.2px] mb-3">
                        SHIPPING / DELIVERY POLICY (DIGITAL SERVICE)
                    </h2>
                    <p className="text-[15px] text-[#3D3D3D] leading-[1.8]">
                        CreatorSync provides digital services only.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-[#0A0A0A] uppercase tracking-[1.2px] mb-3">
                        DIGITAL SERVICE DELIVERY
                    </h2>
                    <ul className="pl-5 space-y-2">
                        <li className="text-[14px] text-[#555555] leading-[2] flex items-start">
                            <span className="text-[#0A0A0A] mr-2">•</span>
                            <span>No physical products are shipped</span>
                        </li>
                        <li className="text-[14px] text-[#555555] leading-[2] flex items-start">
                            <span className="text-[#0A0A0A] mr-2">•</span>
                            <span>Platform access is granted immediately or within 24 hours after successful payment</span>
                        </li>
                        <li className="text-[14px] text-[#555555] leading-[2] flex items-start">
                            <span className="text-[#0A0A0A] mr-2">•</span>
                            <span>All services are delivered electronically via the website or email</span>
                        </li>
                    </ul>
                </section>
            </div>

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    h2 {
                        font-size: 14px;
                    }
                }

                @media (max-width: 480px) {
                    p, li {
                        font-size: 14px;
                    }
                }
            `}</style>
        </PolicyLayout>
    );
}
