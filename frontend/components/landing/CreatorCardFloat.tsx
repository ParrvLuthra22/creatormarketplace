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

    return (
        <div
            className={`creator-card-float card-pos-${index + 1}`}
            onClick={onCardClick}
        >
            <div className="card-header">
                <div className="card-avatar">
                    {creator.profilePicture ? (
                        <img src={creator.profilePicture} alt={creator.name} />
                    ) : (
                        <div className="avatar-placeholder">
                            {creator.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="card-profile-info">
                    <div className="card-name">{creator.name}</div>
                    <div className="card-handle">@{creator.instagramHandle}</div>
                </div>

                {creator.isPremium && (
                    <div className="premium-badge">Matched</div>
                )}
            </div>

            <div className="card-stats">
                <div className="stat">
                    <div className="stat-label">Followers</div>
                    <div className="stat-number">{formatNumber(creator.followers)}</div>
                </div>
                <div className="stat divider"></div>
                <div className="stat">
                    <div className="stat-label">Engagement</div>
                    <div className="stat-number">4.2%</div>
                </div>
            </div>

            <div className="card-footer">
                <div className="tag">Fashion</div>
                <div className="tag">Lifestyle</div>
            </div>
        </div>
    );
};

export default CreatorCardFloat;
