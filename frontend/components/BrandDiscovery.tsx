"use client";

import { useEffect, useState } from "react";
import { getPublicBrands, PublicBrand } from "@/lib/api";
import { Building2, Briefcase, ArrowRight } from "lucide-react";
import { Skeleton } from "./ui/Skeleton";
import Link from "next/link";
import "./CreatorCard.css";

export function BrandDiscovery() {
    const [brands, setBrands] = useState<PublicBrand[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await getPublicBrands();
                if (res.success) {
                    setBrands(res.brands);
                }
            } catch (err) {
                console.error("Failed to fetch brands:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

    if (loading) {
        return (
            <div className="mt-20">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight lowercase">
                        discover new brands
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="creator-card-skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    if (brands.length === 0) return null;

    return (
        <section className="mt-20 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
            <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight lowercase">
                    discover new brands
                    <span className="text-zinc-400 text-lg font-bold ml-2">({brands.length})</span>
                </h2>
                <button className="text-sm font-bold tracking-widest text-zinc-400 hover:text-[#FF4D00] transition-colors lowercase">
                    explore all
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {brands.map((brand) => {
                    // For the sake of this demo, since API doesn't return cover photos yet,
                    // we'll assign a placeholder background based on ID or index
                    // Fallback to simple solid color if none is available
                    const name = brand.companyName || brand.name;
                    return (
                        <Link
                            key={brand.id}
                            href={`/brand/${brand.id}`}
                            className="creator-card group"
                        >
                            {/* Background Placeholder - since branding image is missing from PublicBrand model */}
                            <div className="creator-card-bg-placeholder bg-zinc-900">
                                <Building2 className="w-12 h-12 text-zinc-600" />
                            </div>

                            {/* Top Badge */}
                            <div className="creator-card-badge">
                                Open to Collabs
                            </div>

                            {/* Main Info Overlay (Visible by default) */}
                            <div className="creator-card-overlay">
                                <div className="flex justify-between items-end w-full">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-0.5 truncate">{name}</h3>
                                        <p className="text-xs text-white/80 font-medium">{brand.industry || 'General'}</p>
                                    </div>
                                    <Briefcase className="w-5 h-5 text-white/90" />
                                </div>
                            </div>

                            {/* Hover Expansion Content */}
                            <div className="creator-card-expansion">
                                <div className="p-6 pt-0">
                                    <div className="h-px bg-white/10 mb-5" />
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Company:</p>
                                            <p className="text-sm font-bold text-white truncate max-w-[120px]">{name}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                        <div className="w-full h-11 bg-[#FF4D00] hover:bg-[#FF6A20] text-white rounded-md font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center uppercase tracking-widest gap-2">
                                            View Profile <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
