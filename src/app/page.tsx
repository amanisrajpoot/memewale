"use client";

import { MemeCard } from "@/components/feed";
import { TagFilter } from "@/components/discovery/TagFilter";
import { mockMemes, mockTags } from "@/data/mockMemes";
import { cn } from "@/lib/utils";

// =============================================================================
// HOME PAGE
// The main feed where users discover memes.
// Connected to mock data for realistic preview.
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
    <div className="feed-container">
      {/* Page header */}
      <header className="pt-4 pb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          For You
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Fresh memes, just for you 😂
        </p>
      </header>

      {/* Tag filters - horizontal scroll */}
      <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
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
      <div className="flex flex-col gap-10">
        {mockMemes.map((meme, index) => (
          <MemeCard
            key={meme.id}
            meme={meme}
            priority={index < 2}
          />
        ))}
      </div>

      {/* Load more indicator */}
      <div className="py-12 text-center">
        <p className="text-sm text-[var(--foreground-muted)]">
          Scroll for more 👇
        </p>
      </div>
    </div>
  );
}
