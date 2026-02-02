"use client";

import { PolicyLayout } from "@/components/PolicyLayout";

export default function TermsAndConditions() {
    return (
        <PolicyLayout title="Terms and Conditions" lastUpdated="February 3, 2026">
            <div className="space-y-7">
                {/* Section 1 */}
                <section>
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        TERMS AND CONDITIONS ("TERMS")
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        Welcome to CreatorSync. By accessing or using our website and services, you agree to be bound by these Terms and Conditions.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        NATURE OF SERVICE
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        CreatorSync is a digital SaaS platform that enables brands to discover and collaborate with social media creators. We do not act as a marketing agency, talent agency, or campaign manager.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        USER ELIGIBILITY
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        Users must be at least 18 years old to use our services. By registering, you confirm that all information provided is accurate.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        PAYMENTS
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8] mb-4">
                        Payments made on the platform may include:
                    </p>
                    <ul className="pl-5 space-y-2">
                        <li className="text-[14px] text-[#AAAAAA] leading-[2] flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>Subscription fees for platform access</span>
                        </li>
                        <li className="text-[14px] text-[#AAAAAA] leading-[2] flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>Commission fees on successful collaborations</span>
                        </li>
                    </ul>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8] mt-4">
                        All payments are processed securely through third-party payment gateways. We do not store card or banking information.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        USER RESPONSIBILITY
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        Users agree not to misuse the platform, violate any laws, or attempt to bypass the platform to complete transactions off-platform.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        LIMITATION OF LIABILITY
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        CreatorSync is not responsible for disputes, content quality, or outcomes of collaborations between brands and creators.
                    </p>
                </section>

                {/* Section 7 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        TERMINATION
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        We reserve the right to suspend or terminate accounts that violate these terms.
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
