// =============================================================================
// MOCK DATA - INDIAN MEME ECOSYSTEM
// Realistic data for development and testing.
// =============================================================================

export interface Creator {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
    followers: number;
    memesPosted: number;
}

export interface Meme {
    id: string;
    mediaUrl: string;
    mediaType: "image" | "gif" | "video";
    aspectRatio: number; // width/height
    caption: string;
    tags: string[];
    creator: Creator;
    upvotes: number;
    downvotes: number;
    comments: number;
    shares: number;
    createdAt: Date;
    isUpvoted?: boolean;
    isDownvoted?: boolean;
    isSaved?: boolean;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    emoji: string;
    memeCount: number;
}

// =============================================================================
// MOCK CREATORS
// =============================================================================

export const mockCreators: Creator[] = [
    {
        id: "cr_1",
        username: "desi_memer",
        displayName: "Desi Memer 🇮🇳",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=desi_memer",
        isVerified: true,
        followers: 125400,
        memesPosted: 342,
    },
    {
        id: "cr_2",
        username: "bollywood_tadka",
        displayName: "Bollywood Tadka",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bollywood",
        isVerified: true,
        followers: 89200,
        memesPosted: 567,
    },
    {
        id: "cr_3",
        username: "cricket_pagal",
        displayName: "Cricket Pagal 🏏",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cricket",
        isVerified: false,
        followers: 45600,
        memesPosted: 234,
    },
    {
        id: "cr_4",
        username: "relatable_banda",
        displayName: "Relatable Banda",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=relatable",
        isVerified: false,
        followers: 32100,
        memesPosted: 189,
    },
    {
        id: "cr_5",
        username: "dark_humor_india",
        displayName: "Dark Humor India 💀",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dark",
        isVerified: true,
        followers: 201000,
        memesPosted: 456,
    },
    {
        id: "cr_6",
        username: "chai_sutta_memes",
        displayName: "Chai Sutta Memes ☕",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chai",
        isVerified: false,
        followers: 67800,
        memesPosted: 312,
    },
];

// =============================================================================
// MOCK TAGS
// =============================================================================

export const mockTags: Tag[] = [
    { id: "t1", name: "Desi", slug: "desi", emoji: "🇮🇳", memeCount: 12500 },
    { id: "t2", name: "Bollywood", slug: "bollywood", emoji: "🎬", memeCount: 8200 },
    { id: "t3", name: "Cricket", slug: "cricket", emoji: "🏏", memeCount: 6800 },
    { id: "t4", name: "Wholesome", slug: "wholesome", emoji: "🥰", memeCount: 5100 },
    { id: "t5", name: "Dark Humor", slug: "darkhumor", emoji: "💀", memeCount: 4300 },
    { id: "t6", name: "Relatable", slug: "relatable", emoji: "😅", memeCount: 3900 },
    { id: "t7", name: "Gaming", slug: "gaming", emoji: "🎮", memeCount: 2800 },
    { id: "t8", name: "College", slug: "college", emoji: "📚", memeCount: 2400 },
    { id: "t9", name: "Office", slug: "office", emoji: "💼", memeCount: 2100 },
    { id: "t10", name: "Politics", slug: "politics", emoji: "🏛️", memeCount: 1800 },
];

// =============================================================================
// MOCK MEMES
// Using picsum.photos for placeholder images
// =============================================================================

export const mockMemes: Meme[] = [
    {
        id: "m_1",
        mediaUrl: "https://picsum.photos/seed/meme1/600/600",
        mediaType: "image",
        aspectRatio: 1,
        caption: "When your mom says 'beta, bas 5 minute aur' and you know it's going to be 2 hours 😭 #desi #relatable",
        tags: ["desi", "relatable", "wholesome"],
        creator: mockCreators[0],
        upvotes: 4523,
        downvotes: 123,
        comments: 234,
        shares: 156,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
        id: "m_2",
        mediaUrl: "https://picsum.photos/seed/meme2/600/750",
        mediaType: "image",
        aspectRatio: 0.8,
        caption: "Every Indian parent after you score 98% - 'Beta, wo 2% kahan gaye?' 📚 #bollywood #desi",
        tags: ["bollywood", "desi", "relatable"],
        creator: mockCreators[1],
        upvotes: 8934,
        downvotes: 234,
        comments: 567,
        shares: 890,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
        id: "m_3",
        mediaUrl: "https://picsum.photos/seed/meme3/600/600",
        mediaType: "image",
        aspectRatio: 1,
        caption: "Kohli when he sees Cummins bowling short 🔥 #cricket #virat",
        tags: ["cricket", "desi"],
        creator: mockCreators[2],
        upvotes: 12456,
        downvotes: 456,
        comments: 890,
        shares: 1234,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
        id: "m_4",
        mediaUrl: "https://picsum.photos/seed/meme4/600/800",
        mediaType: "image",
        aspectRatio: 0.75,
        caption: "Me explaining to my boss why I need a 3-hour lunch break 🍽️ #office #relatable",
        tags: ["office", "relatable"],
        creator: mockCreators[3],
        upvotes: 3421,
        downvotes: 89,
        comments: 145,
        shares: 67,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
        id: "m_5",
        mediaUrl: "https://picsum.photos/seed/meme5/600/600",
        mediaType: "image",
        aspectRatio: 1,
        caption: "When you finally fix that bug at 3 AM and the whole project stops working 💀 #darkhumor #coding",
        tags: ["darkhumor", "relatable", "gaming"],
        creator: mockCreators[4],
        upvotes: 15678,
        downvotes: 234,
        comments: 1234,
        shares: 2345,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
    {
        id: "m_6",
        mediaUrl: "https://picsum.photos/seed/meme6/600/700",
        mediaType: "image",
        aspectRatio: 0.857,
        caption: "Chai break at 4 PM is not optional, it's a fundamental right ☕ #chai #desi",
        tags: ["desi", "wholesome", "office"],
        creator: mockCreators[5],
        upvotes: 6789,
        downvotes: 123,
        comments: 345,
        shares: 567,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
        id: "m_7",
        mediaUrl: "https://picsum.photos/seed/meme7/600/600",
        mediaType: "image",
        aspectRatio: 1,
        caption: "Shah Rukh Khan spreading his arms: me when mom says she made biryani 🍚 #bollywood",
        tags: ["bollywood", "desi", "wholesome"],
        creator: mockCreators[1],
        upvotes: 23456,
        downvotes: 567,
        comments: 2345,
        shares: 4567,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
        id: "m_8",
        mediaUrl: "https://picsum.photos/seed/meme8/600/750",
        mediaType: "image",
        aspectRatio: 0.8,
        caption: "IPL season is not just a tournament, it's a family thing 🏏💜 #cricket #ipl",
        tags: ["cricket", "desi"],
        creator: mockCreators[2],
        upvotes: 18234,
        downvotes: 890,
        comments: 1567,
        shares: 2890,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function formatCount(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
}

export function formatTimeAgo(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    return d.toLocaleDateString();
}
