"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface HeroCreatorCardProps {
    name: string;
    niche: string;
    followers: string;
    image: string;
    isVerified?: boolean;
}

const HeroCreatorCard = ({ name, niche, followers, image, isVerified = true }: HeroCreatorCardProps) => {
    return (
        <div className="hero-creator-card">
            <div className="card-img-container">
                <img src={image} alt={name} />
            </div>
            <div className="card-info">
                <p className="card-name">{name}</p>
                <div className="card-meta">
                    <div className="card-niche">
                        {niche}
                        {isVerified && (
                            <div className="verified-pill">
                                <Check size={8} strokeWidth={4} />
                            </div>
                        )}
                    </div>
                    <span className="card-followers">{followers}</span>
                </div>
            </div>
        </div>
    );
};

export default HeroCreatorCard;
