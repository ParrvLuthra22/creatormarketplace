import Link from "next/link";

export function PublicHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#F8F8F8] border-b border-[#E5E5E5] h-16">
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-lg font-milker text-[#0A0A0A]">
                    CreatorSync
                </Link>

                {/* Navigation */}
                <nav className="hidden md:block">
                    <Link href="/pricing" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">
                        Pricing
                    </Link>
                </nav>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="px-4 py-2 text-sm font-angelo text-[#0A0A0A] border border-[#0A0A0A] bg-transparent rounded-sm hover:bg-[#E5E5E5] transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/"
                        className="px-4 py-2 text-sm font-angelo text-white bg-[#0A0A0A] rounded-sm hover:bg-[#2A2A2A] transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
