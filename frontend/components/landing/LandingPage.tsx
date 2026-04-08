"use client";

import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { SmoothScroll } from './SmoothScroll';
import { Search } from 'lucide-react';
import HeroCreatorCard from './HeroCreatorCard';
import gsap from 'gsap';
import './LandingPage.css';

const LandingPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  
  const mainRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setAuthModalTab('signup');
    setShowAuthModal(true);
  };

  const handleSearchClick = () => {
    if (!user) {
      setAuthModalTab('login');
      setShowAuthModal(true);
    }
  };

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
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
            <a href="#about" className="nav-link" onClick={scrollToAbout}>About us</a>
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
              
              <div className="search-container" onClick={handleSearchClick}>
                <input 
                  type="text" 
                  placeholder="Search creators by niche or name" 
                  className="search-input"
                  readOnly={!user}
                />
                <button className="search-btn" type="button" onClick={handleSearchClick}>
                  <Search size={18} />
                </button>
              </div>

              <div className="hero-ctas">
                <button className="btn-primary" onClick={handleGetStarted}>Get Started</button>
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

        <section id="about" className="about-section">
          <div className="about-content">
            <h2 className="about-title">About CreatorSync</h2>
            <p className="about-text">
              CreatorSync is your new awareness and sales engine driven by
              Creators who genuinely love your Brand. We connect thousands
              of verified creators with brands for authentic collaborations
              that actually convert.
            </p>
            <div className="about-stats">
              <div className="about-stat">
                <h3>2,400+</h3>
                <p>Creators</p>
              </div>
              <div className="about-stat">
                <h3>850+</h3>
                <p>Brands</p>
              </div>
              <div className="about-stat">
                <h3>12,000+</h3>
                <p>Collaborations</p>
              </div>
            </div>
            <button className="btn-primary about-cta" onClick={handleGetStarted}>
              Join CreatorSync Free
            </button>
          </div>
        </section>

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
