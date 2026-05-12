import Link from "next/link";
import { Button } from "./ui/Button";
import { User } from "@/lib/api";
import { useRouter } from "next/navigation";

interface HeaderProps {
    user?: User | null;
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    onLogoutClick?: () => void;
}

export function Header({ user, onLoginClick, onSignupClick, onLogoutClick }: HeaderProps) {
    const router = useRouter();

    const handleProfileClick = () => {
        if (user) {
            const dashboardPath = user.accountType === 'Brand' ? '/dashboard/brand' : '/dashboard/creator';
            router.push(dashboardPath);
        }
    };

    return (
        <header className="sticky top-0 left-0 right-0 z-[100] bg-[#F8F8F8]/80 backdrop-blur-md border-b border-[#E5E5E5] h-16">
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight text-[#0A0A0A] font-milker">
                    CreatorSync
                </Link>

                {/* Navigation */}
                <nav className="hidden md:block">
                    <Link href="/pricing" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">
                        Pricing
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {/* User Avatar */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#0A0A0A] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                    {user.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-semibold text-[#0A0A0A]">{user.fullName}</p>
                                    <p className="text-xs text-[#6B6B6B]">{user.accountType}</p>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleProfileClick}
                                className="hidden sm:flex text-[#0A0A0A] hover:bg-[#E5E5E5] font-angelo"
                            >
                                My Profile
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onLogoutClick}
                                className="text-[#0A0A0A] hover:bg-[#E5E5E5] font-angelo"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onLoginClick}
                                className="text-[#0A0A0A] hover:bg-[#E5E5E5] border border-[#0A0A0A] font-angelo"
                            >
                                Login
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={onSignupClick}
                                className="bg-[#0A0A0A] text-white hover:bg-[#2A2A2A] font-angelo"
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
