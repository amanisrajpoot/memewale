"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setIsLoading } = useAuthStore();
    const supabase = createClient();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        initializeAuth();

        const fetchProfile = async (userId: string) => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (!error && data) {
                    useAuthStore.getState().setProfile(data);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const user = session?.user ?? null;
                setUser(user);

                if (user) {
                    await fetchProfile(user.id);
                } else {
                    useAuthStore.getState().setProfile(null);
                }

                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [setUser, setIsLoading, supabase]);

    return <>{children}</>;
}
