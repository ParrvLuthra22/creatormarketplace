"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

interface RouteGuardProps {
    children: React.ReactNode;
    allowedRole?: "brand" | "creator";
    requireAuth?: boolean;
}

/**
 * RouteGuard component for protecting routes based on authentication and role.
 * 
 * Usage:
 * <RouteGuard allowedRole="brand" requireAuth>
 *   <BrandDashboard />
 * </RouteGuard>
 */
export function RouteGuard({
    children,
    allowedRole,
    requireAuth = true
}: RouteGuardProps) {
    const { user, loading, isAuthenticated, isBrand, isCreator } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        // Check if authentication is required
        if (requireAuth && !isAuthenticated) {
            router.push('/');
            return;
        }

        // Check role-based access
        if (allowedRole === "brand" && !isBrand) {
            // Redirect creator to their dashboard
            if (isCreator) {
                router.push('/dashboard/creator');
            } else {
                router.push('/');
            }
            return;
        }

        if (allowedRole === "creator" && !isCreator) {
            // Redirect brand to their dashboard
            if (isBrand) {
                router.push('/dashboard/brand');
            } else {
                router.push('/');
            }
            return;
        }
    }, [loading, isAuthenticated, isBrand, isCreator, allowedRole, requireAuth, router]);

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-[#1F1F1F] border-t-white rounded-full animate-spin"></div>
                    <p className="text-white text-xl font-milker">CreatorSync</p>
                </div>
            </div>
        );
    }

    // Don't render children if unauthorized
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    if (allowedRole === "brand" && !isBrand) {
        return null;
    }

    if (allowedRole === "creator" && !isCreator) {
        return null;
    }

    return <>{children}</>;
}
