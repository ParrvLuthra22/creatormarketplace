"use client";

import { useEffect, useState } from "react";
import { getPublicBrands, PublicBrand } from "@/lib/api";
import { Briefcase, Building2, ExternalLink } from "lucide-react";
import { Skeleton } from "./ui/Skeleton";

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
                        <div key={i} className="h-40 bg-white border border-zinc-100 rounded-md p-6 animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <Skeleton className="w-10 h-10 rounded-md" />
                                <div className="space-y-2">
                                    <Skeleton className="w-24 h-4" />
                                    <Skeleton className="w-16 h-3" />
                                </div>
                            </div>
                            <Skeleton className="w-full h-8 rounded-sm" />
                        </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {brands.map((brand) => (
                    <div 
                        key={brand.id} 
                        className="group bg-white border border-zinc-100 rounded-md p-6 shadow-sm hover:border-[#FF4D00] hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 bg-zinc-50 rounded-md flex items-center justify-center border border-zinc-100 group-hover:bg-orange-50 transition-colors">
                                <Building2 className="w-6 h-6 text-zinc-400 group-hover:text-[#FF4D00]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900 group-hover:text-[#FF4D00] transition-colors truncate max-w-[140px]">
                                    {brand.companyName || brand.name}
                                </h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    {brand.industry || "General"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-500 lowercase">open to collabs</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-zinc-300 group-hover:text-[#FF4D00] transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
