// =============================================================================
// MOCK COMMENTS DATA
// Realistic comment data for development.
// =============================================================================

import type { Creator } from "./mockMemes";

export interface Comment {
    id: string;
    text: string;
    author: Creator;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    isUpvoted?: boolean;
    isDownvoted?: boolean;
    replies?: Comment[];
}

// Mock creators for comments
const commentAuthors: Creator[] = [
    {
        id: "ca_1",
        username: "meme_lord_42",
        displayName: "Meme Lord 42",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=memelord",
        isVerified: false,
        followers: 1200,
        memesPosted: 45,
    },
    {
        id: "ca_2",
        username: "desiqueen",
        displayName: "Desi Queen 👑",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=desiqueen",
        isVerified: true,
        followers: 8500,
        memesPosted: 234,
    },
    {
        id: "ca_3",
        username: "rofl_raja",
        displayName: "ROFL Raja 😂",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=roflraja",
        isVerified: false,
        followers: 3200,
        memesPosted: 89,
    },
    {
        id: "ca_4",
        username: "bhaibhai",
        displayName: "Bhai Bhai",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bhaibhai",
        isVerified: false,
        followers: 560,
        memesPosted: 12,
    },
];

export const mockComments: Comment[] = [
    {
        id: "c_1",
        text: "Bhai ye toh literally meri zindagi hai 😭😭",
        author: commentAuthors[0],
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        upvotes: 234,
        downvotes: 5,
        replies: [
            {
                id: "c_1_1",
                text: "Same bro, same 🥲",
                author: commentAuthors[2],
                createdAt: new Date(Date.now() - 15 * 60 * 1000),
                upvotes: 45,
                downvotes: 0,
            },
            {
                id: "c_1_2",
                text: "We all feel attacked rn 💀",
                author: commentAuthors[3],
                createdAt: new Date(Date.now() - 10 * 60 * 1000),
                upvotes: 23,
                downvotes: 1,
            },
        ],
    },
    {
        id: "c_2",
        text: "This is peak desi content right here! 🔥🔥",
        author: commentAuthors[1],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        upvotes: 567,
        downvotes: 12,
        replies: [
            {
                id: "c_2_1",
                text: "@desiqueen agreed! More of this please 🙏",
                author: commentAuthors[0],
                createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
                upvotes: 34,
                downvotes: 0,
            },
        ],
    },
    {
        id: "c_3",
        text: "I sent this to my whole family group 😂",
        author: commentAuthors[2],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        upvotes: 123,
        downvotes: 3,
    },
    {
        id: "c_4",
        text: "The accuracy of this meme is scary 😳",
        author: commentAuthors[3],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        upvotes: 89,
        downvotes: 2,
    },
    {
        id: "c_5",
        text: "Quality content! Keep it up creator 👏",
        author: commentAuthors[1],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        upvotes: 156,
        downvotes: 1,
    },
];
