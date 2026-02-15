"use client";

import React, { useState } from 'react';
import './CreatorCardFloat.css';

interface Creator {
    id: number;
    name: string;
    instagramHandle: string;
    profilePicture: string;
    followers: number;
    following: number;
}

interface CreatorCardFloatProps {
    creator: Creator;
    index: number;
    onCardClick: () => void;
}

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const CreatorCardFloat: React.FC<CreatorCardFloatProps> = ({ creator, index, onCardClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`creator-card-float card-${index + 1} ${isHovered ? 'expanded' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onCardClick}
        >
            <div className="card-avatar">
                {creator.profilePicture ? (
                    <img src={creator.profilePicture} alt={creator.name} />
                ) : (
                    <div className="avatar-placeholder">
                        {creator.name.charAt(0)}
                    </div>
                )}
            </div>

            <div className="card-info">
                <div className="card-name">{creator.name}</div>
                <div className="card-handle">@{creator.instagramHandle}</div>

                {isHovered && (
                    <div className="card-stats">
                        <div className="stat">
                            <span className="stat-number">{formatNumber(creator.followers)}</span>
                            <span className="stat-label">followers</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{formatNumber(creator.following)}</span>
                            <span className="stat-label">following</span>
                        </div>
                    </div>
                )}
            </div>

            {isHovered && (
                <div className="card-action">
                    <span>view profile →</span>
                </div>
            )}
        </div>
    );
};

export default CreatorCardFloat;
