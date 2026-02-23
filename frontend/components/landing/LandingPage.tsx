"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreatorCardFloat from './CreatorCardFloat';
import { AuthModal } from '@/components/AuthModal';
import './LandingPage.css';

declare global {
    interface Window {
        particlesJS: (id: string, config: any) => void;
    }
}

const LandingPage = () => {
    const router = useRouter();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

    // Featured creators data (8 cards for better coverage)
    const featuredCreators = [
        {
            id: 1,
            name: 'priya sharma',
            instagramHandle: 'priyasharma',
            profilePicture: null,
            followers: 125000,
            following: 847,
            isPremium: true
        },
        {
            id: 2,
            name: 'maya patel',
            instagramHandle: 'mayastyle',
            profilePicture: null,
            followers: 210000,
            following: 1200,
            isPremium: true
        },
        {
            id: 3,
            name: 'alex chen',
            instagramHandle: 'alexcreates',
            profilePicture: null,
            followers: 89000,
            following: 632,
            isPremium: false
        },
        {
            id: 4,
            name: 'james wilson',
            instagramHandle: 'jameswilson',
            profilePicture: null,
            followers: 156000,
            following: 923,
            isPremium: false
        },
        {
            id: 5,
            name: 'sara jones',
            instagramHandle: 'sarajones',
            profilePicture: null,
            followers: 98000,
            following: 512,
            isPremium: true
        },
        {
            id: 6,
            name: 'rahul kumar',
            instagramHandle: 'rahulk',
            profilePicture: null,
            followers: 67000,
            following: 401,
            isPremium: false
        },
        {
            id: 7,
            name: 'lisa brown',
            instagramHandle: 'lisab',
            profilePicture: null,
            followers: 45000,
            following: 289,
            isPremium: false
        },
        {
            id: 8,
            name: 'kevin lee',
            instagramHandle: 'kevinl',
            profilePicture: null,
            followers: 78000,
            following: 356,
            isPremium: false
        }
    ];

    // Initialize Particle.js
    useEffect(() => {
        if (typeof window !== 'undefined' && window.particlesJS) {
            window.particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 100,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#F5F1E8'
                    },
                    shape: {
                        type: 'circle'
                    },
                    opacity: {
                        value: 0.2,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 0.3,
                            opacity_min: 0.05,
                            sync: false
                        }
                    },
                    size: {
                        value: 2.5,
                        random: true
                    },
                    line_linked: {
                        enable: true,
                        distance: 130,
                        color: '#F5F1E8',
                        opacity: 0.1,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: 'none',
                        random: true,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: {
                            enable: true,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'grab'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 160,
                            line_linked: {
                                opacity: 0.3
                            }
                        },
                        push: {
                            particles_nb: 3
                        }
                    }
                },
                retina_detect: true
            });
        }
    }, []);

    const handleCreatorSignup = () => {
        setAuthModalTab('signup');
        setShowAuthModal(true);
    };

    const handleBrandSignup = () => {
        setAuthModalTab('signup');
        setShowAuthModal(true);
    };

    const handleGetStarted = () => {
        setAuthModalTab('signup');
        setShowAuthModal(true);
    };

    return (
        <div className="landing-page">
            {/* Particles Background */}
            <div id="particles-js"></div>

            {/* Gradient Orbs (very subtle) */}
            <div className="gradient-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            {/* Floating Creator Cards */}
            <div className="floating-cards">
                {featuredCreators.map((creator, index) => (
                    <CreatorCardFloat
                        key={creator.id}
                        creator={creator}
                        index={index}
                        onCardClick={() => {
                            setAuthModalTab('login');
                            setShowAuthModal(true);
                        }}
                    />
                ))}
            </div>

            {/* Top Navigation */}
            <nav className="top-nav">
                <div className="logo">creatorsync</div>

                <div className="nav-links">
                    <a href="#features">features</a>
                    <a href="#pricing">pricing</a>
                    <a href="#contact">contact</a>
                </div>

                <button className="nav-cta" onClick={handleGetStarted}>
                    get started
                </button>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <span className="hero-badge">connecting creators & brands</span>

                <h1 className="hero-headline">
                    where creators<br />meet brands
                </h1>

                <p className="hero-subtext">
                    authentic collaborations, seamless partnerships, real results.
                    join the marketplace built for modern creators.
                </p>

                <div className="hero-buttons">
                    <button className="primary-button" onClick={handleCreatorSignup}>
                        join as creator
                    </button>
                    <button className="secondary-button" onClick={handleBrandSignup}>
                        i'm a brand
                    </button>
                </div>

                {/* Floating Stats */}
                <div className="floating-stats">
                    <div className="stat-bubble">
                        <div className="stat-number">2,400+</div>
                        <div className="stat-label">creators</div>
                    </div>
                    <div className="stat-bubble">
                        <div className="stat-number">850+</div>
                        <div className="stat-label">brands</div>
                    </div>
                    <div className="stat-bubble">
                        <div className="stat-number">12k+</div>
                        <div className="stat-label">collabs</div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <span className="scroll-text">explore</span>
                    <div className="scroll-line"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🤝</div>
                        <h3 className="feature-title">seamless matching</h3>
                        <p className="feature-text">
                            AI-powered algorithm connects brands with creators who genuinely align with their vision.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💳</div>
                        <h3 className="feature-title">secure payments</h3>
                        <p className="feature-text">
                            Integrated Razorpay ensures safe, instant transactions with full transparency.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">real-time analytics</h3>
                        <p className="feature-text">
                            Track campaign performance, engagement metrics, and ROI all in one dashboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialTab={authModalTab}
            />
        </div>
    );
};

export default LandingPage;
