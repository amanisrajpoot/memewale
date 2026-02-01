"use client";

import { FeedContainer } from "@/components/feed/FeedContainer";
import { TagFilter } from "@/components/discovery/TagFilter";
import { mockMemes, mockTags } from "@/data/mockMemes";
import { cn } from "@/lib/utils";
import { Stack } from "@/components/layout";

// =============================================================================
// HOME PAGE
// The main feed where users discover memes.
// Uses the new fluid layout system for app-like responsive behavior.
// =============================================================================

const feedTabs = [
  { id: "all", label: "All", isActive: true },
  { id: "trending", label: "🔥 Trending", isActive: false },
  ...mockTags.slice(0, 5).map((tag) => ({
    id: tag.slug,
    label: `${tag.emoji} ${tag.name}`,
    isActive: false,
  })),
];

export default function HomePage() {
  return (
    <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      <Stack space="lg">
        {/* Page header */}
        <header style={{ paddingBlockStart: "var(--space-sm)" }}>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            For You
          </h1>
          <p
            className="text-sm text-[var(--foreground-muted)]"
            style={{ marginBlockStart: "var(--space-3xs)" }}
          >
            Fresh memes, just for you 😂
          </p>
        </header>

        {/* Tag filters - horizontal scroll */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
          <TagFilter
            tags={[
              { id: "trending", label: "Trending", emoji: "🔥" },
              ...mockTags.map(t => ({ id: t.slug, label: t.name, emoji: t.emoji }))
            ]}
            onSelectTag={(id) => console.log("Selected tag:", id)}
            selectedTag="all"
          />
        </div>

        {/* Feed - meme cards with optimized spacing */}
        <FeedContainer />
      </Stack>
    </div>
  );
}
