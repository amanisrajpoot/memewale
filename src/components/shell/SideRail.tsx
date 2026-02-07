"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Stack } from "@/components/layout";
import {
    Home,
    TrendingUp,
    PlusSquare,
    Bookmark,
    User,
    Hash,
    Flame,
    Settings,
    Bell,
    LogIn,
    LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// =============================================================================
// SIDE RAIL
// Desktop sidebar with navigation, tags, and trending.
// Redesigned with fluid spacing and better typography.
// =============================================================================

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    onClick?: () => void;
}

const mainNavItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/?sort=trending", label: "Trending", icon: TrendingUp },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/submit", label: "Submit Meme", icon: PlusSquare },
    { href: "/collections", label: "Collections", icon: Bookmark },
    { href: "/u/memelord42", label: "Profile", icon: User },
];

// Popular tags removed


// Popular tags ... existing code ...

export function SideRail() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const supabase = createClient();
    const { openModal } = useAuthModalStore();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        router.push("/login");
    };

    const dynamicNavItems = [
        ...mainNavItems.filter(item => {
            // Hide restricted items if not logged in
            if (!user && ["Notifications", "Submit Meme", "Collections", "Profile"].includes(item.label)) {
                return false;
            }
            // Always hide Profile from this list (it's added dynamically below)
            if (item.label === "Profile") return false;
            return true;
        }),
        // Add Profile link dynamically if logged in
        ...(user ? [{
            href: `/u/${useAuthStore.getState().profile?.username || user.user_metadata.username || 'user'}`,
            label: "Profile",
            icon: User
        }] : []),
        // Add Settings link if logged in
        ...(user ? [{ href: "/settings", label: "Settings", icon: Settings }] : []),
        // Add Logout if logged in
        ...(user ? [{ href: "#", label: "Log Out", icon: LogOut, onClick: handleLogout }] : []),
        // Add Login link if not logged in
        ...(!user ? [{ href: "/login", label: "Login / Sign Up", icon: LogIn }] : [])
    ];

    return (
        <aside
            className="flex flex-col flex-1 w-full bg-[var(--background)] overflow-hidden"
            style={{
                paddingInline: "var(--space-md)",
            }}
        >
            {/* Scrollable Navigation Area */}
            <div
                className="flex-1 overflow-y-auto no-scrollbar"
                style={{
                    paddingTop: "var(--space-md)",
                }}
            >
                <Stack space="lg">
                    {/* Main navigation */}
                    <nav>
                        <Stack space="xs">
                            {dynamicNavItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                // Handle Button items (Login, Logout)
                                if (item.label === "Login / Sign Up" || item.label === "Log Out") {
                                    const isDestructive = item.label === "Log Out";
                                    return (
                                        <button
                                            key={item.label}
                                            onClick={item.onClick || (() => openModal('login'))}
                                            className={cn(
                                                "flex items-center gap-4 rounded-xl font-medium transition-all text-[var(--foreground-muted)] hover:bg-[var(--muted)]",
                                                isDestructive ? "hover:text-[var(--destructive)]" : "hover:text-[var(--foreground)]"
                                            )}
                                            style={{
                                                paddingInline: "var(--space-md)",
                                                paddingBlock: "var(--space-xs)",
                                                fontSize: "1rem",
                                                width: "100%",
                                                textAlign: "left"
                                            }}
                                        >
                                            <Icon size={24} />
                                            {item.label}
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 rounded-xl font-medium transition-all relative group overflow-hidden",
                                            isActive
                                                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold"
                                                : "text-[var(--foreground-muted)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                        )}
                                        style={{
                                            paddingInline: "var(--space-md)",
                                            paddingBlock: "var(--space-xs)",
                                            fontSize: "1rem",
                                            transition: "all var(--transition-fast)"
                                        }}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_8px_var(--accent-primary)]" />
                                        )}
                                        <Icon size={24} className={isActive ? "text-[var(--accent-primary)]" : ""} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </Stack>
                    </nav>
                </Stack>
            </div>

            {/* Copyright Footer - Pinned to bottom */}
            <div className="shrink-0 pt-2 pb-6 text-center">
                <p className="text-[var(--foreground-subtle)]" style={{ fontSize: "0.6875rem", lineHeight: "1.5" }}>
                    © 2026 Memewale<br />Meme Culture First 😂
                </p>
            </div>
        </aside>
    );
}

export default SideRail;
