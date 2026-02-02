"use client";

import { useParams, useRouter } from "next/navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { CREATORS, Creator } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Instagram, MapPin, Star } from "lucide-react";
import Link from "next/link";

export default function CreatorProfileViewPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    // Find creator by handle (removing @ if present)
    const normalizedUsername = username.startsWith('@') ? username : `@${username}`;
    const creator = CREATORS.find(c =>
        c.handle.toLowerCase() === normalizedUsername.toLowerCase() ||
        c.handle.toLowerCase() === username.toLowerCase()
    );

    if (!creator) {
        return (
            <RouteGuard allowedRole="brand">
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Creator Not Found</h1>
                        <p className="text-gray-600 mb-4">The creator you're looking for doesn't exist.</p>
                        <Button onClick={() => router.push('/dashboard/brand')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </RouteGuard>
        );
    }

    return (
        <RouteGuard allowedRole="brand">
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between h-16">
                            <Link
                                href="/dashboard/brand"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden md:inline">Back to Dashboard</span>
                            </Link>
                            <span className="text-xl font-bold text-[#1A1A1A]">Creator Profile</span>
                            <div className="w-20" /> {/* Spacer */}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 md:px-6 py-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Profile Header */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                {/* Avatar */}
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#FF6B35] to-[#FF6B9D] flex items-center justify-center flex-shrink-0">
                                    {creator.photo ? (
                                        <img
                                            src={creator.photo}
                                            alt={creator.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-4xl font-bold">
                                            {creator.name.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{creator.name}</h1>
                                    <p className="text-[#FF6B9D] font-medium mb-3">{creator.handle}</p>

                                    {/* Location */}
                                    {creator.location && (
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4">
                                            <MapPin className="w-4 h-4" />
                                            <span>{creator.location}</span>
                                        </div>
                                    )}

                                    {/* Niches */}
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                        {creator.niches.map((niche) => (
                                            <span
                                                key={niche}
                                                className="px-3 py-1 rounded-full text-sm font-medium bg-pink-50 text-[#FF6B9D]"
                                            >
                                                {niche}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Bio */}
                                    {creator.bio && (
                                        <p className="text-gray-700 leading-relaxed">{creator.bio}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {creator.followers || '-'}
                                </p>
                                <p className="text-sm text-gray-600">Followers</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {creator.engagement || '-'}
                                </p>
                                <p className="text-sm text-gray-600">Engagement</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {creator.avgLikes?.toLocaleString('en-IN') || '-'}
                                </p>
                                <p className="text-sm text-gray-600">Avg. Likes</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{creator.pricing?.starting?.toLocaleString('en-IN') || '-'}
                                </p>
                                <p className="text-sm text-gray-600">Starting Price</p>
                            </div>
                        </div>

                        {/* Pricing */}
                        {creator.pricing && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {creator.pricing.reel && (
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-bold text-[#FF6B35]">
                                                ₹{creator.pricing.reel.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-sm text-gray-600">Per Reel</p>
                                        </div>
                                    )}
                                    {creator.pricing.story && (
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-bold text-[#FF6B35]">
                                                ₹{creator.pricing.story.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-sm text-gray-600">Per Story</p>
                                        </div>
                                    )}
                                    {creator.pricing.post && (
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-bold text-[#FF6B35]">
                                                ₹{creator.pricing.post.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-sm text-gray-600">Per Post</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center">
                            <Button
                                variant="primary"
                                className="bg-[#FF6B35] hover:bg-[#e05a2b] px-8"
                            >
                                Send Proposal
                            </Button>
                            <Button
                                variant="ghost"
                                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Save to Favorites
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </RouteGuard>
    );
}
