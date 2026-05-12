"use client";

import React, { useState, useRef, useEffect } from 'react';

interface VideoTileProps {
    videoSrc: string;
    index: number;
}

const VideoTile = ({ videoSrc, index }: VideoTileProps) => {
    const [isHovered, setIsHovered] = useState(false);
    // Video ref for playback control
    const videoRef = useRef<HTMLVideoElement>(null);

    // Control playback based on hover state
    useEffect(() => {
        if (videoRef.current) {
            if (isHovered) {
                videoRef.current.play().catch(() => { });
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // Reset on mouse leave
            }
        }
    }, [isHovered]);

    return (
        <div
            className="relative w-full h-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
                zIndex: isHovered ? 2 : 1,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isHovered ? '0 0 40px rgba(0,0,0,0.8)' : 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <video
                ref={videoRef}
                src={videoSrc}
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                    filter: isHovered ? 'grayscale(0%) blur(0px)' : 'grayscale(100%) blur(4px)',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                }}
            />

            <div
                className="absolute inset-0 transition-opacity duration-600 ease-out pointer-events-none mix-blend-overlay"
                style={{
                    background: 'radial-gradient(circle, transparent 0%, var(--status-color) 100%)',
                    opacity: isHovered ? 0.4 : 0
                }}
            />
        </div>
    );
};

interface VideoGridProps {
    videos: string[];
}

const VideoGrid = ({ videos }: VideoGridProps) => {
    // Determining grid size
    const gridSize = 64;

    // State to hold cached Blob URLs for each video source
    const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchAndCacheVideos = async () => {
            const cache: Record<string, string> = {};

            // Unique videos to fetch
            const uniqueVideos = Array.from(new Set(videos));

            await Promise.all(uniqueVideos.map(async (src) => {
                try {
                    const response = await fetch(src);
                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    cache[src] = objectUrl;
                } catch (error) {
                    console.error(`Failed to load video ${src}:`, error);
                    // Fallback to original URL if fetch fails
                    cache[src] = src;
                }
            }));

            setBlobUrls(cache);
        };

        if (videos.length > 0) {
            fetchAndCacheVideos();
        }

        // Cleanup function to revoke Object URLs
        return () => {
            Object.values(blobUrls).forEach(url => URL.revokeObjectURL(url));
        };
    }, [videos]); // Only re-run if video list changes

    const gridVideos = Array(gridSize).fill(null).map((_, i) => {
        // Create a staggering pattern to avoid vertical stripes
        const rowOffset = Math.floor(i / 8);
        const originalSrc = videos[(i + rowOffset) % videos.length] || '';
        // Use the blob URL if available, otherwise fallback to original
        return blobUrls[originalSrc] || originalSrc;
    });

    return (
        <div className="fixed inset-0 grid z-[1] overflow-hidden bg-black grid-cols-4 grid-rows-4 md:grid-cols-6 md:grid-rows-6 xl:grid-cols-8 xl:grid-rows-8 gap-0">
            {gridVideos.map((videoSrc, index) => (
                <VideoTile
                    key={`${index}-${videoSrc}`} // Re-render if source changes
                    videoSrc={videoSrc}
                    index={index}
                />
            ))}
        </div>
    );
};

export default VideoGrid;
