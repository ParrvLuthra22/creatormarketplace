"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-[#0D0D0D] border-t border-[#1F1F1F] mt-16">
            <div className="container mx-auto px-8 md:px-6 pt-12 pb-8">
                {/* 3 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
                    {/* Column 1 - Branding */}
                    <div>
                        <h3 className="text-xl font-milker text-white mb-2">
                            CreatorSync
                        </h3>
                        <p className="text-sm text-[#6B6B6B] mb-2">
                            Connecting brands with creators
                        </p>
                        <p className="text-[13px] text-[#6B6B6B]">
                            parrvcodes@gmail.com
                        </p>
                    </div>

                    {/* Column 2 - Product Links */}
                    <div>
                        <h4 className="text-[13px] font-angelo text-white uppercase tracking-wider mb-4">
                            Product
                        </h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/" className="text-sm text-[#6B6B6B] hover:text-white transition-colors">
                                For Brands
                            </Link>
                            <Link href="/" className="text-sm text-[#6B6B6B] hover:text-white transition-colors">
                                For Creators
                            </Link>
                            <Link href="/pricing" className="text-sm text-[#6B6B6B] hover:text-white transition-colors">
                                Pricing
                            </Link>
                        </div>
                    </div>

                    {/* Column 3 - Legal Links */}
                    <div>
                        <h4 className="text-[13px] font-angelo text-white uppercase tracking-wider mb-4">
                            Legal
                        </h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/privacy-policy" className="text-sm text-[#6B6B6B] hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-and-conditions" className="text-sm text-[#6B6B6B] hover:text-white transition-colors">
                                Terms & Conditions
                            </Link>
                            <Link href="/refund-policy" className="text-sm text-[#6B6B6B] hover:text-white transition-colors">
                                Refund Policy
                            </Link>
                            <Link href="/delivery-policy" className="text-sm text-[#6B6B6B] hover:text-white transition-colors">
                                Delivery Policy
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Row - Copyright */}
                <div className="border-t border-[#1F1F1F] pt-6 mt-8">
                    <p className="text-center text-[13px] text-[#3D3D3D]">
                        © 2026 CreatorSync. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    footer {
                        margin-top: 48px;
                    }
                    
                    .container {
                        padding: 40px 24px 28px;
                    }
                    
                    .grid {
                        gap: 32px;
                    }
                }

                @media (max-width: 480px) {
                    .container {
                        padding: 32px 16px 24px;
                    }
                    
                    h3 {
                        font-size: 18px;
                    }
                    
                    p, a {
                        font-size: 13px;
                    }
                    
                    h4 {
                        font-size: 12px;
                    }
                }
            `}</style>
        </footer>
    );
}
