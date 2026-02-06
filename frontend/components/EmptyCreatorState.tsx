"use client";

interface EmptyCreatorStateProps {
    message?: string;
    subMessage?: string;
}

export function EmptyCreatorState({
    message = "No creators found",
    subMessage = "Try adjusting your filters or search terms"
}: EmptyCreatorStateProps) {
    return (
        <div className="empty-creators-state">
            <div className="empty-icon">👤</div>
            <h3 className="empty-message">{message}</h3>
            <p className="empty-submessage">{subMessage}</p>

            <style jsx>{`
                .empty-creators-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 20px;
                    text-align: center;
                }

                .empty-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    opacity: 0.3;
                }

                .empty-message {
                    font-family: 'Milker', sans-serif;
                    font-size: 20px;
                    font-weight: 600;
                    color: white;
                    margin: 0 0 8px 0;
                }

                .empty-submessage {
                    font-family: 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.5);
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
