"use client";

import React, { useState, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthModal } from '@/components/AuthModal';
import { SmoothScroll } from './SmoothScroll';
import { Search } from 'lucide-react';
import HeroCreatorCard from './HeroCreatorCard';
import gsap from 'gsap';
import './LandingPage.css';

const LandingPage = () => {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  
  const mainRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setAuthModalTab('signup');
    setShowAuthModal(true);
  };

  const creators = [
    { name: 'Marik Moojen', niche: 'Tech', followers: '5M+', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop' },
    { name: 'Luwa Nanon', niche: 'Gaming', followers: '3.5M+', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop' },
    { name: 'Jenka', niche: 'Lifestyle', followers: '1.2M+', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop' },
    { name: 'Dolle Terren', niche: 'Beauty', followers: '800k+', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop' },
    { name: 'Zara', niche: 'Fashion', followers: '2.1M+', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=600&fit=crop' },
    { name: 'Netflix', niche: 'Ent.', followers: '12M+', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop' },
  ];

  useLayoutEffect(() => {
    if (!mainRef.current) return;

    const ctx = gsap.context(() => {
      // Hero Content Fade In
      gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
      });

      // Cards Stagger
      gsap.from(".hero-creator-card", {
        x: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.3
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroll>
      <div className="diagonal-landing-page" ref={mainRef}>
        <div className="mesh-gradient"></div>
        <div className="mesh-gradient-2"></div>

        <nav className="top-nav">
          <div className="logo">CreatorSync</div>
          <div className="nav-links">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Blog</a>
            <a href="#" className="nav-link" onClick={() => { setAuthModalTab('login'); setShowAuthModal(true); }}>Log in</a>
            <button className="nav-cta" onClick={handleGetStarted}>Get Started</button>
          </div>
        </nav>

        <main className="landing-container">
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                <span style={{ whiteSpace: 'nowrap' }}>Connect with the</span><br />
                <span style={{ whiteSpace: 'nowrap' }}>world's most</span><br />
                <span style={{ whiteSpace: 'nowrap' }}>impactful creators.</span>
              </h1>
              <p className="hero-description">
                CreatorSync is your new awareness and sales engine driven by creators who genuinely love your Brand.
              </p>
              
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Search creators by niche or name" 
                  className="search-input"
                />
              </div>

              <div className="hero-ctas">
                <button className="btn-primary" onClick={handleGetStarted}>Explore creators</button>
                <button className="btn-secondary" onClick={handleGetStarted}>Join as brand</button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="slanted-card-grid">
                {creators.map((creator, i) => (
                  <HeroCreatorCard 
                    key={i}
                    {...creator}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialTab={authModalTab}
        />
      </div>
    </SmoothScroll>
  );
};

export default LandingPage;
