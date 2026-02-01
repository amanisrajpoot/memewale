import { create } from 'zustand';

interface UserStore {
    followedUsers: Set<string>;
    followUser: (userId: string) => void;
    unfollowUser: (userId: string) => void;
    isFollowing: (userId: string) => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
    followedUsers: new Set<string>(),

    followUser: (userId: string) => {
        set((state) => ({
            followedUsers: new Set(state.followedUsers).add(userId)
        }));
    },

    unfollowUser: (userId: string) => {
        set((state) => {
            const newSet = new Set(state.followedUsers);
            newSet.delete(userId);
            return { followedUsers: newSet };
        });
    },

    isFollowing: (userId: string) => {
        return get().followedUsers.has(userId);
    }
}));
