import { create } from 'zustand';

type AuthView = 'login' | 'signup' | 'forgot-password';

interface AuthModalStore {
    isOpen: boolean;
    view: AuthView;
    openModal: (view?: AuthView) => void;
    closeModal: () => void;
    setView: (view: AuthView) => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
    isOpen: false,
    view: 'login',
    openModal: (view = 'login') => set({ isOpen: true, view }),
    closeModal: () => set({ isOpen: false }),
    setView: (view) => set({ view }),
}));
