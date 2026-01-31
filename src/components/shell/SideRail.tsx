"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    TrendingUp,
    PlusSquare,
    Bookmark,
    User,
    Hash,
    Flame,
    Settings,
} from "lucide-react";

// =============================================================================
// SIDE RAIL
// Desktop sidebar with navigation, tags, and trending.
// Fixed position, visible on lg+ screens only.
// =============================================================================

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const mainNavItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/submit", label: "Submit Meme", icon: PlusSquare },
    { href: "/collections", label: "Collections", icon: Bookmark },
    { href: "/profile", label: "Profile", icon: User },
];

// Popular tags for quick filtering
const popularTags = [
    { tag: "desi", emoji: "🇮🇳", count: "12.5K" },
    { tag: "bollywood", emoji: "🎬", count: "8.2K" },
    { tag: "cricket", emoji: "🏏", count: "6.8K" },
    { tag: "wholesome", emoji: "🥰", count: "5.1K" },
    { tag: "darkhumor", emoji: "💀", count: "4.3K" },
    { tag: "relatable", emoji: "😅", count: "3.9K" },
];

export function SideRail() {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                // Show only on desktop
                "hidden lg:flex",
                // Positioning
                "fixed top-[var(--nav-height)] left-0 bottom-0",
                "z-[var(--z-fixed)]",
                // Size
                "w-[var(--sidebar-width)]",
                // Styling
                "bg-[var(--background)]",
                "border-r border-[var(--border)]",
                // Layout
                "flex-col",
                // Scrollable content
                "overflow-y-auto",
                "scrollbar-hide"
            )}
        >
            {/* Main navigation */}
            <nav className="px-3 pt-6 pb-5">
                <ul className="space-y-3">
                    {mainNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        // Base styles
                                        "flex items-center gap-4",
                                        "px-4 py-3",
                                        "rounded-xl",
                                        "text-[15px]",
                                        "font-medium",
                                        "transition-all duration-200",
                                        // Active/hover states
                                        isActive
                                            ? "bg-[var(--accent-primary)] text-[var(--background)] font-semibold shadow-sm"
                                            : "text-[var(--foreground-muted)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Divider */}
            <div className="mx-3 border-t border-[var(--border)]" />

            {/* Popular Tags */}
            <div className="px-3 py-6">
                <h3 className="flex items-center gap-2 px-3 mb-4 mt-2 text-[var(--text-xs)] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">
                    <Hash size={12} />
                    Popular Tags
                </h3>
                <ul className="space-y-2">
                    {popularTags.map((item) => (
                        <li key={item.tag}>
                            <Link
                                href={`/?tag=${item.tag}`}
                                className={cn(
                                    "flex items-center justify-between",
                                    "px-4 py-2.5",
                                    "rounded-lg",
                                    "text-sm",
                                    "text-[var(--foreground-muted)]",
                                    "transition-colors duration-200",
                                    "hover:bg-[var(--muted)]",
                                    "hover:text-[var(--foreground)]"
                                )}>
                                <span className="flex items-center gap-2">
                                    <span className="text-base">{item.emoji}</span>
                                    <span>#{item.tag}</span>
                                </span>
                                <span className="text-[var(--text-xs)] text-[var(--foreground-subtle)]">
                                    {item.count}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Divider */}
            <div className="mx-3 border-t border-[var(--border)]" />

            {/* Trending Creators (placeholder) */}
            <div className="px-3 py-6">
                <h3 className="flex items-center gap-2 px-3 mb-2 text-[var(--text-xs)] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">
                    <Flame size={12} />
                    Top Creators
                </h3>
                <div className="px-3 py-2 text-[var(--text-sm)] text-[var(--foreground-subtle)]">
                    Coming soon...
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer links */}
            <div className="px-3 py-6 border-t border-[var(--border)]">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3",
                        "px-3 py-2",
                        "rounded-[var(--radius-md)]",
                        "text-[var(--text-sm)]",
                        "text-[var(--foreground-muted)]",
                        "transition-all duration-[var(--transition-fast)]",
                        "hover:bg-[var(--muted)]",
                        "hover:text-[var(--foreground)]"
                    )}
                >
                    <Settings size={16} />
                    Settings
                </Link>

                <p className="mt-3 px-3 text-[var(--text-xs)] text-[var(--foreground-subtle)]">
                    © 2026 Memewale
                    <br />
                    Meme Culture First 😂
                </p>
            </div>
        </aside>
    );
}

export default SideRail;
