import Link from "next/link";

export function PublicHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#1F1F1F] h-16">
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-lg font-milker text-white">
                    CreatorSync
                </Link>

                {/* Navigation */}
                <nav className="hidden md:block">
                    <Link href="/pricing" className="text-sm text-[#6B6B6B] hover:text-white transition-colors">
                        Pricing
                    </Link>
                </nav>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="px-4 py-2 text-sm font-angelo text-white border border-white bg-transparent rounded-lg hover:bg-[#1A1A1A] transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/"
                        className="px-4 py-2 text-sm font-angelo text-black bg-white rounded-lg hover:bg-[#E5E5E5] transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
