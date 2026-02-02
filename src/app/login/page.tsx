"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthModalStore } from "@/store/useAuthModalStore";

export default function LoginPage() {
    const router = useRouter();
    const { openModal } = useAuthModalStore();

    useEffect(() => {
        // Redirect to home and open login modal
        router.replace("/");
        // Small timeout to ensure navigation happens before modal opening if needed, 
        // strictly though, we can just open it.
        setTimeout(() => openModal('login'), 100);
    }, [router, openModal]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--muted)]"></div>
                <div className="h-4 w-32 bg-[var(--muted)] rounded"></div>
            </div>
        </div>
    );
}
