import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    // Add other fields as needed
}

interface AuthState {
    user: User | null;
    profile: Profile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setProfile: (profile: Profile | null) => void;
    setIsLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setProfile: (profile) => set({ profile }),
    setIsLoading: (isLoading) => set({ isLoading }),
    logout: () => set({ user: null, profile: null, isAuthenticated: false }),
}));
