"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { BrandDashboardLayout } from "@/components/BrandDashboardLayout";
import { CreatorCard } from "@/components/CreatorCard";
import { SendProposalModal } from "@/components/SendProposalModal";
import { Search, Filter, User as UserIcon } from "lucide-react";
import { getPublicCreators, getBrandDashboardSummary } from "@/lib/api";
import { SkeletonCreatorCard } from "@/components/ui/Skeleton";
import { BrandStatsCards } from "@/components/BrandStatsCards";

const FILTER_NICHES = ["All", "Fashion", "Fitness", "Tech", "Beauty", "Food", "Travel", "Comedy", "Finance"];

export default function BrandDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
    const [selectedContentType, setSelectedContentType] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState([10, 50]); // in thousands
    const [searchQuery, setSearchQuery] = useState("");
    const [creators, setCreators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [proposalModal, setProposalModal] = useState<{ isOpen: boolean; creatorId: string; creatorName: string }>({ isOpen: false, creatorId: "", creatorName: "" });
    const [dashSummary, setDashSummary] = useState({ totalSpend: 0, creatorsHired: 0, pendingProposals: 0 });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const s = await getBrandDashboardSummary();
                if (s.success) setDashSummary({ totalSpend: s.totalSpend, creatorsHired: s.creatorsHired, pendingProposals: s.pendingProposals });
            } catch {}
        };
        fetchSummary();
    }, []);

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const res = await getPublicCreators();
                if (res.success && res.creators) {
                    // Mock additional fields for the new UI
                    const enhancedCreators = res.creators.map((c: any, index: number) => ({
                        ...c,
                        profilePicture: c.name === "Satyaki Das" ? "/images/satyaki.png" : c.profilePicture,
                        engagementRate: index % 2 === 0 ? "12.5%" : "8.2%",
                        pastBrands: ["Nike", "Google", "Apple"],
                        isNew: index % 3 === 0,
                        featured: index % 4 === 0
                    }));
                    setCreators(enhancedCreators);
                }
            } catch (err) {
                console.error("Failed to fetch creators:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCreators();
    }, []);

    const toggleNiche = (niche: string) => {
        setSelectedNiches(prev => prev.includes(niche) ? prev.filter(n => n !== niche) : [...prev, niche]);
    };

    const toggleContentType = (type: string) => {
        setSelectedContentType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const filteredCreators = creators.filter(creator => {
        const matchesNiche = selectedNiches.length === 0 || selectedNiches.includes(creator.category || creator.niche);
        const matchesSearch = searchQuery === "" ||
            (creator.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (creator.instagramHandle || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesNiche && matchesSearch;
    });

    return (
        <RouteGuard allowedRole="brand">
            <BrandDashboardLayout variant="white">
                <div className="grid grid-cols-12 gap-10">
                    {/* LEFT SIDEBAR - FILTERS */}
                    <aside className="col-span-12 lg:col-span-3">
                        <div className="bg-white rounded-sm p-8 border border-zinc-100 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-zinc-900 mb-8">Filters</h2>

                            {/* Niche Section */}
                            <div className="mb-8">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-5">Niche</p>
                                <div className="space-y-4">
                                    {["Tech", "Lifestyle", "Gaming", "Fashion", "Food"].map(niche => (
                                        <div key={niche} className="flex justify-between items-center group cursor-pointer" onClick={() => toggleNiche(niche)}>
                                            <span className={`text-sm font-semibold transition-colors ${selectedNiches.includes(niche) ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-700"}`}>{niche}</span>
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${selectedNiches.includes(niche) ? "bg-[#FF4D00]" : "bg-zinc-200"}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selectedNiches.includes(niche) ? "left-6" : "left-1"}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="mb-8">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-5">Pricing</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold text-zinc-900">
                                        ₹{priceRange[0]}k - ₹{priceRange[1]}k+
                                    </span>
                                </div>
                                <div className="relative h-1.5 bg-zinc-100 rounded-full mb-2">
                                    <div className="absolute left-[20%] right-[0%] h-full bg-[#FF4D00] rounded-full" />
                                    <div className="absolute left-[20%] -top-1.5 w-4 h-4 bg-white border-2 border-[#FF4D00] rounded-full shadow-md cursor-pointer" />
                                    <div className="absolute right-0 -top-1.5 w-4 h-4 bg-white border-2 border-[#FF4D00] rounded-full shadow-md cursor-pointer" />
                                </div>
                            </div>

                            {/* Content Type Section */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-5">Content Type</p>
                                <div className="space-y-4">
                                    {["Video", "Photo", "Blog", "Podcast", "Live Stream"].map(type => (
                                        <div key={type} className="flex justify-between items-center group cursor-pointer" onClick={() => toggleContentType(type)}>
                                            <span className={`text-sm font-semibold transition-colors ${selectedContentType.includes(type) ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-700"}`}>{type}</span>
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${selectedContentType.includes(type) ? "bg-[#FF4D00]" : "bg-zinc-200"}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selectedContentType.includes(type) ? "left-6" : "left-1"}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT - GRID */}
                    <div className="col-span-12 lg:col-span-9">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h1 className="text-4xl font-bold text-zinc-900 tracking-tight leading-none mb-3">Creator Discovery Grid</h1>
                                <p className="text-zinc-500 font-medium">Browse through our network of elite content creators</p>
                            </div>
                            
                            {/* Simple Search */}
                            <div className="relative w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search creators..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-[#FF4D00] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Stats Cards Section */}
                        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <BrandStatsCards
                                totalSpend={dashSummary.totalSpend}
                                creatorsHired={dashSummary.creatorsHired}
                                pendingProposals={dashSummary.pendingProposals}
                                onProposalsClick={() => router.push('/dashboard/brand/proposals')}
                            />
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <SkeletonCreatorCard key={i} />
                                ))}
                            </div>
                        ) : filteredCreators.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-sm border border-dashed border-zinc-200">
                                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center">
                                    <UserIcon className="w-10 h-10 text-zinc-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900">No creators matching your filters</h3>
                                <p className="text-zinc-500 mt-2">Try adjusting your filters or search terms</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                                {filteredCreators.map((creator) => (
                                    <CreatorCard 
                                        key={creator.id || creator._id} 
                                        creator={creator}
                                        onProposalClick={() => setProposalModal({ 
                                            isOpen: true, 
                                            creatorId: (creator.userId || creator.id || creator._id).toString(), 
                                            creatorName: creator.name || creator.instagramHandle || 'Creator' 
                                        })}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <SendProposalModal
                    creatorId={proposalModal.creatorId}
                    creatorName={proposalModal.creatorName}
                    isOpen={proposalModal.isOpen}
                    onClose={() => setProposalModal({ isOpen: false, creatorId: "", creatorName: "" })}
                    onSent={() => {}}
                />
            </BrandDashboardLayout>
        </RouteGuard>
    );
}
