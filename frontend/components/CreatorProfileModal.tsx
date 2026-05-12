"use client";

import { useEffect, useState } from "react";
import { X, Share2 as Instagram, ExternalLink, Play, Pause } from "lucide-react";
import { Button } from "./ui/Button";
import { Creator, BrandWork } from "@/lib/data";

interface CreatorProfileModalProps {
    creator: Creator | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CreatorProfileModal({ creator, isOpen, onClose }: CreatorProfileModalProps) {
    const [playingVideo, setPlayingVideo] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Optional: Update URL without navigation
            if (creator) {
                window.history.pushState(null, "", `/creator/${creator.username}`);
            }
        } else {
            document.body.style.overflow = "unset";
            // Restore URL
            window.history.pushState(null, "", "/");
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, creator]);

    if (!isOpen || !creator) return null;

    const availabilityColors = {
        available: "bg-green-500",
        limited: "bg-orange-500",
        unavailable: "bg-red-500"
    };

    const availabilityText = {
        available: "Available for collaborations",
        limited: "Limited availability",
        unavailable: "Not available currently"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-[1000px] bg-white md:rounded-3xl rounded-t-3xl shadow-2xl h-[90vh] md:h-[85vh] overflow-hidden flex flex-col pointer-events-auto transform transition-transform duration-300 animate-in slide-in-from-bottom-10 fade-in">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white text-gray-500 transition-colors shadow-sm"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">

                    {/* Header Section */}
                    <div className="p-6 md:p-10 pb-0 flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                                <img src={creator.photo} alt={creator.name} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">
                                        {creator.name}
                                    </h2>
                                    <a
                                        href={`https://instagram.com/${creator.handle.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#E1306C] transition-colors font-medium"
                                    >
                                        <Instagram className="w-5 h-5" />
                                        {creator.handle}
                                        <ExternalLink className="w-3 h-3 opacity-50" />
                                    </a>
                                </div>

                                <Button
                                    className="bg-[#FF6B35] hover:bg-[#ff8c61] text-white shadow-lg shadow-orange-500/20 rounded-full px-8 py-6 text-lg"
                                    onClick={() => alert("Proposal form coming soon!")}
                                >
                                    Contact Creator
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {creator.niches.map((niche) => (
                                    <span
                                        key={niche}
                                        className="px-4 py-1.5 rounded-full text-sm font-semibold bg-orange-50 text-orange-700 border border-orange-100"
                                    >
                                        {niche}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="px-6 md:px-10 py-8">
                        <div className="bg-gray-50 rounded-md p-6 flex flex-wrap md:flex-nowrap gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                            <div className="flex-1 px-4 text-center md:text-left">
                                <p className="text-2xl font-bold text-[#1A1A1A]">{creator.followers}</p>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Followers</p>
                            </div>
                            <div className="flex-1 px-4 pt-4 md:pt-0 text-center md:text-left">
                                <p className="text-2xl font-bold text-[#1A1A1A]">{creator.engagement}</p>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Avg. Engagement</p>
                            </div>
                            <div className="flex-1 px-4 pt-4 md:pt-0 flex flex-col justify-center items-center md:items-start">
                                <div className="flex gap-2 mb-1">
                                    {creator.contentFormats.map(fmt => (
                                        <span key={fmt} className="px-2 py-1 rounded-md bg-white border border-gray-200 text-xs font-semibold text-gray-700">
                                            {fmt}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Formats</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md:px-10 pb-12 grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Left Column: Brand Work (2/3 width on desktop) */}
                        <div className="md:col-span-2 space-y-8">
                            <h3 className="text-2xl font-bold text-[#1A1A1A]">Past Brand Collaborations</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {creator.brandWork.length > 0 ? (
                                    creator.brandWork.map((work, idx) => (
                                        <div
                                            key={idx}
                                            className="group bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                                            onMouseEnter={() => work.videoUrl && setPlayingVideo(idx)}
                                            onMouseLeave={() => setPlayingVideo(null)}
                                        >
                                            <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden">
                                                {work.videoUrl ? (
                                                    <video
                                                        src={work.videoUrl}
                                                        className="w-full h-full object-cover"
                                                        loop
                                                        muted
                                                        playsInline
                                                        ref={(el) => {
                                                            if (el) {
                                                                playingVideo === idx ? el.play().catch(() => { }) : el.pause();
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <img src={work.thumbnailUrl || "/api/placeholder/400/600"} alt={work.brandName} className="w-full h-full object-cover" />
                                                )}

                                                <div className="absolute top-3 left-3">
                                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full">
                                                        {work.contentType}
                                                    </span>
                                                </div>

                                                {!work.videoUrl && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ExternalLink className="text-white w-8 h-8 drop-shadow-lg" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <h4 className="font-bold text-lg text-[#1A1A1A]">{work.brandName}</h4>
                                                <a href={work.instagramLink} className="text-sm text-[#FF6B35] font-medium hover:underline inline-flex items-center gap-1 mt-1">
                                                    View on Instagram <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full p-8 text-center bg-gray-50 rounded-md border border-dashed border-gray-200">
                                        <p className="text-gray-500">No public brand collaborations listed yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Pricing & Availability (1/3 width) */}
                        <div className="space-y-6">

                            {/* Pricing Card */}
                            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-md p-6 border border-orange-100">
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Collaboration Pricing</h3>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Starting From</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-[#1A1A1A]">₹{creator.pricing.starting.toLocaleString()}</span>
                                        <span className="text-gray-500 font-medium">/{creator.pricing.per}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">
                                    Custom packages available for long-term partnerships and mixed content formats.
                                </p>
                                <Button className="w-full bg-white text-[#FF6B35] border border-orange-200 hover:bg-orange-50">
                                    Request Rate Card
                                </Button>
                            </div>

                            {/* Availability Status */}
                            <div className="bg-white rounded-md p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Current Status</h3>
                                <div className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full ${availabilityColors[creator.availability]} animate-pulse`} />
                                    <span className="font-medium text-[#1A1A1A]">{availabilityText[creator.availability]}</span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
