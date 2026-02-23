"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthModal } from '@/components/AuthModal';
import './LandingPage.css';

const LandingPage = () => {
    const router = useRouter();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = 500;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

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

    const handleLogin = () => {
        setAuthModalTab('login');
        setShowAuthModal(true);
    };

    return (
        <div className="landing-page">
            {/* Top Navigation */}
            <nav className="top-nav">
                <div className="logo-container">
                    <div className="logo">#CreatorSync</div>
                </div>

                <div className="nav-links">
                    <a href="#brands">Brands</a>
                    <span className="dot">•</span>
                    <a href="#creators">Creators</a>
                </div>

                <div className="nav-actions">
                    <button className="nav-login" onClick={handleLogin}>
                        Log In <span className="dot-small">•</span>
                    </button>
                    <button className="nav-cta" onClick={handleGetStarted}>
                        Get Started <span className="arrow">→</span>
                    </button>
                </div>
            </nav>

            <main>
                {/* Split Hero Section */}
                <section className="hero-section">
                    <div className="container hero-container">
                        <div className="hero-content">
                            <div className="hero-badge">A marketplace for creators and brands</div>
                            <h1 className="hero-headline">
                                Creators<br />
                                and brands<br />
                                meet here
                            </h1>
                            <p className="hero-subtext">
                                Whether you're a creator looking for your next brand deal, or a marketer hiring creators for your next campaign, you'll find them on CreatorSync's creator marketplace.
                            </p>

                            <button className="primary-button hero-cta" onClick={handleGetStarted}>
                                Get Started
                            </button>

                            <div className="trust-badge">
                                <div className="stars" style={{ color: '#FFB800' }}>
                                    <span className="star-icon">★</span>
                                    <span className="star-icon">★</span>
                                    <span className="star-icon">★</span>
                                    <span className="star-icon">★</span>
                                    <span className="star-icon">★</span>
                                </div>
                                <span className="trust-text">Trusted by thousands</span>
                            </div>
                        </div>

                        <div className="hero-visual">
                            {/* Column 1: Scrolls Up */}
                            <div className="collage-column col-up">
                                <div className="collage-track">
                                    {/* Original Content */}
                                    <div className="img-wrapper shape-1" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1544211155-276943fcf3e8?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@doglife</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-2" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@styleicon</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-3" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1510832198440-a52376950479?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@vintagedolls</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-4" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@fashionnova</div>
                                        </div>
                                    </div>

                                    {/* Duplicated for infinite scroll illusion */}
                                    <div className="img-wrapper shape-1" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1544211155-276943fcf3e8?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@doglife</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-2" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@styleicon</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-3" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1510832198440-a52376950479?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@vintagedolls</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-4" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@fashionnova</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Scrolls Down */}
                            <div className="collage-column col-down">
                                <div className="collage-track">
                                    {/* Original Content */}
                                    <div className="img-wrapper shape-5" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=500" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@theglife</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-6" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@urbanstyle</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-7" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@dailyglam</div>
                                        </div>
                                    </div>

                                    {/* Duplicated for infinite scroll illusion */}
                                    <div className="img-wrapper shape-5" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=500" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@theglife</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-6" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@urbanstyle</div>
                                        </div>
                                    </div>
                                    <div className="img-wrapper shape-7" onClick={handleGetStarted}>
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" alt="Creator" />
                                        <div className="img-hover-content">
                                            <div className="creator-tag">@dailyglam</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Centered Banner */}
                <section className="centered-banner">
                    <div className="container banner-container">
                        <h2>
                            Find creators and brands to<br />
                            collaborate with. It's never<br />
                            been easier.
                        </h2>
                    </div>
                </section>

                {/* Feature 1: Match (Text Left, Image Right) */}
                <section className="feature-section match-feature">
                    <div className="container feature-container">
                        <div className="feature-content">
                            <div className="feature-pill pill-yellow">Match</div>
                            <h2>Meet the right<br />partner</h2>
                            <p>
                                If you're looking for brands and creators to collaborate with, you'll find them on #CreatorSync. We study what makes for a successful match, so finding each other is easy.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="feature-image-wrapper">
                                <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=800" alt="Concert/Event" className="main-feature-img" />
                                <div className="ui-mockup list-mockup">
                                    <div className="mockup-item">
                                        <div className="mockup-avatar avatar-1"></div>
                                        <div className="mockup-lines">
                                            <div className="line short yellow"></div>
                                            <div className="line long"></div>
                                        </div>
                                        <div className="mockup-checkbox checked">✓</div>
                                    </div>
                                    <div className="mockup-item">
                                        <div className="mockup-avatar avatar-2"></div>
                                        <div className="mockup-lines">
                                            <div className="line medium"></div>
                                        </div>
                                        <div className="mockup-checkbox checked">✓</div>
                                    </div>
                                    <div className="mockup-item">
                                        <div className="mockup-avatar avatar-3"></div>
                                        <div className="mockup-lines">
                                            <div className="line medium"></div>
                                        </div>
                                        <div className="mockup-checkbox checked">✓</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 2: Strategy (Text Right, Image Left) */}
                <section className="feature-section reverse-layout strategy-feature">
                    <div className="container feature-container">
                        <div className="feature-content">
                            <div className="feature-pill pill-yellow">Strategy</div>
                            <h2>Expert creative</h2>
                            <p>
                                Brands and creators collaborate with our dedicated team of experts to build winning creative strategy—backed by research, first-party data, and industry benchmarks.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="feature-image-wrapper shape-square">
                                <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800" alt="Backpack/Outdoor" className="main-feature-img" />
                                <div className="ui-mockup pie-mockup">
                                    <div className="mockup-header">
                                        <div className="mockup-lines">
                                            <div className="line title"></div>
                                            <div className="line subtitle"></div>
                                        </div>
                                    </div>
                                    <div className="pie-chart"></div>
                                </div>
                                <div className="ui-mockup video-mockup">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" alt="Creator Video Profile" />
                                    <div className="video-tag">
                                        <span className="dot-green"></span>
                                        Cassie Jung
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Measure (Dark Background, Text Left, Image Right) */}
                <section className="feature-section measure-feature dark-section">
                    <div className="container feature-container">
                        <div className="feature-content dark-content">
                            <div className="feature-pill pill-yellow">Measure</div>
                            <h2>Understand what's<br />working—and why</h2>
                            <p>
                                No more guessing. Learn what content and creative elements resonate best with your audience and why. With live reporting and post-campaign insights, you have the tools to make every campaign better.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="feature-image-wrapper shape-large-square">
                                <img src="https://images.unsplash.com/photo-1601158935942-52255782d322?auto=format&fit=crop&q=80&w=800" alt="Friends laughing" className="main-feature-img" />
                                <div className="ui-mockup chart-mockup">
                                    <div className="chart-header">
                                        <div className="chart-title">Store Traffic</div>
                                        <div className="chart-stat">↑ 23%</div>
                                    </div>
                                    <div className="bar-chart-container">
                                        <div className="bar light-blue"></div>
                                        <div className="bar accent-blue"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 4: Repurpose (Text Right, Image Left) */}
                <section className="feature-section reverse-layout repurpose-feature">
                    <div className="container feature-container">
                        <div className="feature-content">
                            <div className="feature-pill pill-yellow">Repurpose</div>
                            <h2>Use your campaign<br />content<br />everywhere</h2>
                            <p>
                                Take the best-performing creator content and use it across different marketing channels, like out-of-home, print, and in-flight entertainment.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="feature-image-wrapper shape-large-square">
                                <img src="https://images.unsplash.com/photo-1503376712341-ea4020a59b6b?auto=format&fit=crop&q=80&w=800" alt="Car Headlights" className="main-feature-img" />
                                <div className="ui-mockup select-mockup">
                                    <div className="mockup-title">Offline Usage</div>
                                    <div className="select-item active">
                                        <div className="mockup-checkbox checked">✓</div>
                                        <span className="label">Print</span>
                                    </div>
                                    <div className="select-item active">
                                        <div className="mockup-checkbox checked">✓</div>
                                        <span className="label">Out of Home</span>
                                    </div>
                                    <div className="select-item active">
                                        <div className="mockup-checkbox checked">✓</div>
                                        <span className="label">Cinema</span>
                                    </div>
                                    <div className="select-item active">
                                        <div className="mockup-checkbox checked">✓</div>
                                        <span className="label">In-Game</span>
                                    </div>
                                    <div className="select-item disabled">
                                        <div className="mockup-checkbox"></div>
                                        <div className="line"></div>
                                    </div>
                                    <div className="select-item disabled">
                                        <div className="mockup-checkbox"></div>
                                        <div className="line short"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



                {/* Feature 2: Strategy (Text Right, Image Left) */}
                <section className="feature-section reverse-layout strategy-feature">
                    <div className="container feature-container">
                        <div className="feature-content">
                            <div className="feature-pill pill-yellow">Strategy</div>
                            <h2>Expert creative</h2>
                            <p>
                                Brands and creators collaborate with our dedicated team of experts to build winning creative strategy—backed by research, first-party data, and industry benchmarks.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="feature-image-wrapper shape-square">
                                <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800" alt="Backpack/Outdoor" className="main-feature-img" />
                                <div className="ui-mockup pie-mockup">
                                    <div className="mockup-header">
                                        <div className="mockup-lines">
                                            <div className="line title"></div>
                                            <div className="line subtitle"></div>
                                        </div>
                                    </div>
                                    <div className="pie-chart"></div>
                                </div>
                                <div className="ui-mockup video-mockup">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" alt="Creator Video Profile" />
                                    <div className="video-tag">
                                        <span className="dot-green"></span>
                                        Cassie Jung
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Measure (Dark Background, Text Left, Image Right) */}
                <section className="feature-section measure-feature dark-section">
                    <div className="container feature-container">
                        <div className="feature-content dark-content">
                            <div className="feature-pill pill-yellow">Measure</div>
                            <h2>Understand what's<br />working—and why</h2>
                            <p>
                                No more guessing. Learn what content and creative elements resonate best with your audience and why. With live reporting and post-campaign insights, you have the tools to make every campaign better.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="feature-image-wrapper shape-large-square">
                                <img src="https://images.unsplash.com/photo-1601158935942-52255782d322?auto=format&fit=crop&q=80&w=800" alt="Friends laughing" className="main-feature-img" />
                                <div className="ui-mockup chart-mockup">
                                    <div className="chart-header">
                                        <div className="chart-title">Store Traffic</div>
                                        <div className="chart-stat">↑ 23%</div>
                                    </div>
                                    <div className="bar-chart-container">
                                        <div className="bar light-blue"></div>
                                        <div className="bar accent-blue"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 4: Repurpose (Text Right, Image Left) */}
                <section className="feature-section reverse-layout repurpose-feature">
                    <div className="container feature-container">
                        <div className="feature-content">
                            <div className="feature-pill pill-yellow">Repurpose</div>
                            <h2>Use your campaign<br />content<br />everywhere</h2>
                            <p>
                                Take the best-performing creator content and use it across different marketing channels, like out-of-home, print, and in-flight entertainment.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="feature-image-wrapper shape-large-square">
                                <img src="https://images.unsplash.com/photo-1503376712341-ea4020a59b6b?auto=format&fit=crop&q=80&w=800" alt="Car Headlights" className="main-feature-img" />
                                <div className="ui-mockup select-mockup">
                                    <div className="mockup-title">Offline Usage</div>
                                    <div className="select-item active">
                                        <div className="mockup-checkbox checked">✓</div>
                                        <span className="label">Print</span>
                                    </div>
                                    <div className="select-item active">
                                        <div className="mockup-checkbox checked">✓</div>
                                        <span className="label">Out of Home</span>
                                    </div>
                                    <div className="select-item active">
                                        <div className="mockup-checkbox checked">✓</div>
                                        <span className="label">Cinema</span>
                                    </div>
                                    <div className="select-item active">
                                        <div className="mockup-checkbox checked">✓</div>
                                        <span className="label">In-Game</span>
                                    </div>
                                    <div className="select-item disabled">
                                        <div className="mockup-checkbox"></div>
                                        <div className="line"></div>
                                    </div>
                                    <div className="select-item disabled">
                                        <div className="mockup-checkbox"></div>
                                        <div className="line short"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial Section Placeholder */}
                <section className="testimonials-section">
                    <div className="container testimonials-container">
                        <div className="testimonials-header">
                            <h2>Creators love #CreatorSync</h2>
                            <div className="carousel-controls">
                                <button className="carousel-btn prev" onClick={() => scrollCarousel('left')}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                </button>
                                <button className="carousel-btn next" onClick={() => scrollCarousel('right')}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </button>
                            </div>
                        </div>
                        <div className="testimonials-carousel" ref={carouselRef}>
                            <div className="testimonial-card">
                                <blockquote>
                                    "On #CreatorSync I'm able to partner with incredible brands that allow me to be creative and use my voice and style when it comes to creating content that I know will resonate with my audience and make an impact."
                                </blockquote>
                                <div className="testimonial-author">
                                    <div className="author-photo">
                                        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" alt="Creator" />
                                    </div>
                                    <div className="author-info">
                                        <span className="name">Ilana Dunn</span>
                                        <span className="handle">— @seeingotherpeople</span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-card">
                                <blockquote>
                                    "They take care of the details so I can focus on what I do best—creating content."
                                </blockquote>
                                <div className="testimonial-author">
                                    <div className="author-photo">
                                        <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80" alt="Creator" />
                                    </div>
                                    <div className="author-info">
                                        <span className="name">Conor M</span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-card">
                                <blockquote>
                                    "I've been able to connect with my dream brands seamlessly. The tools are so intuitive, it's changed how I work."
                                </blockquote>
                                <div className="testimonial-author">
                                    <div className="author-photo">
                                        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80" alt="Creator" />
                                    </div>
                                    <div className="author-info">
                                        <span className="name">Sarah J.</span>
                                        <span className="handle">— @sarahstyles</span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-card">
                                <blockquote>
                                    "The best platform for creators who want serious brand partnerships without the hassle of endless emails."
                                </blockquote>
                                <div className="testimonial-author">
                                    <div className="author-photo">
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" alt="Creator" />
                                    </div>
                                    <div className="author-info">
                                        <span className="name">David Lee</span>
                                        <span className="handle">— @davidshoots</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

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
