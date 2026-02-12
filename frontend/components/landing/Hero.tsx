"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight } from "lucide-react";

interface HeroProps {
    status: 'available' | 'limited' | 'unavailable';
}

const Hero = ({ status }: HeroProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className={`relative z-10 flex flex-col justify-center items-center min-h-screen pt-[120px] px-6 md:px-12 pb-20 text-center pointer-events-none ${isLoaded ? 'loaded' : ''}`}>

            {/* 1. Small Heading */}
            <div className="font-angelo text-[13px] uppercase tracking-[3px] text-white/60 mb-4 opacity-0 translate-y-5 animate-[fadeSlideUp_1s_0.2s_forwards]">
                CONNECTING BRANDS & CREATORS
            </div>

            {/* 2. Tagline */}
            <div className="font-sf-pro text-[16px] text-white/70 leading-[1.6] max-w-[600px] mx-auto mb-8 opacity-0 translate-y-5 animate-[fadeSlideUp_1s_0.4s_forwards]">
                THOUGHTFUL DESIGN ACROSS<br />
                BRANDS, PRODUCTS, AND DIGITAL EXPERIENCES
            </div>

            {/* 3. Main Headline */}
            <h1 className="flex flex-col items-center justify-center font-milker text-[60px] md:text-[80px] xl:text-[120px] font-bold text-white leading-[0.95] tracking-[-1px] md:tracking-[-3px] uppercase max-w-[1200px] mx-auto mb-8 pointer-events-auto">
                <div className="opacity-0 translate-y-5 animate-[fadeSlideUp_1s_0.6s_forwards]">
                    CREATORS
                </div>
                <div className="opacity-0 translate-y-5 animate-[fadeSlideUp_1s_0.9s_forwards]">
                    MARKET<span className="transition-colors duration-800 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ color: 'var(--status-color)' }}>PLACE</span>
                </div>
            </h1>

            {/* 4. Subtitle */}
            <p className="font-sf-pro text-[18px] text-white/60 leading-[1.6] max-w-[700px] mx-auto mb-12 opacity-0 translate-y-5 animate-[fadeSlideUp_1s_1.2s_forwards]">
                WE HELP IDEAS BECOME CLEAR, USABLE, AND BEAUTIFULLY CRAFTED
            </p>

            {/* 5. CTA Button */}
            <button
                className="pointer-events-auto opacity-0 scale-90 animate-[fadeScale_1s_1.5s_forwards] font-angelo text-[14px] uppercase tracking-[2px] font-semibold py-[18px] px-[48px] rounded-[4px] border-[2px] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5"
                style={{
                    backgroundColor: 'var(--status-color)',
                    borderColor: 'var(--status-color)',
                    color: '#000000',
                    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--status-color)';
                    e.currentTarget.style.boxShadow = `0 8px 24px var(--status-color-light)`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--status-color)';
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <span className="flex items-center gap-2">
                    GET STARTED
                    {/* <ArrowRight className="w-4 h-4" /> */}
                </span>
            </button>

            {/* Global CSS for Keyframes if not present in globals.css */}
            <style jsx global>{`
        @keyframes fadeSlideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default Hero;
