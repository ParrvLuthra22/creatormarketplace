"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallbackPath?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps components that require authentication.
 * Redirects to home page (with auth modal trigger) if not authenticated.
 * Shows loading spinner while checking auth status.
 */
export function ProtectedRoute({ children, fallbackPath = "/" }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Redirect to home with auth trigger
            router.push(`${fallbackPath}?showAuth=true`);
        }
    }, [loading, isAuthenticated, router, fallbackPath]);

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="full-screen-loader">
                <div className="flex flex-col items-center gap-4">
                    <div className="loader-spinner"></div>
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, don't render children (will redirect)
    if (!isAuthenticated) {
        return (
            <div className="full-screen-loader">
                <div className="flex flex-col items-center gap-4">
                    <div className="loader-spinner"></div>
                    <p className="text-gray-500 text-sm">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
