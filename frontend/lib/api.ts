/**
 * API Client Utility
 * 
 * Provides a centralized API wrapper with:
 * - Error handling and interceptors
 * - Automatic logout on 401
 * - Toast notifications for errors
 * - Type-safe responses
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$/, '');

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
    logoUrl?: string;
    website?: string;
    brandStory?: string;
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

export const uploadProfilePhoto = async (file: File): Promise<{ success: boolean; url: string }> => {
    const url = `${API_BASE_URL}/api/uploads/profile-photo`;
    const form = new FormData();
    form.append('file', file);

    const response = await fetch(url, {
        method: 'POST',
        body: form,
        credentials: 'include',
    });

    if (response.status === 401) {
        if (logoutHandler) logoutHandler();
        throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
    }

    return response.json();
};

export const getProfilePhotoUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${cleanUrl}`;
};

export const getProposalsSummary = async (): Promise<{ success: boolean; pendingProposals: number }> => {
    return apiFetch<{ success: boolean; pendingProposals: number }>(`/api/proposals/summary`, {
        method: 'GET',
    });
};

export const getChatSummary = async (): Promise<{ success: boolean; unreadMessages: number }> => {
    return apiFetch<{ success: boolean; unreadMessages: number }>(`/api/chat/summary`, {
        method: 'GET',
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

export interface PublicCreatorStatsResponse {
    success: boolean;
    creator: {
        id: string;
        name: string;
        instagramHandle: string;
        profilePicture: string;
        niches: string[];
        followers: string;
        engagement: string | null;
        availability: 'available' | 'limited' | 'unavailable';
        pricing: {
            starting?: number;
            per?: string;
            reel?: number;
            story?: number;
            post?: number;
        } | null;
        brandWork: Array<{
            title: string;
            type: 'image' | 'video';
            url: string;
            instagramUrl?: string;
        }>;
    };
    stats: {
        followers: string;
        engagement: string | null;
        avgReach: number | null;
        pastBrandCollaborations: number;
    };
    authenticated: boolean;
}

export const getPublicCreatorStats = async (userId: string): Promise<PublicCreatorStatsResponse> => {
    return apiFetch<PublicCreatorStatsResponse>(`/api/profile/creators/${userId}/public`, {
        method: 'GET',
    });
};

export type UpdateCreatorProfileInput = Partial<{
    bio: string;
    instagramHandle: string;
    profilePhoto: string;
    niches: string[];
    followers: string;
    engagement: string;
    location: string;
    availability: string;
    pricing: {
        starting?: number;
        per?: string;
        reel?: number;
        story?: number;
        post?: number;
    };
    brandWork: Array<{
        title: string;
        type: 'image' | 'video';
        url: string;
        instagramUrl?: string;
    }>;
}>;

export async function updateCreatorProfile(input: UpdateCreatorProfileInput) {
    return apiFetch<{ success: boolean; profile: unknown }>(`/api/profile/creator`, {
        method: "PUT",
        body: JSON.stringify(input),
    });
}

export async function updateUserProfile(data: { fullName: string }) {
    return apiFetch<{ success: boolean; user: User }>(`/api/auth/profile`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function updateBrandProfile(data: Partial<BrandProfile>) {
    return apiFetch<{ success: boolean; profile: BrandProfile }>(`/api/profile/brand`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// Chat API
export interface Conversation {
    _id: string;
    participants: {
        _id: string;
        fullName: string;
        accountType: 'Brand' | 'Creator';
        profilePicture?: string;
        profilePhoto?: string;
    }[];
    lastMessage?: string;
    lastMessageAt?: string;
    createdAt: string;
}

export interface ChatMessage {
    _id: string;
    conversationId: string;
    senderId: string;
    text: string;
    read: boolean;
    edited?: boolean;
    deleted?: boolean;
    createdAt: string;
}

export const getConversations = async (): Promise<{ conversations: Conversation[] }> => {
    return apiFetch<{ conversations: Conversation[] }>('/api/chat/conversations', {
        method: 'GET',
    });
};

export const getMessages = async (conversationId: string): Promise<{ messages: ChatMessage[] }> => {
    return apiFetch<{ messages: ChatMessage[] }>(`/api/chat/${conversationId}`, {
        method: 'GET',
    });
};

export const createConversation = async (participantId: string): Promise<{ conversation: Conversation }> => {
    return apiFetch<{ conversation: Conversation }>('/api/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ participantId }),
    });
};

// Public Brands API (Dashboard Display)
export interface PublicBrand {
    id: string;
    name: string;
    companyName?: string;
    industry?: string;
}

export interface PublicBrandsResponse {
    success: boolean;
    brands: PublicBrand[];
    authenticated: boolean;
}

export const getPublicBrands = async (): Promise<PublicBrandsResponse> => {
    return apiFetch<PublicBrandsResponse>('/api/profile/brands/public', {
        method: 'GET',
    });
};

// Proposal API
export interface ProposalData {
    creatorId: string;
    title: string;
    description: string;
    budget: number;
    deliverables: string;
    deadline: string;
}

export interface Proposal {
    _id: string;
    brandId: { _id: string; fullName: string; email: string };
    creatorId: { _id: string; fullName: string; email: string };
    brandProfile?: {
        companyName?: string;
        logoUrl?: string;
    } | null;
    creatorProfile?: {
        profilePhoto?: string;
    } | null;
    title: string;
    description: string;
    budget: number;
    deliverables: string;
    deadline: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
}

export const createProposal = async (data: ProposalData): Promise<{ success: boolean; proposal: Proposal }> => {
    return apiFetch<{ success: boolean; proposal: Proposal }>('/api/proposals', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getProposals = async (status?: string): Promise<{ success: boolean; proposals: Proposal[] }> => {
    const url = status ? `/api/proposals?status=${status}` : '/api/proposals';
    return apiFetch<{ success: boolean; proposals: Proposal[] }>(url, { method: 'GET' });
};

export const getProposal = async (id: string): Promise<{ success: boolean; proposal: Proposal }> => {
    return apiFetch<{ success: boolean; proposal: Proposal }>(`/api/proposals/${id}`, { method: 'GET' });
};

export const getBrandDashboardSummary = async (): Promise<{
    success: boolean;
    totalSpend: number;
    creatorsHired: number;
    pendingProposals: number;
}> => {
    return apiFetch<{
        success: boolean;
        totalSpend: number;
        creatorsHired: number;
        pendingProposals: number;
    }>('/api/proposals/dashboard-summary', { method: 'GET' });
};

export const acceptProposal = async (id: string): Promise<{ success: boolean; proposal: Proposal }> => {
    return apiFetch<{ success: boolean; proposal: Proposal }>(`/api/proposals/${id}/accept`, { method: 'PUT' });
};

export const declineProposal = async (id: string): Promise<{ success: boolean; proposal: Proposal }> => {
    return apiFetch<{ success: boolean; proposal: Proposal }>(`/api/proposals/${id}/decline`, { method: 'PUT' });
};

// Message Management
export const editMessage = async (messageId: string, text: string): Promise<{ success: boolean; message: ChatMessage }> => {
    return apiFetch<{ success: boolean; message: ChatMessage }>(`/api/chat/messages/${messageId}`, {
        method: 'PUT',
        body: JSON.stringify({ text }),
    });
};

export const deleteMessage = async (messageId: string): Promise<{ success: boolean; message: ChatMessage }> => {
    return apiFetch<{ success: boolean; message: ChatMessage }>(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
    });
};

export const closeConversation = async (conversationId: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/chat/conversations/${conversationId}/close`, {
        method: 'PUT',
    });
};

// Utility exports
export { showToast };
