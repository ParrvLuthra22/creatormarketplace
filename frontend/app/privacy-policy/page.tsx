"use client";

import { PolicyLayout } from "@/components/PolicyLayout";

export default function PrivacyPolicy() {
    return (
        <PolicyLayout title="Privacy Policy" lastUpdated="February 3, 2026">
            <div className="space-y-7">
                {/* Section 1 */}
                <section>
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        PRIVACY POLICY
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        At CreatorSync, we respect your privacy.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        INFORMATION WE COLLECT
                    </h2>
                    <ul className="pl-5 space-y-2">
                        <li className="text-[14px] text-[#AAAAAA] leading-[2] flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>Name, email, and account details</span>
                        </li>
                        <li className="text-[14px] text-[#AAAAAA] leading-[2] flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>Creator or brand profile information</span>
                        </li>
                        <li className="text-[14px] text-[#AAAAAA] leading-[2] flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>Payment-related metadata (processed by payment gateway)</span>
                        </li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        USE OF INFORMATION
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8] mb-4">
                        We use collected data to:
                    </p>
                    <ul className="pl-5 space-y-2">
                        <li className="text-[14px] text-[#AAAAAA] leading-[2] flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>Operate and improve the platform</span>
                        </li>
                        <li className="text-[14px] text-[#AAAAAA] leading-[2] flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>Facilitate collaborations</span>
                        </li>
                        <li className="text-[14px] text-[#AAAAAA] leading-[2] flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>Communicate service-related updates</span>
                        </li>
                    </ul>
                </section>

                {/* Section 4 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        DATA SHARING
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        We do not sell or rent personal data. Information is shared only with trusted service providers (such as payment processors) when required.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        DATA SECURITY
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        We implement reasonable security measures to protect user data.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mt-7">
                    <h2 className="text-base font-angelo text-white uppercase tracking-[1.2px] mb-3">
                        USER RIGHTS
                    </h2>
                    <p className="text-[15px] text-[#C5C5C5] leading-[1.8]">
                        Users may request access, correction, or deletion of their data by contacting us at parrvcodes@gmail.com.
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
