// =============================================================================
// MOCK COMMENTS DATA
// Realistic comment data for development.
// =============================================================================

import type { User, Comment } from "@/lib/types";

// Mock creators for comments (using global User type)
const commentAuthors: User[] = [
    {
        id: "ca_1",
        username: "meme_lord_42",
        displayName: "Meme Lord 42",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=memelord",
        isVerified: false,
        bio: null,
        createdAt: new Date().toISOString(),
        badges: [],
        stats: {
            followers: 1200,
            following: 0,
            memesPosted: 45,
            totalUpvotes: 0,
            totalShares: 0
        }
    },
    {
        id: "ca_2",
        username: "desiqueen",
        displayName: "Desi Queen 👑",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=desiqueen",
        isVerified: true,
        bio: null,
        createdAt: new Date().toISOString(),
        badges: [],
        stats: {
            followers: 8500,
            following: 0,
            memesPosted: 234,
            totalUpvotes: 0,
            totalShares: 0
        }
    },
    {
        id: "ca_3",
        username: "rofl_raja",
        displayName: "ROFL Raja 😂",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=roflraja",
        isVerified: false,
        bio: null,
        createdAt: new Date().toISOString(),
        badges: [],
        stats: {
            followers: 3200,
            following: 0,
            memesPosted: 89,
            totalUpvotes: 0,
            totalShares: 0
        }
    },
    {
        id: "ca_4",
        username: "bhaibhai",
        displayName: "Bhai Bhai",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bhaibhai",
        isVerified: false,
        bio: null,
        createdAt: new Date().toISOString(),
        badges: [],
        stats: {
            followers: 560,
            following: 0,
            memesPosted: 12,
            totalUpvotes: 0,
            totalShares: 0
        }
    },
];

export const mockComments: Comment[] = [
    {
        id: "c_1",
        memeId: "m_1", // Placeholder - should be set by the component
        content: "Bhai ye toh literally meri zindagi hai 😭😭",
        author: commentAuthors[0],
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        upvotes: 234,
        downvotes: 5,
        parentId: null,
        replyCount: 2,
        userVote: null,
        replies: [
            {
                id: "c_1_1",
                memeId: "m_1",
                content: "Same bro, same 🥲",
                author: commentAuthors[2],
                createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                upvotes: 45,
                downvotes: 0,
                parentId: "c_1",
                replyCount: 0,
                userVote: null,
                replies: [],
            },
            {
                id: "c_1_2",
                memeId: "m_1",
                content: "We all feel attacked rn 💀",
                author: commentAuthors[3],
                createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
                upvotes: 23,
                downvotes: 1,
                parentId: "c_1",
                replyCount: 0,
                userVote: null,
                replies: [],
            },
        ],
    },
    {
        id: "c_2",
        memeId: "m_1",
        content: "This is peak desi content right here! 🔥🔥",
        author: commentAuthors[1],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        upvotes: 567,
        downvotes: 12,
        parentId: null,
        replyCount: 1,
        userVote: null,
        replies: [
            {
                id: "c_2_1",
                memeId: "m_1",
                content: "@desiqueen agreed! More of this please 🙏",
                author: commentAuthors[0],
                createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
                upvotes: 34,
                downvotes: 0,
                parentId: "c_2",
                replyCount: 0,
                userVote: null,
                replies: [],
            },
        ],
    },
    {
        id: "c_3",
        memeId: "m_1",
        content: "I sent this to my whole family group 😂",
        author: commentAuthors[2],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        upvotes: 123,
        downvotes: 3,
        parentId: null,
        replyCount: 0,
        userVote: null,
        replies: [],
    },
    {
        id: "c_4",
        memeId: "m_1",
        content: "The accuracy of this meme is scary 😳",
        author: commentAuthors[3],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        upvotes: 89,
        downvotes: 2,
        parentId: null,
        replyCount: 0,
        userVote: null,
        replies: [],
    },
    {
        id: "c_5",
        memeId: "m_1",
        content: "Quality content! Keep it up creator 👏",
        author: commentAuthors[1],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        upvotes: 156,
        downvotes: 1,
        parentId: null,
        replyCount: 0,
        userVote: null,
        replies: [],
    },
];
