import React from 'react';
import './CreatorCardFloat.css';

interface Creator {
    id: number | string;
    name: string;
    instagramHandle: string;
    profilePicture: string | null;
    followers: number;
    following: number;
    isPremium: boolean;
}

interface CreatorCardFloatProps {
    creator: Creator;
    index: number;
    onCardClick: () => void;
}

const CreatorCardFloat: React.FC<CreatorCardFloatProps> = ({ creator, index, onCardClick }) => {
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    // Determine if card should be smaller (cards 7 and 8)
    const isSmaller = index === 6 || index === 7;

    return (
        <div
            className={`creator-card-float card-${index + 1} ${isSmaller ? 'small' : ''}`}
            onClick={onCardClick}
        >
            {creator.isPremium && (
                <div className="premium-badge">premium</div>
            )}

            <div className={`card-avatar ${isSmaller ? 'small' : ''}`}>
                {creator.profilePicture ? (
                    <img src={creator.profilePicture} alt={creator.name} />
                ) : (
                    <div className="avatar-placeholder">
                        {creator.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="card-name">{creator.name}</div>
            <div className="card-handle">@{creator.instagramHandle}</div>

            <div className="card-stats">
                <div className="stat">
                    <div className="stat-number">{formatNumber(creator.followers)}</div>
                    <div className="stat-label">followers</div>
                </div>
                {!isSmaller && (
                    <div className="stat">
                        <div className="stat-number">{formatNumber(creator.following)}</div>
                        <div className="stat-label">following</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatorCardFloat;
