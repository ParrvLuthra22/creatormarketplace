/**
 * API Client Utility
 * 
 * Provides a centralized API wrapper with:
 * - Error handling and interceptors
 * - Automatic logout on 401
 * - Toast notifications for errors
 * - Type-safe responses
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Types
export interface SignupData {
    fullName: string;
    email: string;
    password: string;
    accountType: 'Brand' | 'Creator';
    instagramHandle?: string; // Required if accountType === 'Creator'
    plan?: 'free' | 'basic' | 'pro'; // Optional, defaults to 'free'
    selectedPlan?: 'free' | 'basic' | 'pro'; // For brand signup flow
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    accountType: 'Brand' | 'Creator';
    plan: 'free' | 'basic' | 'pro';
    createdAt: string;
    profilePicture?: string;
}

export interface BrandProfile {
    _id: string;
    userId: string;
    companyName?: string;
    industry?: string;
    totalRevenue: number;
    creatorsHired: string[];
    createdAt: string;
}

export interface CreatorProfile {
    _id: string;
    userId: string;
    instagramHandle: string;
    profilePhoto?: string;
    niches: string[];
    pricing?: {
        starting: number;
        per: string;
    };
    availability: 'available' | 'limited' | 'unavailable';
    followers?: string;
    engagement?: string;
    brandWork: Array<{
        title: string;
        type: 'image' | 'video';
        url: string;
        instagramUrl?: string;
    }>;
    createdAt: string;
}

export interface AuthResponse {
    user: User;
    profile: BrandProfile | CreatorProfile;
    token: string;
    requiresPayment?: boolean;
    selectedPlan?: 'free' | 'basic' | 'pro';
}

export interface ApiError {
    error: string;
    statusCode: number;
}

// Toast notification helper (client-side only)
const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'error') => {
    if (typeof window === 'undefined') return;

    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Remove after 4 seconds
    setTimeout(() => {
        toast.remove();
    }, 4000);
};

// Logout handler (will be set by AuthContext)
let logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (handler: () => void) => {
    logoutHandler = handler;
};

// Generic fetch wrapper with error handling
const apiFetch = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, mergedOptions);

        // Handle 401 - Unauthorized
        if (response.status === 401) {
            if (logoutHandler) {
                logoutHandler();
            }
            throw new Error('Session expired. Please login again.');
        }

        // Handle other errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            const errorMessage = errorData.error || `Request failed with status ${response.status}`;

            // Show toast for server errors
            if (response.status >= 500) {
                showToast('Server error. Please try again later.', 'error');
            }

            throw new Error(errorMessage);
        }

        // Handle empty responses (like logout)
        const text = await response.text();
        if (!text) return {} as T;

        return JSON.parse(text);
    } catch (error) {
        // Network errors
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            showToast('Network error. Please check your connection.', 'error');
            throw new Error('Network error. Please check your connection.');
        }

        throw error;
    }
};

// Auth API Functions

export const signup = async (data: SignupData): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getCurrentUser = async (): Promise<{ user: User; profile: BrandProfile | CreatorProfile }> => {
    return apiFetch<{ user: User; profile: BrandProfile | CreatorProfile }>('/api/auth/me', {
        method: 'GET',
    });
};

export const logout = async (): Promise<void> => {
    await apiFetch<void>('/api/auth/logout', {
        method: 'POST',
    });
};

// Public Creators API
export interface PublicCreator {
    id: string;
    name?: string;
    instagramHandle?: string;
    profilePicture: string;
    followers?: string;
    following?: string;
    bio?: string;
    verified?: boolean;
}

export interface PublicCreatorsResponse {
    success: boolean;
    creators: PublicCreator[];
    authenticated: boolean;
}

export const getPublicCreators = async (): Promise<PublicCreatorsResponse> => {
    return apiFetch<PublicCreatorsResponse>('/api/profile/creators/public', {
        method: 'GET',
    });
};

// Utility exports
export { showToast };
