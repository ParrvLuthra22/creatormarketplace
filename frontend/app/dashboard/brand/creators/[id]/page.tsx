"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { BrandDashboardLayout } from "@/components/BrandDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getPublicCreatorStats, PublicCreatorStatsResponse, getProfilePhotoUrl } from "@/lib/api";
import { ArrowLeft, Check, Share2 as Instagram, Play, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { SendProposalModal } from "@/components/SendProposalModal";
import "./CreatorProfile.css";

export default function BrandCreatorProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [data, setData] = useState<PublicCreatorStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('action') === 'proposal') {
            setIsProposalModalOpen(true);
        }
    }, [searchParams]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getPublicCreatorStats(id);
                if (!cancelled) setData(res);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to load creator";
                if (!cancelled) setError(message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (id) run();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const creator = data?.creator;

    const pastWork = creator?.brandWork?.length ? creator.brandWork.map(w => ({
        brand: w.title || "Brand Partnership",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg",
        image: w.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
        stats: ["N/A"]
    })) : [];

    if (loading) {
        return (
            <RouteGuard allowedRole="brand">
                <BrandDashboardLayout variant="white">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <p className="text-zinc-500 font-bold animate-pulse">Loading Creator Profile...</p>
                    </div>
                </BrandDashboardLayout>
            </RouteGuard>
        );
    }

    if (error || !creator) {
        return (
            <RouteGuard allowedRole="brand">
                <BrandDashboardLayout variant="white">
                    <div className="p-10 text-center">
                        <p className="text-red-500 font-bold">{error || "Creator not found"}</p>
                        <button onClick={() => router.back()} className="mt-4 text-[#FF4D00] font-black underline">Go Back</button>
                    </div>
                </BrandDashboardLayout>
            </RouteGuard>
        );
    }

    return (
        <RouteGuard allowedRole="brand">
            <BrandDashboardLayout variant="white">
                <div className="creator-profile-container">
                    {/* Hero Section */}
                    <div className="profile-hero">
                        <img 
                            src={getProfilePhotoUrl(creator.profilePicture) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"} 
                            alt={creator.name} 
                            className="profile-hero-img" 
                        />
                        <div className="profile-hero-overlay">
                            <button 
                                onClick={() => router.back()}
                                className="absolute top-10 left-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
                            >
                                <ArrowLeft className="w-6 h-6 text-white" />
                            </button>

                            <p className="premium-label">Premium Creator Profile</p>
                            <h1 className="creator-name">
                                {creator.name} 
                                <span className="verified-badge">
                                    <Check className="w-4 h-4 text-[#4e96f8]" /> Verified
                                </span>
                            </h1>
                            
                            <div className="mt-4">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 mb-4">Curated Niche Tags</p>
                                <div className="niche-tags">
                                    {(creator.niches?.length ? creator.niches : ["Fashion", "Lifestyle", "Travel", "Sustainability"]).map(niche => (
                                        <span key={niche} className="niche-tag">{niche}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="profile-content-grid">
                        {/* Left Column: Brand Work */}
                        <div className="brand-work-section">
                            <h2 className="section-title">Past Brand Work</h2>
                            
                            {pastWork.length > 0 ? (
                                <div className="brand-work-grid">
                                    {pastWork.map((work, idx) => (
                                        <div key={idx} className="brand-work-card group cursor-pointer">
                                            <img src={work.image} alt={work.brand} className="brand-work-img" />
                                            <div className="brand-logo-container transition-transform group-hover:scale-110">
                                                <img src={work.logo} alt={work.brand} />
                                            </div>
                                            <div className="brand-work-info">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="brand-work-title">{work.brand}</h3>
                                                    <Play className="w-4 h-4 text-white/40 group-hover:text-white" />
                                                </div>
                                                <div className="brand-work-stats">
                                                    {work.stats.map((stat, sIdx) => (
                                                        <p key={sIdx} className="brand-work-stat">
                                                            <span>•</span> {stat}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-zinc-500 italic bg-zinc-50 rounded-md border border-zinc-100">
                                    This creator hasn't uploaded any past brand work yet.
                                </div>
                            )}
                        </div>

                        {/* Right Column: Collaboration Info */}
                        <aside className="collaboration-sidebar">
                            <h2 className="sidebar-title">Collaboration Info</h2>

                            <div className="sidebar-section">
                                <h3 className="sidebar-label">Services Offered:</h3>
                                <p className="sidebar-content">
                                    Sponsored Posts, Brand Ambassadorship, Content Creation, Event Appearances
                                </p>
                            </div>

                            <div className="sidebar-section">
                                <h3 className="sidebar-label">Pricing Tiers:</h3>
                                <div className="pricing-list">
                                    {creator?.pricing ? (
                                        <p className="pricing-item"><span>Starting from ₹{creator.pricing.starting} per {creator.pricing.per || 'post'}</span></p>
                                    ) : (
                                        <p className="pricing-item"><span>Custom Pricing (Request Proposal)</span></p>
                                    )}
                                </div>
                            </div>

                            <div className="sidebar-section">
                                <h3 className="sidebar-label">Availability:</h3>
                                <p className={`sidebar-content font-black ${creator?.availability === 'unavailable' ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {creator?.availability ? creator.availability.toUpperCase() : "OPEN TO WORK"}
                                </p>
                            </div>

                            <button 
                                onClick={() => setIsProposalModalOpen(true)}
                                className="send-proposal-btn"
                            >
                                Send Proposal
                            </button>
                        </aside>
                    </div>

                    <SendProposalModal
                        creatorId={id}
                        creatorName={creator.name || creator.instagramHandle || 'Creator'}
                        isOpen={isProposalModalOpen}
                        onClose={() => setIsProposalModalOpen(false)}
                        onSent={() => setIsProposalModalOpen(false)}
                    />


                </div>
            </BrandDashboardLayout>
        </RouteGuard>
    );
}
