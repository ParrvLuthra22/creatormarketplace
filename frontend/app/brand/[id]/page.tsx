"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Briefcase, Users, FileText, Send } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SendProposalModal } from "@/components/SendProposalModal";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { showToast } from "@/lib/api";
import "./BrandProfile.css";

// Use a mock data interface since there's no specific public brand API yet
interface BrandMockData {
    companyName: string;
    industry: string;
    website: string;
    logoUrl: string;
    description: string;
    hiringCriteria: string[];
    pastCreators: {
        name: string;
        handle: string;
        avatar: string;
        campaign: string;
    }[];
}

export default function PublicBrandProfile() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
    const [brand, setBrand] = useState<BrandMockData | null>(null);
    const { user, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

    const handleSendProposalClick = () => {
        if (!user) {
            setAuthModalTab('login');
            setShowAuthModal(true);
        } else {
            setIsProposalModalOpen(true);
        }
    };

    useEffect(() => {
        // Mocking brand data fetch
        setTimeout(() => {
            setBrand({
                companyName: "upSosh",
                industry: "Fashion & Lifestyle",
                website: "https://upsosh.com",
                logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
                description: "We are a modern fashion brand focused on sustainability and minimal design. We look for creative minds who share our passion for positive change through fashion.",
                hiringCriteria: [
                    "High engagement rate (> 5%)",
                    "Aesthetic aligns with minimalism",
                    "Authentic audience connection",
                    "Quality content production"
                ],
                pastCreators: [
                    {
                        name: "Satyaki Das",
                        handle: "@satyakid",
                        avatar: "/images/satyaki.png",
                        campaign: "Summer Collection Launch"
                    },
                    {
                        name: "Elena Silva",
                        handle: "@elenastyles",
                        avatar: "https://i.pravatar.cc/150?img=47",
                        campaign: "Sustainable Autumn"
                    },
                    {
                        name: "Marcus Roy",
                        handle: "@marcusroy",
                        avatar: "https://i.pravatar.cc/150?img=11",
                        campaign: "Everyday Essentials"
                    }
                ]
            });
            setLoading(false);
        }, 800);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <p className="text-zinc-500 font-bold animate-pulse">Loading Brand Profile...</p>
            </div>
        );
    }

    if (!brand) return null;

    return (
        <div className="min-h-screen bg-zinc-50">
            <Header 
                user={user}
                onLoginClick={() => { setAuthModalTab('login'); setShowAuthModal(true); }}
                onSignupClick={() => { setAuthModalTab('signup'); setShowAuthModal(true); }}
                onLogoutClick={logout}
            />

            <div className="brand-profile-container">
                {/* Hero Section */}
                <div className="profile-hero">
                    <img 
                        src={brand.logoUrl} 
                        alt={brand.companyName} 
                        className="profile-hero-img" 
                    />
                    <div className="profile-hero-overlay">
                        <button 
                            onClick={() => router.back()}
                            className="absolute top-10 left-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </button>

                        <p className="premium-label">Verified Brand Partner</p>
                        <h1 className="brand-name-hero">
                            {brand.companyName} 
                            <span className="verified-badge">
                                <Check className="w-4 h-4 text-[#4e96f8]" /> Verified
                            </span>
                        </h1>
                        
                        <div className="mt-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 mb-4">Industry</p>
                            <span className="niche-tag">{brand.industry}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="profile-content-grid">
                    {/* Left Column: Details */}
                    <div className="brand-work-section">
                        {/* About */}
                        <div className="mb-12">
                            <h2 className="section-title flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#FF4D00]" />
                                About {brand.companyName}
                            </h2>
                            <p className="text-zinc-600 leading-relaxed font-medium">
                                {brand.description}
                            </p>
                        </div>

                        {/* Hiring Criteria */}
                        <div className="mb-12">
                            <h2 className="section-title flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#FF4D00]" />
                                Hiring Criteria
                            </h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {brand.hiringCriteria.map((criteria, idx) => (
                                    <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-md border border-zinc-100 shadow-sm">
                                        <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3.5 h-3.5 text-[#FF4D00]" />
                                        </div>
                                        <span className="text-sm font-bold text-zinc-700">{criteria}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Past Creators */}
                        <div>
                            <h2 className="section-title flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#FF4D00]" />
                                Passed Collaborations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {brand.pastCreators.map((creator, idx) => (
                                    <div key={idx} className="bg-white border border-zinc-100 rounded-md p-5 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-[#FF4D00] transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-200">
                                                <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-zinc-900 group-hover:text-[#FF4D00] transition-colors">{creator.name}</h3>
                                                <p className="text-xs font-bold text-zinc-500">{creator.handle}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-zinc-50">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-1">Campaign</p>
                                            <p className="text-sm font-semibold text-zinc-800">{creator.campaign}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interaction */}
                    <aside className="collaboration-sidebar">
                        <div className="bg-white border border-zinc-100 rounded-md p-8 shadow-sm text-center">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                                <Send className="w-7 h-7 text-[#FF4D00]" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Want to work with them?</h3>
                            <p className="text-sm text-zinc-500 font-medium mb-8">
                                Pitch your idea directly to the brand's campaign managers.
                            </p>
                            
                            <button 
                                onClick={handleSendProposalClick}
                                className="w-full h-12 bg-[#FF4D00] text-white rounded-md font-bold text-sm uppercase tracking-widest hover:bg-[#E64500] active:scale-95 transition-all shadow-[0_4px_14px_rgba(255,77,0,0.3)] flex items-center justify-center gap-2"
                            >
                                Send Proposal
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />

            <SendProposalModal
                creatorId={id} // Should actually be brandId when backend supports it
                creatorName={brand.companyName}
                isOpen={isProposalModalOpen}
                onClose={() => setIsProposalModalOpen(false)}
                onSent={() => setIsProposalModalOpen(false)}
            />

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialTab={authModalTab}
            />
        </div>
    );
}
