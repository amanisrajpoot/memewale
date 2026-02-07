import { User, Meme, MediaType } from "@/lib/types";

// =============================================================================
// MOCK CREATORS
// =============================================================================

export const mockCreators: User[] = [
    {
        id: "cr_1",
        username: "desi_memer",
        displayName: "Desi Memer 🇮🇳",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=desi_memer",
        isVerified: true,
        stats: {
            followers: 125400,
            memesPosted: 342,
            following: 12,
            totalUpvotes: 50000,
            totalShares: 2000
        },
        bio: "Just a desi guy sharing memes",
        createdAt: new Date().toISOString(),
        badges: []
    },
    {
        id: "cr_2",
        username: "bollywood_tadka",
        displayName: "Bollywood Tadka",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bollywood",
        isVerified: true,
        stats: {
            followers: 89200,
            memesPosted: 567,
            following: 45,
            totalUpvotes: 120000,
            totalShares: 5000,
        },
        bio: "Bollywood masala everyday",
        createdAt: new Date().toISOString(),
        badges: []
    },
    {
        id: "cr_3",
        username: "cricket_pagal",
        displayName: "Cricket Pagal 🏏",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=cricket",
        isVerified: false,
        stats: {
            followers: 45600,
            memesPosted: 234,
            following: 0,
            totalUpvotes: 30000,
            totalShares: 1000,
        },
        bio: "Cricket is religion",
        createdAt: new Date().toISOString(),
        badges: []
    },
    {
        id: "cr_4",
        username: "relatable_banda",
        displayName: "Relatable Banda",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=relatable",
        isVerified: false,
        stats: {
            followers: 32100,
            memesPosted: 189,
            following: 10,
            totalUpvotes: 15000,
            totalShares: 500,
        },
        bio: "Relatable AF",
        createdAt: new Date().toISOString(),
        badges: []
    },
    {
        id: "cr_5",
        username: "dark_humor_india",
        displayName: "Dark Humor India 💀",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dark",
        isVerified: true,
        stats: {
            followers: 201000,
            memesPosted: 456,
            following: 666,
            totalUpvotes: 66600,
            totalShares: 6660,
        },
        bio: "Not for the faint hearted",
        createdAt: new Date().toISOString(),
        badges: []
    },
    {
        id: "cr_6",
        username: "chai_sutta_memes",
        displayName: "Chai Sutta Memes ☕",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=chai",
        isVerified: false,
        stats: {
            followers: 67800,
            memesPosted: 312,
            following: 420,
            totalUpvotes: 42000,
            totalShares: 4200,
        },
        bio: "Chai is love, Sutta is life",
        createdAt: new Date().toISOString(),
        badges: []
    },
];

// =============================================================================
// MOCK TAGS
// =============================================================================

export interface Tag {
    id: string;
    name: string;
    slug: string;
    emoji: string;
    memeCount: number;
}

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
        stats: {
            upvotes: 4523,
            downvotes: 123,
            comments: 234,
            shares: 156,
            saves: 45,
            views: 12000,
            score: 0
        },
        userInteraction: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "m_2",
        mediaUrl: "https://picsum.photos/seed/meme2/600/750",
        mediaType: "image",
        aspectRatio: 0.8,
        caption: "Every Indian parent after you score 98% - 'Beta, wo 2% kahan gaye?' 📚 #bollywood #desi",
        tags: ["bollywood", "desi", "relatable"],
        creator: mockCreators[1],
        stats: {
            upvotes: 8934,
            downvotes: 234,
            comments: 567,
            shares: 890,
            saves: 120,
            views: 25000,
            score: 0
        },
        userInteraction: null,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "m_3",
        mediaUrl: "https://picsum.photos/seed/meme3/600/600",
        mediaType: "image",
        aspectRatio: 1,
        caption: "Kohli when he sees Cummins bowling short 🔥 #cricket #virat",
        tags: ["cricket", "desi"],
        creator: mockCreators[2],
        stats: {
            upvotes: 12456,
            downvotes: 456,
            comments: 890,
            shares: 1234,
            saves: 300,
            views: 50000,
            score: 0
        },
        userInteraction: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "m_4",
        mediaUrl: "https://picsum.photos/seed/meme4/600/800",
        mediaType: "image",
        aspectRatio: 0.75,
        caption: "Me explaining to my boss why I need a 3-hour lunch break 🍽️ #office #relatable",
        tags: ["office", "relatable"],
        creator: mockCreators[3],
        stats: {
            upvotes: 3421,
            downvotes: 89,
            comments: 145,
            shares: 67,
            saves: 12,
            views: 8000,
            score: 0
        },
        userInteraction: null,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "m_5",
        mediaUrl: "https://picsum.photos/seed/meme5/600/600",
        mediaType: "image",
        aspectRatio: 1,
        caption: "When you finally fix that bug at 3 AM and the whole project stops working 💀 #darkhumor #coding",
        tags: ["darkhumor", "relatable", "gaming"],
        creator: mockCreators[4],
        stats: {
            upvotes: 15678,
            downvotes: 234,
            comments: 1234,
            shares: 2345,
            saves: 890,
            views: 75000,
            score: 0
        },
        userInteraction: null,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "m_6",
        mediaUrl: "https://picsum.photos/seed/meme6/600/700",
        mediaType: "image",
        aspectRatio: 0.857,
        caption: "Chai break at 4 PM is not optional, it's a fundamental right ☕ #chai #desi",
        tags: ["desi", "wholesome", "office"],
        creator: mockCreators[5],
        stats: {
            upvotes: 6789,
            downvotes: 123,
            comments: 345,
            shares: 567,
            saves: 89,
            views: 18000,
            score: 0
        },
        userInteraction: null,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "m_7",
        mediaUrl: "https://picsum.photos/seed/meme7/600/600",
        mediaType: "image",
        aspectRatio: 1,
        caption: "Shah Rukh Khan spreading his arms: me when mom says she made biryani 🍚 #bollywood",
        tags: ["bollywood", "desi", "wholesome"],
        creator: mockCreators[1],
        stats: {
            upvotes: 23456,
            downvotes: 567,
            comments: 2345,
            shares: 4567,
            saves: 1200,
            views: 100000,
            score: 0
        },
        userInteraction: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "m_8",
        mediaUrl: "https://picsum.photos/seed/meme8/600/750",
        mediaType: "image",
        aspectRatio: 0.8,
        caption: "IPL season is not just a tournament, it's a family thing 🏏💜 #cricket #ipl",
        tags: ["cricket", "desi"],
        creator: mockCreators[2],
        stats: {
            upvotes: 18234,
            downvotes: 890,
            comments: 1567,
            shares: 2890,
            saves: 560,
            views: 85000,
            score: 0
        },
        userInteraction: null,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
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
