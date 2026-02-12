"use client";

import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import VideoGrid from './VideoGrid';
import Hero from './Hero';

import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { useRouter } from "next/navigation";

// Define the color map based on status
const STATUS_COLORS = {
    available: '#00D084', // Green
    limited: '#FFB020',   // Yellow
    unavailable: '#FF4757' // Red
};

const LandingPage = () => {
    const [status, setStatus] = useState<'available' | 'limited' | 'unavailable'>('available');
    const { user, isBrand, isCreator, loading, modalState, setModalState } = useAuth();
    const router = useRouter();

    // Video placeholders - duplicates to fill the grid
    // In a real app, these would be paths to different video files
    const videos = [
        '/reel1.mp4',
        '/reel2.mp4',
        '/reel3.mp4',
        '/reel4.mp4',
    ];

    useEffect(() => {
        // Update CSS variables for the color system
        const color = STATUS_COLORS[status];
        const root = document.documentElement;

        root.style.setProperty('--status-color', color);

    }, [status]);

    // Handle redirection if user is already logged in
    useEffect(() => {
        if (!loading && user) {
            if (isBrand) {
                router.push('/dashboard/brand');
            } else if (isCreator) {
                router.push('/dashboard/creator');
            }
        }
    }, [user, isBrand, isCreator, loading, router]);

    // Listen for custom events from Navigation to open auth modal
    useEffect(() => {
        const handleOpenAuth = (e: CustomEvent) => {
            setModalState(e.detail.mode);
        };

        window.addEventListener('openAuthModal', handleOpenAuth as EventListener);
        return () => window.removeEventListener('openAuthModal', handleOpenAuth as EventListener);
    }, [setModalState]);

    const handleCloseModal = () => {
        setModalState(null);
    };

    // If loading or redirecting, we can show a loader or just render the page (it will redirect quickly)
    // For a smoother experience, we might want to show a loader if we are sure they are logged in,
    // but since this is a public landing page, rendering it first is fine.

    return (
        <div className="relative min-h-screen bg-black overflow-hidden selection:bg-[var(--status-color)] selection:text-black">
            <VideoGrid videos={videos} />
            <Navigation status={status} onStatusChange={setStatus} />
            <Hero status={status} />

            {/* Auth Modal (Login/Signup) */}
            <AuthModal
                isOpen={modalState === 'login' || modalState === 'signup'}
                onClose={handleCloseModal}
                initialTab={modalState === 'login' ? 'login' : 'signup'}
            />
        </div>
    );
};

export default LandingPage;
