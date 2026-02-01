import { create } from 'zustand';
import { mockMemes, type Meme } from '@/data/mockMemes';
import type { Comment } from '@/data/mockComments';

interface MemeInteraction {
    memeId: string;
    isUpvoted: boolean;
    isDownvoted: boolean;
    isSaved: boolean;
    upvotes: number;
    downvotes: number;
    comments: Comment[];
    commentCount: number;
}

interface MemeStore {
    interactions: Record<string, MemeInteraction>;

    // Initialize meme interactions
    initializeMeme: (meme: Meme, comments: Comment[]) => void;

    // Voting
    upvote: (memeId: string) => void;
    downvote: (memeId: string) => void;

    // Save
    toggleSave: (memeId: string) => void;

    // Comments
    addComment: (memeId: string, comment: Comment) => void;

    // Getters
    getMemeInteraction: (memeId: string) => MemeInteraction | undefined;
}

export const useMemeStore = create<MemeStore>((set, get) => ({
    interactions: {},

    initializeMeme: (meme: Meme, comments: Comment[] = []) => {
        const { interactions } = get();
        if (!interactions[meme.id]) {
            set({
                interactions: {
                    ...interactions,
                    [meme.id]: {
                        memeId: meme.id,
                        isUpvoted: meme.isUpvoted || false,
                        isDownvoted: meme.isDownvoted || false,
                        isSaved: meme.isSaved || false,
                        upvotes: meme.upvotes,
                        downvotes: meme.downvotes,
                        comments: comments,
                        commentCount: meme.comments
                    }
                }
            });
        }
    },

    upvote: (memeId: string) => {
        const { interactions } = get();
        const interaction = interactions[memeId];
        if (!interaction) {
            console.warn(`Attempted to upvote uninitialized meme: ${memeId}`);
            return;
        }

        const wasUpvoted = interaction.isUpvoted;
        const wasDownvoted = interaction.isDownvoted;

        set({
            interactions: {
                ...interactions,
                [memeId]: {
                    ...interaction,
                    isUpvoted: !wasUpvoted,
                    isDownvoted: false,
                    upvotes: interaction.upvotes + (wasUpvoted ? -1 : 1),
                    downvotes: wasDownvoted ? interaction.downvotes - 1 : interaction.downvotes
                }
            }
        });
    },

    downvote: (memeId: string) => {
        const { interactions } = get();
        const interaction = interactions[memeId];
        if (!interaction) {
            console.warn(`Attempted to downvote uninitialized meme: ${memeId}`);
            return;
        }

        const wasUpvoted = interaction.isUpvoted;
        const wasDownvoted = interaction.isDownvoted;

        set({
            interactions: {
                ...interactions,
                [memeId]: {
                    ...interaction,
                    isUpvoted: false,
                    isDownvoted: !wasDownvoted,
                    upvotes: wasUpvoted ? interaction.upvotes - 1 : interaction.upvotes,
                    downvotes: interaction.downvotes + (wasDownvoted ? -1 : 1)
                }
            }
        });
    },

    toggleSave: (memeId: string) => {
        const { interactions } = get();
        const interaction = interactions[memeId];
        if (!interaction) {
            console.warn(`Attempted to save uninitialized meme: ${memeId}`);
            return;
        }

        set({
            interactions: {
                ...interactions,
                [memeId]: {
                    ...interaction,
                    isSaved: !interaction.isSaved
                }
            }
        });
    },

    addComment: (memeId: string, comment: Comment) => {
        const { interactions } = get();
        const interaction = interactions[memeId];
        if (!interaction) {
            console.warn(`Attempted to comment on uninitialized meme: ${memeId}`);
            return;
        }

        set({
            interactions: {
                ...interactions,
                [memeId]: {
                    ...interaction,
                    comments: [comment, ...interaction.comments],
                    commentCount: interaction.commentCount + 1
                }
            }
        });
    },

    getMemeInteraction: (memeId: string) => {
        return get().interactions[memeId];
    }
}));
