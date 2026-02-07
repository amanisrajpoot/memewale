"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TopNav } from "./TopNav";
import { MobileMenu } from "./MobileMenu";
import { MobileSearch } from "./MobileSearch";
import { BottomBar } from "./BottomBar";
import { SideRail } from "./SideRail";
import { Stack } from "@/components/layout";
import { TrendingSection } from "@/components/discovery/TrendingSection";
import { TopCreators } from "@/components/discovery/TopCreators";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

// =============================================================================
// APP SHELL
// Full-width layout with flexible middle section.
// Left and right sidebars have fixed widths, middle section fills remaining space.
// =============================================================================

export interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const { user } = useAuthStore();
    const { init } = useUserStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    useEffect(() => {
        init(user?.id);
    }, [user, init]);
    return (
        <div className="app-container">
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <MobileSearch isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} />

            {/* Top Navigation - Mobile Only */}
            <div className="lg:hidden">
                <TopNav
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    onSearchClick={() => setIsMobileSearchOpen(true)}
                />
            </div>

            {/* Main Layout Container - FULL WIDTH FLEX */}
            <div className="flex min-h-screen w-full">

                {/* LEFT RAIL (Sticky Sidebar) - FIXED WIDTH */}
                <header
                    className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen z-[var(--z-sticky)]"
                    style={{
                        width: "var(--sidebar-width)"
                        /* Removed paddingInlineStart to eliminate wasted space */
                    }}
                >
                    {/* Logo Area for Desktop */}
                    <Link
                        href="/"
                        className="flex items-center mb-2 hover:opacity-80 transition-opacity"
                        style={{
                            height: "var(--nav-height)",
                            paddingInline: "var(--space-md)"
                        }}
                    >
                        <span className="text-3xl mr-3">😂</span>
                        <span className="text-2xl font-black text-[var(--foreground)] tracking-tighter">Memewale</span>
                    </Link>
                    <SideRail />
                </header>

                {/* CENTER COLUMN (Main Content) - FLEXIBLE WIDTH */}
                <main
                    className={cn(
                        "flex-1 min-h-screen",
                        "lg:pt-[var(--safe-top)]",
                        "pb-[var(--bottombar-height)] lg:pb-[var(--safe-bottom)]"
                    )}
                >
                    {/* Mobile Header Spacer - Matches Nav Height to prevent overlap */}
                    <div className="w-full lg:hidden shrink-0" style={{ height: "var(--nav-height)" }} aria-hidden="true" />
                    {children}
                </main>

                {/* RIGHT RAIL (Sticky - Desktop XL only) - FIXED WIDTH */}
                <aside
                    className="hidden xl:flex flex-col shrink-0 sticky top-0 h-screen z-[var(--z-sticky)]"
                    style={{
                        width: "var(--right-rail-width)",
                        paddingBlock: "var(--space-md)",
                        paddingInline: "var(--space-md)"
                    }}
                >
                    <Stack space="lg">
                        {/* Search Bar */}
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search memes..."
                                autoComplete="off"
                                className="w-full rounded-full text-sm outline-none transition-all placeholder:text-[var(--foreground-subtle)]"
                                style={{
                                    paddingInlineStart: "2.5rem",
                                    paddingInlineEnd: "var(--space-sm)",
                                    paddingBlock: "var(--space-xs)",
                                    background: "var(--background-elevated)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "var(--radius-full)"
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value)}`;
                                    }
                                }}
                            />
                        </div>

                        {/* Trending Section */}
                        <div
                            className="overflow-hidden"
                            style={{
                                borderRadius: "var(--radius-xl)",
                                border: "1px solid var(--border)",
                                background: "var(--background-elevated)"
                            }}
                        >
                            <div
                                className="border-b border-[var(--border)]"
                                style={{ padding: "var(--space-sm)" }}
                            >
                                <h3 className="font-bold text-[var(--foreground)]">Trending Now</h3>
                            </div>
                            <TrendingSection />
                        </div>

                        {/* Top Creators */}
                        <div
                            className="overflow-hidden"
                            style={{
                                borderRadius: "var(--radius-xl)",
                                border: "1px solid var(--border)",
                                background: "var(--background-elevated)"
                            }}
                        >
                            <div
                                className="border-b border-[var(--border)]"
                                style={{ padding: "var(--space-sm)" }}
                            >
                                <h3 className="font-bold text-[var(--foreground)]">Top Creators</h3>
                            </div>
                            <div style={{ paddingInline: "var(--space-sm)" }}>
                                <TopCreators />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-xs text-[var(--foreground-subtle)]" style={{ paddingInline: "var(--space-2xs)" }}>
                            © 2026 Memewale Inc.
                        </div>
                    </Stack>
                </aside>
            </div>

            {/* Bottom Bar - Mobile only */}
            <BottomBar />
        </div>
    );
}

export default AppShell;
