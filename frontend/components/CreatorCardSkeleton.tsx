"use client";

import "./CreatorCard.css";

export function CreatorCardSkeleton() {
    return (
        <div className="creator-card-skeleton">
            <div className="skeleton-header">
                <div className="skeleton-circle"></div>
            </div>
            <div className="skeleton-content">
                <div className="skeleton-line skeleton-line-title"></div>
                <div className="skeleton-line skeleton-line-subtitle"></div>
                <div className="skeleton-line skeleton-line-bio"></div>
                <div className="skeleton-stats">
                    <div className="skeleton-stat"></div>
                    <div className="skeleton-stat"></div>
                </div>
                <div className="skeleton-badges">
                    <div className="skeleton-badge"></div>
                    <div className="skeleton-badge"></div>
                </div>
            </div>
        </div>
    );
}
