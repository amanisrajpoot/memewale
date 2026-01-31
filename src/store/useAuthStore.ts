import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    avatar: string;
    username: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: () => set({
        isAuthenticated: true,
        user: {
            id: '1',
            name: 'Meme Lover',
            avatar: 'https://i.pravatar.cc/150?u=memelover',
            username: 'memelover69'
        }
    }),
    logout: () => set({ isAuthenticated: false, user: null }),
}));
