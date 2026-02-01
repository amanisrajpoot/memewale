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
} from "lucide-react";

// =============================================================================
// SIDE RAIL
// Desktop sidebar with navigation, tags, and trending.
// Redesigned with fluid spacing and better typography.
// =============================================================================

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const mainNavItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search?q=trending", label: "Trending", icon: TrendingUp },
    { href: "/submit", label: "Submit Meme", icon: PlusSquare },
    { href: "/collections", label: "Collections", icon: Bookmark },
    { href: "/u/memelord42", label: "Profile", icon: User },
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
            className="flex flex-col h-full bg-[var(--background)] overflow-y-auto"
            style={{
                paddingInline: "var(--space-md)",
                paddingBlock: "var(--space-lg)"
            }}
        >
            <Stack space="xl">
                {/* Main navigation */}
                <nav>
                    <Stack space="xs">
                        {mainNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 rounded-xl font-medium transition-all",
                                        isActive
                                            ? "bg-[var(--accent-primary)] text-[var(--background)] font-semibold shadow-sm"
                                            : "text-[var(--foreground-muted)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                    )}
                                    style={{
                                        paddingInline: "var(--space-md)",
                                        paddingBlock: "var(--space-sm)",
                                        fontSize: "0.9375rem", // 15px
                                        transition: "all var(--transition-fast)"
                                    }}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </Stack>
                </nav>

                {/* Divider */}
                <div
                    className="border-t border-[var(--border)]"
                    style={{ marginInline: "calc(var(--space-md) * -1)" }}
                />

                {/* Popular Tags */}
                <div>
                    <h3
                        className="flex items-center gap-2 font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider"
                        style={{
                            paddingInline: "var(--space-sm)",
                            marginBlockEnd: "var(--space-sm)",
                            fontSize: "0.6875rem", // 11px
                            letterSpacing: "0.05em"
                        }}
                    >
                        <Hash size={14} />
                        Popular Tags
                    </h3>
                    <Stack space="2xs">
                        {popularTags.map((item) => (
                            <Link
                                key={item.tag}
                                href={`/?tag=${item.tag}`}
                                className="flex items-center justify-between rounded-lg text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                style={{
                                    paddingInline: "var(--space-sm)",
                                    paddingBlock: "var(--space-xs)",
                                    fontSize: "0.875rem", // 14px
                                    transition: "all var(--transition-fast)"
                                }}
                            >
                                <span className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                                    <span style={{ fontSize: "1.125rem" }}>{item.emoji}</span>
                                    <span>#{item.tag}</span>
                                </span>
                                <span
                                    className="text-[var(--foreground-subtle)]"
                                    style={{ fontSize: "0.6875rem" }}
                                >
                                    {item.count}
                                </span>
                            </Link>
                        ))}
                    </Stack>
                </div>

                {/* Divider */}
                <div
                    className="border-t border-[var(--border)]"
                    style={{ marginInline: "calc(var(--space-md) * -1)" }}
                />

                {/* Trending Creators (placeholder) */}
                <div>
                    <h3
                        className="flex items-center gap-2 font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider"
                        style={{
                            paddingInline: "var(--space-sm)",
                            marginBlockEnd: "var(--space-xs)",
                            fontSize: "0.6875rem",
                            letterSpacing: "0.05em"
                        }}
                    >
                        <Flame size={14} />
                        Top Creators
                    </h3>
                    <div
                        className="text-[var(--foreground-subtle)]"
                        style={{
                            paddingInline: "var(--space-sm)",
                            paddingBlock: "var(--space-xs)",
                            fontSize: "0.875rem"
                        }}
                    >
                        Coming soon...
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer links */}
                <div
                    className="border-t border-[var(--border)]"
                    style={{
                        marginInline: "calc(var(--space-md) * -1)",
                        paddingBlockStart: "var(--space-lg)"
                    }}
                >
                    <Stack space="sm">
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 rounded-lg text-[var(--foreground-muted)] transition-all hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                            style={{
                                paddingInline: "var(--space-sm)",
                                paddingBlock: "var(--space-xs)",
                                fontSize: "0.875rem",
                                transition: "all var(--transition-fast)"
                            }}
                        >
                            <Settings size={18} />
                            Settings
                        </Link>

                        <p
                            className="text-[var(--foreground-subtle)]"
                            style={{
                                paddingInline: "var(--space-sm)",
                                fontSize: "0.6875rem",
                                lineHeight: "1.5"
                            }}
                        >
                            © 2026 Memewale
                            <br />
                            Meme Culture First 😂
                        </p>
                    </Stack>
                </div>
            </Stack>
        </aside>
    );
}

export default SideRail;
