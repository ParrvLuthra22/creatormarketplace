"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { AuthGateModal } from "@/components/AuthGateModal";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PricingPage() {
    const [modalState, setModalState] = useState<'authGate' | 'login' | 'signup' | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    const handleAuthGate = () => {
        setModalState('authGate');
    };

    const handleOpenLogin = () => {
        setModalState('login');
    };

    const handleOpenSignup = () => {
        setModalState('signup');
    };

    const handleCloseModal = () => {
        setModalState(null);
    };

    const handleSubscribe = async (planId: 'basic' | 'pro') => {
        // Check if user is logged in
        if (!user) {
            handleAuthGate();
            return;
        }

        // Check if user is a brand
        if (user.accountType !== 'Brand') {
            alert('Only brands can subscribe to paid plans');
            return;
        }

        try {
            // Create subscription
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ planId })
            });

            const data = await response.json();

            if (!data.success) {
                alert(data.error || 'Failed to create subscription');
                return;
            }

            // Open Razorpay checkout
            const options = {
                key: data.razorpay_key,
                subscription_id: data.subscription.id,
                name: 'CreatorSync',
                description: `${planId === 'basic' ? 'Basic' : 'Pro'} Plan Subscription`,
                prefill: {
                    name: user.fullName,
                    email: user.email
                },
                theme: {
                    color: '#FFFFFF'
                },
                handler: async function (response: any) {
                    // Verify payment
                    const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify-subscription`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        alert('Subscription activated! Redirecting to dashboard...');
                        router.push('/dashboard/brand');
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log('Payment cancelled');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Subscription error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F8F8]">
            <PublicHeader />

            {/* Main Content */}
            <main className="max-w-[1100px] mx-auto px-5 pt-20 pb-[100px]">
                {/* Hero Section */}
                <div className="hero-section text-center mb-14">
                    <h1 className="hero-heading text-[38px] font-milker text-[#0A0A0A] mb-[10px]">
                        Simple, transparent pricing
                    </h1>
                    <p className="hero-subtext text-[16px] text-[#6B6B6B] mb-4">
                        Start free. Upgrade when you're ready.
                    </p>
                    <div className="inline-block bg-white border border-[#E5E5E5] rounded-[20px] px-4 py-[6px] text-[13px] text-[#6B6B6B]">
                        Creators always join for free
                    </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="pricing-grid grid grid-cols-3 gap-5 items-start mb-16">
                    {/* FREE CARD */}
                    <div className="pricing-card bg-[#141414] border border-[#1F1F1F] rounded-[20px] px-7 py-9">
                        <p className="plan-name font-angelo text-[14px] uppercase text-white tracking-[1.5px]">
                            FREE
                        </p>
                        <div className="price-row flex items-baseline gap-1 mt-[18px]">
                            <span className="price-number font-milker text-[48px] text-white">₹0</span>
                            <span className="price-period text-[16px] text-[#6B6B6B]">/month</span>
                        </div>
                        <p className="plan-description text-[14px] text-[#6B6B6B] mt-3">
                            Browse creators and explore the platform
                        </p>

                        <div className="divider h-[1px] bg-[#1F1F1F] my-6"></div>

                        {/* Features */}
                        <div className="features space-y-2">
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">Browse up to 10 creators</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">View creator names & handles</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#2A1A1A]">✗</span>
                                <span className="text-[14px] text-[#6B6B6B]">See pricing & contact info</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#2A1A1A]">✗</span>
                                <span className="text-[14px] text-[#6B6B6B]">Send proposals</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#2A1A1A]">✗</span>
                                <span className="text-[14px] text-[#6B6B6B]">In-app messaging</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#2A1A1A]">✗</span>
                                <span className="text-[14px] text-[#6B6B6B]">Filter by niche & location</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleAuthGate}
                            className="cta-button w-full h-[50px] mt-7 bg-transparent border border-[#1F1F1F] text-white font-angelo text-[15px] rounded-xl cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                        >
                            Get Started — Free
                        </button>
                    </div>

                    {/* BASIC CARD */}
                    <div className="pricing-card bg-[#141414] border border-[#1F1F1F] rounded-[20px] px-7 py-9">
                        <p className="plan-name font-angelo text-[14px] uppercase text-white tracking-[1.5px]">
                            BASIC
                        </p>
                        <div className="price-row flex items-baseline gap-1 mt-[18px]">
                            <span className="price-number font-milker text-[48px] text-white">₹999</span>
                            <span className="price-period text-[16px] text-[#6B6B6B]">/month</span>
                        </div>
                        <p className="plan-description text-[14px] text-[#6B6B6B] mt-3">
                            Discover and research creators
                        </p>

                        <div className="divider h-[1px] bg-[#1F1F1F] my-6"></div>

                        {/* Features */}
                        <div className="features space-y-2">
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">Full creator list (50+ creators)</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">See pricing & contact info</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">Filter by niche, location, followers</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">View creator profiles in detail</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#2A1A1A]">✗</span>
                                <span className="text-[14px] text-[#6B6B6B]">Send proposals</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#2A1A1A]">✗</span>
                                <span className="text-[14px] text-[#6B6B6B]">In-app messaging</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => handleSubscribe('basic')}
                            className="cta-button w-full h-[50px] mt-7 bg-transparent border border-[#1F1F1F] text-white font-angelo text-[15px] rounded-xl cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                        >
                            Choose Basic
                        </button>
                    </div>

                    {/* PRO CARD (Most Popular) */}
                    <div className="pricing-card relative bg-[#141414] border border-white rounded-[20px] px-7 py-9">
                        {/* Most Popular Badge */}
                        <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-white text-black font-angelo text-[11px] uppercase tracking-[1.5px] px-[18px] py-[5px] rounded-[20px]">
                            MOST POPULAR
                        </div>

                        <p className="plan-name font-angelo text-[14px] uppercase text-white tracking-[1.5px]">
                            PRO
                        </p>
                        <div className="price-row flex items-baseline gap-1 mt-[18px]">
                            <span className="price-number font-milker text-[48px] text-white">₹2,999</span>
                            <span className="price-period text-[16px] text-[#6B6B6B]">/month</span>
                        </div>
                        <p className="plan-description text-[14px] text-[#6B6B6B] mt-3">
                            Full collaboration suite
                        </p>

                        <div className="divider h-[1px] bg-[#1F1F1F] my-6"></div>

                        {/* Features */}
                        <div className="features space-y-2">
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">Everything in Basic</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">Send up to 10 proposals/month</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">In-app chat with creators</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">Proposal tracking (Sent → Viewed → Accepted)</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">Creator availability signals</span>
                            </div>
                            <div className="feature-row flex items-center gap-[10px] py-2">
                                <span className="text-[14px] text-[#1A2A1A]">✓</span>
                                <span className="text-[14px] text-white">Priority creator visibility</span>
                            </div>
                        </div>

                        {/* CTA Button - Filled */}
                        <button
                            onClick={() => handleSubscribe('pro')}
                            className="cta-button w-full h-[50px] mt-7 bg-white text-black font-angelo text-[15px] rounded-xl cursor-pointer hover:bg-[#E5E5E5] transition-colors"
                        >
                            Choose Pro
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section max-w-[680px] mx-auto mt-16 text-center">
                    <h2 className="font-milker text-[24px] text-[#0A0A0A] mb-2">
                        Have questions?
                    </h2>
                    <p className="text-[15px] text-[#6B6B6B] mb-6">
                        We're here to help you get started
                    </p>

                    {/* FAQ Cards */}
                    <div className="space-y-3">
                        <div className="faq-card bg-[#141414] border border-[#1F1F1F] rounded-xl px-6 py-5 text-left">
                            <p className="faq-question text-[15px] text-white font-semibold mb-[6px]">
                                Do creators have to pay anything?
                            </p>
                            <p className="faq-answer text-[14px] text-[#6B6B6B]">
                                No. Creators join and receive proposals completely free.
                            </p>
                        </div>

                        <div className="faq-card bg-[#141414] border border-[#1F1F1F] rounded-xl px-6 py-5 text-left">
                            <p className="faq-question text-[15px] text-white font-semibold mb-[6px]">
                                Can I change my plan later?
                            </p>
                            <p className="faq-answer text-[14px] text-[#6B6B6B]">
                                Yes. Upgrade or downgrade anytime from your dashboard settings.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center border-t border-[#E5E5E5]">
                <p className="text-[13px] text-[#3D3D3D]">
                    © 2026 CreatorSync. All rights reserved.
                </p>
            </footer>

            {/* Auth Gate Modal */}
            <AuthGateModal
                isOpen={modalState === 'authGate'}
                onClose={handleCloseModal}
                onLogin={handleOpenLogin}
                onSignup={handleOpenSignup}
            />

            {/* Auth Modal (Login/Signup) */}
            <AuthModal
                isOpen={modalState === 'login' || modalState === 'signup'}
                onClose={handleCloseModal}
                initialTab={modalState === 'login' ? 'login' : 'signup'}
            />

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .pricing-grid {
                        grid-template-columns: 1fr;
                        max-width: 480px;
                        margin: 0 auto 64px;
                    }

                    /* Reorder: Pro card first on mobile */
                    .pricing-card:nth-child(3) {
                        order: -1;
                    }
                }

                @media (max-width: 480px) {
                    .hero-heading {
                        font-size: 28px;
                    }

                    .pricing-card {
                        padding: 28px 20px;
                    }

                    .price-number {
                        font-size: 40px;
                    }
                }
            `}</style>
        </div>
    );
}
