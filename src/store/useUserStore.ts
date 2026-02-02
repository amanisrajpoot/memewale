import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface UserStore {
    followedUsers: Set<string>;
    isLoading: boolean;
    init: (currentUserId: string | undefined) => Promise<void>;
    followUser: (targetUserId: string, currentUserId: string) => Promise<void>;
    unfollowUser: (targetUserId: string, currentUserId: string) => Promise<void>;
    isFollowing: (userId: string) => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
    followedUsers: new Set<string>(),
    isLoading: false,

    init: async (currentUserId) => {
        if (!currentUserId) {
            set({ followedUsers: new Set() });
            return;
        }
        set({ isLoading: true });
        const supabase = createClient();
        const { data } = await supabase
            .from('followers')
            .select('following_id')
            .eq('follower_id', currentUserId);

        if (data) {
            const ids = new Set(data.map(d => d.following_id));
            set({ followedUsers: ids, isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },

    followUser: async (targetUserId, currentUserId) => {
        // Optimistic update
        set((state) => ({
            followedUsers: new Set(state.followedUsers).add(targetUserId)
        }));

        const supabase = createClient();
        const { error } = await supabase
            .from('followers')
            .insert({ follower_id: currentUserId, following_id: targetUserId });

        if (error) {
            console.error("Follow failed:", error);
            // Revert
            set((state) => {
                const newSet = new Set(state.followedUsers);
                newSet.delete(targetUserId);
                return { followedUsers: newSet };
            });
        }
    },

    unfollowUser: async (targetUserId, currentUserId) => {
        // Optimistic
        set((state) => {
            const newSet = new Set(state.followedUsers);
            newSet.delete(targetUserId);
            return { followedUsers: newSet };
        });

        const supabase = createClient();
        const { error } = await supabase
            .from('followers')
            .delete()
            .match({ follower_id: currentUserId, following_id: targetUserId });

        if (error) {
            console.error("Unfollow failed:", error);
            // Revert
            set((state) => ({
                followedUsers: new Set(state.followedUsers).add(targetUserId)
            }));
        }
    },

    isFollowing: (userId: string) => {
        return get().followedUsers.has(userId);
    }
}));

