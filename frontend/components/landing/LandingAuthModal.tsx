"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './LandingAuthModal.css';

interface LandingAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'signup';
}

const LandingAuthModal: React.FC<LandingAuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
    const router = useRouter();

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab, isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={handleBackdropClick}>
            <div className="auth-modal">
                <button className="close-button" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                <div className="auth-tabs">
                    <button
                        className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        login
                    </button>
                    <button
                        className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        signup
                    </button>
                </div>

                {activeTab === 'login' ? (
                    <div className="auth-content">
                        <h2>welcome back</h2>
                        <p>login to continue to creatorsync</p>

                        <button
                            className="auth-action-button"
                            onClick={() => router.push('/signin')}
                        >
                            go to login
                        </button>
                    </div>
                ) : (
                    <div className="auth-content">
                        <h2>join creatorsync</h2>
                        <p>create your account to get started</p>

                        <div className="signup-options">
                            <button
                                className="auth-action-button"
                                onClick={() => router.push('/signup?type=creator')}
                            >
                                join as creator
                            </button>
                            <button
                                className="auth-action-button secondary"
                                onClick={() => router.push('/signup?type=brand')}
                            >
                                join as brand
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingAuthModal;
