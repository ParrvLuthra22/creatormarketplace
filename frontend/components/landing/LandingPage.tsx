"use client";

import React, { useState, useEffect } from 'react';
import CreatorCardFloat from './CreatorCardFloat';
import { AuthModal } from '@/components/AuthModal';
import './LandingPage.css';

// Type definition for particlesJS
declare global {
    interface Window {
        particlesJS: (id: string, config: any) => void;
    }
}

const LandingPage = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

    // Featured creators data
    const featuredCreators = [
        {
            id: 1,
            name: 'priya sharma',
            instagramHandle: 'priyasharma',
            profilePicture: '',
            followers: 125000,
            following: 847
        },
        {
            id: 2,
            name: 'alex chen',
            instagramHandle: 'alexcreates',
            profilePicture: '',
            followers: 89000,
            following: 632
        },
        {
            id: 3,
            name: 'maya patel',
            instagramHandle: 'mayastyle',
            profilePicture: '',
            followers: 210000,
            following: 1200
        },
        {
            id: 4,
            name: 'james wilson',
            instagramHandle: 'jameswilson',
            profilePicture: '',
            followers: 156000,
            following: 923
        }
    ];

    // Initialize Particle.js
    useEffect(() => {
        // Check if window exists and particlesJS is loaded
        if (typeof window !== 'undefined' && window.particlesJS) {
            window.particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
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
                            speed: 0.5,
                            opacity_min: 0.05,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#F5F1E8',
                        opacity: 0.1,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
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
                            distance: 200,
                            line_linked: {
                                opacity: 0.4
                            }
                        },
                        push: {
                            particles_nb: 4
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
            </section>

            {/* Scroll Indicator (optional) */}
            <div className="scroll-indicator">
                <span className="scroll-text">scroll</span>
                <div className="scroll-line"></div>
            </div>

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
