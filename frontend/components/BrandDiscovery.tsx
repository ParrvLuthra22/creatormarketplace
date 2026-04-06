import { Brand } from "@/lib/creatorData";
import { Button } from "./ui/Button";

interface BrandDiscoveryProps {
    brands: Brand[];
}

export function BrandDiscovery({ brands }: BrandDiscoveryProps) {
    const activeBrands = brands.filter(b => b.activelyHiring);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Brands Looking for Creators</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeBrands.map((brand) => (
                    <div
                        key={brand.id}
                        className="bg-white rounded-md p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            {/* Brand Logo */}
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF6B9D] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                {brand.logo}
                            </div>

                            {/* Brand Info */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{brand.name}</h3>
                                <span className="inline-block px-3 py-1 bg-pink-50 text-[#FF6B9D] text-xs font-semibold rounded-full mb-2">
                                    {brand.industry}
                                </span>
                                {brand.description && (
                                    <p className="text-sm text-gray-600 mb-3">{brand.description}</p>
                                )}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-gray-700 font-medium">Actively hiring creators</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="border-2 border-[#FF6B9D] text-[#FF6B9D] hover:bg-pink-50"
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {activeBrands.length === 0 && (
                <div className="text-center py-12 bg-white rounded-md border border-gray-100">
                    <p className="text-gray-500">No brands actively hiring at the moment.</p>
                </div>
            )}
        </div>
    );
}
