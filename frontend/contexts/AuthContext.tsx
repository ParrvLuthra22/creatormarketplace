"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, BrandProfile, CreatorProfile, getCurrentUser, login as apiLogin, signup as apiSignup, logout as apiLogout, LoginData, SignupData } from '@/lib/api';

type ModalState = 'authGate' | 'login' | 'signup' | null;

interface AuthContextType {
    user: User | null;
    profile: BrandProfile | CreatorProfile | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isBrand: boolean;
    isCreator: boolean;
    modalState: ModalState;
    setModalState: (state: ModalState) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Route protection configuration
const BRAND_ONLY_ROUTES = ['/dashboard/brand', '/brand/profile', '/brand/proposals'];
const CREATOR_ONLY_ROUTES = ['/dashboard/creator', '/creator/profile', '/creator/proposals'];
const PROTECTED_ROUTES = [...BRAND_ONLY_ROUTES, ...CREATOR_ONLY_ROUTES];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<BrandProfile | CreatorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState<ModalState>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Computed properties for role checks
    const isBrand = useMemo(() => user?.accountType === 'Brand', [user]);
    const isCreator = useMemo(() => user?.accountType === 'Creator', [user]);
    const isAuthenticated = useMemo(() => !!user, [user]);

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response.user);
                setProfile(response.profile);
            } catch (error) {
                // User not authenticated
                setUser(null);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Route protection effect
    useEffect(() => {
        if (loading) return; // Wait for auth check to complete

        const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname?.startsWith(route));
        const isBrandRoute = BRAND_ONLY_ROUTES.some(route => pathname?.startsWith(route));
        const isCreatorRoute = CREATOR_ONLY_ROUTES.some(route => pathname?.startsWith(route));

        // Unauthenticated user trying to access protected route
        if (isProtectedRoute && !isAuthenticated) {
            router.push('/');
            return;
        }

        // Brand user trying to access creator route
        if (isCreatorRoute && isBrand) {
            router.push('/dashboard/brand');
            return;
        }

        // Creator user trying to access brand route
        if (isBrandRoute && isCreator) {
            router.push('/dashboard/creator');
            return;
        }
    }, [pathname, loading, isAuthenticated, isBrand, isCreator, router]);

    const login = async (data: LoginData) => {
        try {
            const response = await apiLogin(data);
            setUser(response.user);
            setProfile(response.profile);
            setModalState(null); // Close modal

            // Redirect to role-specific dashboard
            if (response.user.accountType === 'Brand') {
                router.push('/dashboard/brand');
            } else {
                router.push('/dashboard/creator');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error; // Re-throw to allow handling in components
        }
    };

    const signup = async (data: SignupData) => {
        try {
            const response = await apiSignup(data);
            setUser(response.user);
            setProfile(response.profile);
            setModalState(null); // Close modal

            // Redirect to role-specific dashboard
            if (response.user.accountType === 'Brand') {
                router.push('/dashboard/brand');
            } else {
                router.push('/dashboard/creator');
            }
        } catch (error) {
            console.error('Signup error:', error);
            throw error; // Re-throw to allow handling in components
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            setProfile(null);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear state even if API call fails
            setUser(null);
            setProfile(null);
            router.push('/');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                login,
                signup,
                logout,
                isAuthenticated,
                isBrand,
                isCreator,
                modalState,
                setModalState,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
