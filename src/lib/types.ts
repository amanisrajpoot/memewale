/**
 * Core type definitions for Memewale platform.
 * These types define the shape of data throughout the application.
 */

// =============================================================================
// USER TYPES
// =============================================================================

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    isVerified: boolean;
    badges: Badge[];
    stats: UserStats;
}

export interface UserStats {
    memesPosted: number;
    totalUpvotes: number;
    totalShares: number;
    followers: number;
    following: number;
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt: string;
}

// =============================================================================
// MEME TYPES
// =============================================================================

export type MediaType = "image" | "gif" | "video";

export interface Meme {
    id: string;
    mediaUrl: string;
    mediaType: MediaType;
    caption: string | null;
    tags: string[];
    creator: User;
    createdAt: string;
    stats: MemeStats;
    userInteraction: UserMemeInteraction | null;
}

export interface MemeStats {
    upvotes: number;
    downvotes: number;
    shares: number;
    saves: number;
    comments: number;
    views: number;
    score: number; // Calculated engagement score
}

export interface UserMemeInteraction {
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    hasSaved: boolean;
}

// =============================================================================
// COMMENT TYPES
// =============================================================================

export interface Comment {
    id: string;
    memeId: string;
    content: string;
    author: User;
    createdAt: string;
    upvotes: number;
    downvotes: number;
    parentId: string | null; // For threaded replies
    replies: Comment[];
    replyCount: number;
    userVote: "up" | "down" | null;
}

// =============================================================================
// COLLECTION TYPES
// =============================================================================

export interface Collection {
    id: string;
    name: string;
    description: string | null;
    coverImages: string[]; // First 4 meme thumbnails
    isPublic: boolean;
    isSystem: boolean; // System-created collections (e.g., "Trending")
    creator: User | null; // null for system collections
    memeCount: number;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// FEED & DISCOVERY TYPES
// =============================================================================

export type FeedType = "home" | "trending" | "following" | "new";

export type TrendingPeriod = "24h" | "7d" | "30d" | "all";

export type MemeCategory =
    | "all"
    | "funny"
    | "dark-humor"
    | "desi"
    | "bollywood"
    | "cricket"
    | "politics"
    | "wholesome"
    | "relatable"
    | "gaming"
    | "tech";

export interface FeedFilters {
    category: MemeCategory;
    period: TrendingPeriod;
    language: Language;
}

export interface TrendingTag {
    tag: string;
    count: number;
    trend: "rising" | "stable" | "falling";
}

// =============================================================================
// SEARCH TYPES
// =============================================================================

export interface SearchResult {
    type: "meme" | "user" | "tag" | "collection";
    id: string;
    title: string;
    subtitle: string | null;
    imageUrl: string | null;
}

// =============================================================================
// LOCALIZATION TYPES
// =============================================================================

export type Language = "en" | "hi" | "ta" | "kn" | "te";

export interface LanguageOption {
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
}

export const LANGUAGES: LanguageOption[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
];

// =============================================================================
// UI STATE TYPES
// =============================================================================

export type ModalType =
    | "login"
    | "signup"
    | "createCollection"
    | "addToCollection"
    | "share"
    | null;

export interface Toast {
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
    duration?: number;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface PaginatedResponse<T> {
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface SubmitMemeForm {
    file: File | null;
    caption: string;
    tags: string[];
}

export interface CreateCollectionForm {
    name: string;
    description: string;
    isPublic: boolean;
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type CardVariant = "default" | "elevated" | "outlined";

export type InputSize = "sm" | "md" | "lg";
