import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Meme } from '@/lib/types';
import type { Comment } from '@/lib/types'; // Unified types

const supabase = createClient();

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
    initializeMeme: (meme: Meme, comments: Comment[]) => void;
    upvote: (memeId: string, userId: string) => Promise<void>;
    downvote: (memeId: string, userId: string) => Promise<void>;
    toggleSave: (memeId: string, userId: string) => Promise<void>;
    addComment: (memeId: string, comment: Comment) => void;
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
                        isUpvoted: meme.userInteraction?.hasUpvoted || false,
                        isDownvoted: meme.userInteraction?.hasDownvoted || false,
                        isSaved: meme.userInteraction?.hasSaved || false,
                        upvotes: meme.stats?.upvotes || 0,
                        downvotes: meme.stats?.downvotes || 0,
                        comments: comments,
                        commentCount: meme.stats?.comments || 0
                    }
                }
            });
        }
    },

    upvote: async (memeId: string, userId: string) => {
        const { interactions } = get();
        const interaction = interactions[memeId];
        if (!interaction) return;

        const wasUpvoted = interaction.isUpvoted;
        const wasDownvoted = interaction.isDownvoted;

        // Optimistic Update
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

        // Database Call
        try {
            if (wasUpvoted) {
                // Remove upvote
                await supabase.from('meme_votes').delete().match({ user_id: userId, meme_id: memeId });
            } else {
                // Remove existing downvote first if any (to be safe, though constraint might handle it or error)
                if (wasDownvoted) {
                    await supabase.from('meme_votes').delete().match({ user_id: userId, meme_id: memeId });
                }
                // Add upvote
                await supabase.from('meme_votes').upsert({ user_id: userId, meme_id: memeId, value: 1 });
            }
        } catch (error) {
            console.error('Upvote failed:', error);
            // In a real app, revert state here
        }
    },

    downvote: async (memeId: string, userId: string) => {
        const { interactions } = get();
        const interaction = interactions[memeId];
        if (!interaction) return;

        const wasUpvoted = interaction.isUpvoted;
        const wasDownvoted = interaction.isDownvoted;

        // Optimistic Update
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

        // Database Call
        try {
            if (wasDownvoted) {
                await supabase.from('meme_votes').delete().match({ user_id: userId, meme_id: memeId });
            } else {
                if (wasUpvoted) {
                    await supabase.from('meme_votes').delete().match({ user_id: userId, meme_id: memeId });
                }
                await supabase.from('meme_votes').upsert({ user_id: userId, meme_id: memeId, value: -1 });
            }
        } catch (error) {
            console.error('Downvote failed:', error);
        }
    },

    toggleSave: async (memeId: string, userId: string) => {
        const { interactions } = get();
        const interaction = interactions[memeId];
        if (!interaction) return;

        const wasSaved = interaction.isSaved;

        set({
            interactions: {
                ...interactions,
                [memeId]: {
                    ...interaction,
                    isSaved: !wasSaved
                }
            }
        });

        try {
            if (wasSaved) {
                await supabase.from('saved_memes').delete().match({ user_id: userId, meme_id: memeId });
            } else {
                await supabase.from('saved_memes').insert({ user_id: userId, meme_id: memeId });
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    },

    addComment: (memeId: string, comment: Comment) => {
        const { interactions } = get();
        const interaction = interactions[memeId];
        if (!interaction) return;

        set({
            interactions: {
                ...interactions,
                [memeId]: {
                    ...interaction,
                    comments: [...interaction.comments, comment],
                    commentCount: interaction.commentCount + 1
                }
            }
        });
    },

    getMemeInteraction: (memeId: string) => {
        return get().interactions[memeId];
    }
}));
