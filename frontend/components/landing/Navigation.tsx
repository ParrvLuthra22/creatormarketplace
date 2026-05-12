"use client";

import React, { useState, useEffect } from 'react';

interface NavigationProps {
    status: 'available' | 'limited' | 'unavailable';
    onStatusChange?: (status: 'available' | 'limited' | 'unavailable') => void;
}

const Navigation = ({ status, onStatusChange }: NavigationProps) => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleString('en-US', {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const getStatusText = () => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-[80px] bg-black/70 backdrop-blur-[20px] border-b border-white/10 z-[1000] px-5 md:px-12 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="font-milker text-[24px] text-[#F5F1E8] tracking-[-0.5px]">
                CreatorSync
            </div>

            {/* Right: Time & Status & Auth */}
            <div className="flex items-center gap-6 md:gap-8">
                {/* Time - Hidden on mobile */}
                {currentTime && (
                    <div className="hidden md:block font-sf-pro text-[14px] text-white/60">
                        {formatTime(currentTime)}
                    </div>
                )}

                {/* Status Indicator */}
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => {
                        // Optional: Toggle status for demo purposes
                        if (onStatusChange) {
                            const next = status === 'available' ? 'limited' : status === 'limited' ? 'unavailable' : 'available';
                            onStatusChange(next);
                        }
                    }}
                >
                    <div className="relative flex items-center justify-center w-2.5 h-2.5">
                        <div
                            className="absolute w-2.5 h-2.5 rounded-full"
                            style={{
                                background: 'var(--status-color)',
                                boxShadow: '0 0 12px var(--status-color)'
                            }}
                        />
                        <div
                            className="absolute w-2.5 h-2.5 rounded-full animate-ping opacity-75"
                            style={{
                                background: 'var(--status-color)'
                            }}
                        />
                    </div>
                    <span
                        className="font-sf-pro text-[14px] font-medium transition-colors duration-300 hidden sm:inline-block"
                        style={{ color: 'var(--status-color)' }}
                    >
                        {getStatusText()}
                    </span>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        className="font-sf-pro text-[14px] font-medium text-white/80 hover:text-white transition-colors"
                        onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'login' } }))}
                    >
                        Log In
                    </button>
                    <button
                        className="hidden sm:block font-angelo text-[12px] uppercase tracking-wider font-bold bg-white text-black px-5 py-2 rounded-[4px] hover:bg-white/90 transition-colors"
                        onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'signup' } }))}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Mobile Menu Icon (still useful for future expansion) */}
                <div className="md:hidden text-white/80 cursor-pointer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
