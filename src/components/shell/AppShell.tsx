"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TopNav } from "./TopNav";
import { BottomBar } from "./BottomBar";
import { SideRail } from "./SideRail";
import { Stack } from "@/components/layout";
import { mockTrendingHashtags } from "@/data/mockTrending";

// =============================================================================
// APP SHELL
// Full-width layout with flexible middle section.
// Left and right sidebars have fixed widths, middle section fills remaining space.
// =============================================================================

export interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="app-container">
            {/* Top Navigation - Mobile Only */}
            <div className="lg:hidden">
                <TopNav />
            </div>

            {/* Main Layout Container - FULL WIDTH FLEX */}
            <div className="flex min-h-screen w-full">

                {/* LEFT RAIL (Sticky Sidebar) - FIXED WIDTH */}
                <header
                    className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen z-[var(--z-sticky)] border-r border-[var(--border)]"
                    style={{
                        width: "var(--sidebar-width)"
                        /* Removed paddingInlineStart to eliminate wasted space */
                    }}
                >
                    {/* Logo Area for Desktop */}
                    <div
                        className="flex items-center mb-2"
                        style={{
                            height: "var(--nav-height)",
                            paddingInline: "var(--space-md)" /* Padding only for logo area */
                        }}
                    >
                        <span className="text-2xl mr-2">😂</span>
                        <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">Memewale</span>
                    </div>
                    <SideRail />
                </header>

                {/* CENTER COLUMN (Main Content) - FLEXIBLE WIDTH */}
                <main
                    className="flex-1 min-h-screen border-r border-[var(--border)] border-l lg:border-l-0"
                    style={{
                        paddingBlockStart: "var(--safe-top)",
                        paddingBlockEnd: "var(--safe-bottom)"
                    }}
                >
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
                            <div style={{ padding: "var(--space-sm)" }} className="space-y-3">
                                {mockTrendingHashtags.map((hashtag) => (
                                    <a
                                        key={hashtag.id}
                                        href={`/search?q=${hashtag.tag}`}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--muted)] transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{hashtag.emoji}</span>
                                            <span className="text-sm font-semibold text-[var(--foreground)]">#{hashtag.tag}</span>
                                        </div>
                                        <span className="text-xs text-[var(--foreground-muted)]">{(hashtag.count / 1000).toFixed(1)}K</span>
                                    </a>
                                ))}
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
