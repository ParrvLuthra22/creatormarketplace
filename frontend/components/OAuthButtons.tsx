"use client";

interface OAuthButtonsProps {
    mode?: "login" | "signup";
}

export function OAuthButtons({ mode = "login" }: OAuthButtonsProps) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://creatormarketplace.onrender.com";

    const handleGoogle = () => {
        window.location.href = `${apiBase}/api/auth/google`;
    };

    const handleInstagram = () => {
        window.location.href = `${apiBase}/api/auth/instagram`;
    };

    return (
        <div className="space-y-3 my-5">
            {/* Divider */}
            <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E5E5E5]" />
                <span className="text-xs text-[#6B6B6B] font-medium">or continue with</span>
                <div className="flex-1 h-px bg-[#E5E5E5]" />
            </div>

            {/* Google Button */}
            <button
                type="button"
                onClick={handleGoogle}
                className="w-full flex items-center gap-3 px-4 py-3 border border-[#E5E5E5] rounded-md bg-white text-zinc-800 text-sm font-semibold hover:border-[#FF4D00] hover:shadow-md transition-all duration-200 group"
            >
                {/* Google Icon */}
                <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.8 6.1C12.4 13 17.7 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v7.6h12.7c-.6 3.2-2.3 5.9-4.9 7.8l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.3z"/>
                    <path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.7 10.8l7.8-6.2z"/>
                    <path fill="#34A853" d="M24 48c6.2 0 11.5-2.1 15.3-5.6l-7.6-5.9c-2.1 1.4-4.7 2.2-7.7 2.2-6.3 0-11.6-3.5-13.5-9.1l-7.8 6.1C6.6 42.6 14.6 48 24 48z"/>
                </svg>
                <span className="flex-1 text-left">Continue with Google</span>
            </button>

            {/* Instagram Button */}
            <button
                type="button"
                onClick={handleInstagram}
                className="w-full flex items-center gap-3 px-4 py-3 border border-[#E5E5E5] rounded-md bg-white text-zinc-800 text-sm font-semibold hover:border-[#FF4D00] hover:shadow-md transition-all duration-200 group"
            >
                {/* Instagram Icon */}
                <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                            <stop offset="0%" stopColor="#fdf497"/>
                            <stop offset="5%" stopColor="#fdf497"/>
                            <stop offset="45%" stopColor="#fd5949"/>
                            <stop offset="60%" stopColor="#d6249f"/>
                            <stop offset="90%" stopColor="#285AEB"/>
                        </radialGradient>
                    </defs>
                    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#ig-grad)"/>
                    <circle cx="24" cy="24" r="9" fill="none" stroke="white" strokeWidth="3"/>
                    <circle cx="35" cy="13" r="2.5" fill="white"/>
                </svg>
                <span className="flex-1 text-left">Continue with Instagram</span>
            </button>
        </div>
    );
}
