/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { showToast } from "@/lib/toast";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type ApiConfig = InternalAxiosRequestConfig & {
  skipAuthRedirect?: boolean;
  skipErrorToast?: boolean;
};

function isProtectedRoute() {
  if (typeof window === "undefined") return false;
  return ["/dashboard", "/onboarding", "/admin"].some((path) =>
    window.location.pathname.startsWith(path)
  );
}

function extractErrorMessage(error: AxiosError<any>) {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    "Something went wrong"
  );
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: ApiConfig) => {
  config.headers = config.headers || {};
  config.headers["X-Request-ID"] =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const config = (error.config || {}) as ApiConfig;
    const message = extractErrorMessage(error);

    if (!config.skipErrorToast) {
      showToast(message, "error");
    }

    if (
      error.response?.status === 401 &&
      !config.skipAuthRedirect &&
      isProtectedRoute() &&
      typeof window !== "undefined"
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export function unwrap<T = any>(response: { data: any }): T {
  const payload = response.data;
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
}

export function apiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) return extractErrorMessage(error);
  return error instanceof Error ? error.message : "Something went wrong";
}

// ─── Re-exports for legacy components ────────────────────────────────────────
// Several older components import showToast from "@/lib/api" rather than
// "@/lib/toast". Re-export here to avoid touching every legacy file.
export { showToast } from "@/lib/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  accountType: "Brand" | "Creator";
  instagramHandle?: string;
  plan?: string;
  selectedPlan?: string;
}

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  accountType: "Brand" | "Creator";
  plan?: string;
  verificationBadge?: string;
  emailVerified?: boolean;
  profilePicture?: string;   // legacy field
  profilePhoto?: string;
}

export interface CreatorProfile {
  userId: string;
  instagramHandle?: string;
  bio?: string;
  profilePhoto?: string;
  coverImage?: string;
  niches?: string[];
  followers?: string;
  engagement?: string | null;
  availability?: string;
  pricing?: Record<string, number | undefined>;
  brandWork?: Array<{ title: string; type: string; url: string }>;
  location?: string;
}

export interface BrandProfile {
  userId: string;
  companyName?: string;
  industry?: string;
  website?: string;
  brandStory?: string;
  logoUrl?: string;
  coverImage?: string;
}

export interface Proposal {
  _id: string;
  brandId: any;
  creatorId: any;
  title: string;
  description: string;
  budget: number;
  deliverables: string;
  deadline: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  brandProfile?: { companyName?: string; logoUrl?: string };
  creatorProfile?: { profilePhoto?: string; instagramHandle?: string; niches?: string[] };
}

export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
    profilePhoto?: string;
  }>;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  read: boolean;
  createdAt: string;
}

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
    pricing: any;
    brandWork?: any[];
    availability?: string;
  };
  stats: {
    followers: string;
    engagement: string | null;
    avgReach: number | null;
    pastBrandCollaborations: number;
  };
  authenticated: boolean;
}

export interface PublicBrand {
  id: string;
  name: string;
  companyName?: string;
  industry?: string;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Returns the URL as-is if it is already absolute, otherwise prefixes API_URL. */
export function getProfilePhotoUrl(urlOrId: string): string {
  if (!urlOrId) return "";
  if (urlOrId.startsWith("http")) return urlOrId;
  return `${API_URL}${urlOrId.startsWith("/") ? "" : "/"}${urlOrId}`;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<{ success?: boolean; user: User; profile: CreatorProfile | BrandProfile }> {
  return unwrap(await api.get("/api/auth/me"));
}

export async function login(data: LoginData): Promise<{ success?: boolean; user: User; profile: any; token: string }> {
  return unwrap(await api.post("/api/auth/login", data));
}

export async function signup(data: SignupData): Promise<{
  success?: boolean;
  user: User;
  profile: any;
  token: string;
  requiresPayment?: boolean;
  selectedPlan?: string;
}> {
  return unwrap(await api.post("/api/auth/signup", data));
}

export async function logout(): Promise<void> {
  await api.post("/api/auth/logout");
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

export async function getPublicCreators(params?: Record<string, string>): Promise<{ success?: boolean; creators: any[]; authenticated: boolean }> {
  return unwrap(await api.get("/api/profile/creators/public", { params }));
}

export async function getPublicBrands(): Promise<{ success?: boolean; brands: PublicBrand[]; authenticated: boolean }> {
  return unwrap(await api.get("/api/profile/brands/public"));
}

export async function getPublicBrandProfile(userId: string): Promise<{ success?: boolean; profile: BrandProfile }> {
  return unwrap(await api.get(`/api/profile/brand/${userId}`));
}

export async function getPublicCreatorStats(userId: string): Promise<PublicCreatorStatsResponse> {
  return unwrap(await api.get(`/api/profile/creators/${userId}/public`));
}

export async function updateCreatorProfile(data: Partial<CreatorProfile>): Promise<{ success?: boolean; profile: CreatorProfile }> {
  return unwrap(await api.put("/api/profile/creator", data));
}

export async function updateBrandProfile(data: Partial<BrandProfile>): Promise<{ success?: boolean; profile: BrandProfile }> {
  return unwrap(await api.put("/api/profile/brand", data));
}

// ─── Uploads ──────────────────────────────────────────────────────────────────

export async function uploadProfilePhoto(file: File): Promise<{ success?: boolean; url: string; publicId: string }> {
  const form = new FormData();
  form.append("file", file);
  return unwrap(
    await api.post("/api/uploads/profile-photo", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
}

// ─── Proposals ────────────────────────────────────────────────────────────────

export async function getProposals(status?: string): Promise<{ success?: boolean; proposals: Proposal[] }> {
  return unwrap(await api.get("/api/proposals", { params: status ? { status } : {} }));
}

export async function createProposal(data: {
  creatorId: string;
  title: string;
  description: string;
  budget: number;
  deliverables: string;
  deadline: string;
}): Promise<{ success?: boolean; proposal: Proposal }> {
  return unwrap(await api.post("/api/proposals", data));
}

export async function acceptProposal(id: string): Promise<{ success?: boolean; proposal: Proposal }> {
  return unwrap(await api.put(`/api/proposals/${id}/accept`));
}

export async function declineProposal(id: string): Promise<{ success?: boolean; proposal: Proposal }> {
  return unwrap(await api.put(`/api/proposals/${id}/decline`));
}

export async function getProposalsSummary(): Promise<{ success?: boolean; pendingProposals: number }> {
  return unwrap(await api.get("/api/proposals/summary"));
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function getConversations(): Promise<{ success?: boolean; conversations: Conversation[] }> {
  return unwrap(await api.get("/api/chat/conversations"));
}

export async function createConversation(participantId: string): Promise<{ success?: boolean; conversation: Conversation }> {
  return unwrap(await api.post("/api/chat/conversations", { participantId }));
}

export async function getMessages(conversationId: string): Promise<{ success?: boolean; messages: ChatMessage[] }> {
  return unwrap(await api.get(`/api/chat/conversations/${conversationId}/messages`));
}

export async function getChatSummary(): Promise<{
  success?: boolean;
  totalUnread: number;
  /** @deprecated use totalUnread */ unreadMessages?: number;
}> {
  const result = unwrap<any>(await api.get("/api/chat/summary"));
  // Normalize: legacy code uses .unreadMessages, new code uses .totalUnread
  return { ...result, unreadMessages: result.totalUnread ?? result.unreadMessages ?? 0 };
}
