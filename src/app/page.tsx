"use client";

import { Suspense } from "react";
import { FeedContainer } from "@/components/feed/FeedContainer";
import { TagFilter } from "@/components/discovery/TagFilter";
import { cn } from "@/lib/utils";
import { Stack } from "@/components/layout";
import { useRouter, useSearchParams } from "next/navigation";

// =============================================================================
// HOME PAGE
// The main feed where users discover memes.
// Uses the new fluid layout system for app-like responsive behavior.
// =============================================================================

// Initial tags (could be fetched from DB in future)
const feedTabs = [
  { id: "all", label: "All", isActive: true },
  { id: "trending", label: "🔥 Trending", isActive: false },
  { id: "desi", label: "🇮🇳 Desi", isActive: false },
  { id: "cricket", label: "🏏 Cricket", isActive: false },
  { id: "tech", label: "💻 Tech", isActive: false },
];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("sort") || "all";

  const handleTabChange = (id: string) => {
    router.push(`/?sort=${id}`);
  };

  return (
    <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      <Stack space="lg">
        {/* Page header */}
        <header>
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
            tags={feedTabs.map(t => ({ id: t.id, label: t.label, emoji: "" }))}
            onSelectTag={handleTabChange}
            selectedTag={activeTab}
          />
        </div>

        {/* Feed - meme cards with optimized spacing */}
        <FeedContainer sortBy={activeTab === 'trending' ? 'trending' : 'latest'} />
      </Stack>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin text-[var(--accent-primary)]">⏳</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
