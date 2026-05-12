"use client";

import { PolicyLayout } from "@/components/PolicyLayout";

export default function RefundPolicy() {
    return (
        <PolicyLayout title="Refund & Cancellation Policy" lastUpdated="February 3, 2026">
            <div className="space-y-7">
                {/* Section 1 */}
                <section>
                    <h2 className="text-base font-angelo text-[#0A0A0A] uppercase tracking-[1.2px] mb-3">
                        REFUND & CANCELLATION POLICY
                    </h2>
                    <p className="text-[15px] text-[#3D3D3D] leading-[1.8]">
                        This policy outlines how we handle refunds and cancellations.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-[#0A0A0A] uppercase tracking-[1.2px] mb-3">
                        SUBSCRIPTIONS
                    </h2>
                    <p className="text-[15px] text-[#3D3D3D] leading-[1.8]">
                        Subscription fees are non-refundable once the billing cycle has started.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-[#0A0A0A] uppercase tracking-[1.2px] mb-3">
                        COMMISSION-BASED FEES
                    </h2>
                    <p className="text-[15px] text-[#3D3D3D] leading-[1.8]">
                        Commission fees are charged only on successful collaborations. Once a collaboration is completed, commissions are non-refundable.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-[#0A0A0A] uppercase tracking-[1.2px] mb-3">
                        EXCEPTIONAL CASES
                    </h2>
                    <p className="text-[15px] text-[#3D3D3D] leading-[1.8] mb-4">
                        Refunds, if any, are processed only in cases of:
                    </p>
                    <ul className="pl-5 space-y-2">
                        <li className="text-[14px] text-[#555555] leading-[2] flex items-start">
                            <span className="text-[#0A0A0A] mr-2">•</span>
                            <span>Duplicate payments</span>
                        </li>
                        <li className="text-[14px] text-[#555555] leading-[2] flex items-start">
                            <span className="text-[#0A0A0A] mr-2">•</span>
                            <span>Technical errors</span>
                        </li>
                    </ul>
                    <p className="text-[15px] text-[#3D3D3D] leading-[1.8] mt-4">
                        Approved refunds will be processed within 5–7 business days.
                    </p>
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
