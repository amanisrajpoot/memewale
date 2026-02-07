"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { MemeCard } from "@/components/feed/MemeCard";
import { SearchBar } from "@/components/discovery/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Stack } from "@/components/layout";
import { Search, SearchX, Loader2 } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MemeSkeleton } from "@/components/feed/MemeSkeleton";
import { TrendingSection } from "@/components/discovery/TrendingSection";
import type { Meme } from "@/lib/types";

// Mapper function (should ideally be shared with FeedContainer)
const mapMeme = (item: any): Meme => ({
    id: item.id,
    shortId: item.short_id,
    caption: item.caption,
    mediaUrl: item.media_url,
    mediaType: item.media_type || "image",
    creator: {
        id: item.author.id,
        username: item.author.username,
        displayName: item.author.full_name || item.author.username,
        avatarUrl: item.author.avatar_url || `https://ui-avatars.com/api/?name=${item.author.username}&background=random`,
        isVerified: item.author.is_verified || false,
        bio: item.author.bio || null,
        createdAt: item.author.created_at || new Date().toISOString(),
        badges: [],
        stats: {
            followers: 0,
            following: 0,
            memesPosted: 0,
            totalUpvotes: 0,
            totalShares: 0
        }
    },
    stats: {
        upvotes: item.upvote_count || 0,
        downvotes: item.downvote_count || 0,
        comments: item.comment_count || 0,
        shares: item.share_count || 0,
        saves: 0,
        views: 0,
        score: 0
    },
    userInteraction: null,
    createdAt: item.created_at,
    tags: [],
});

function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";

    const [items, setItems] = useState<Meme[]>([]);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    // Filter memes based on search query
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setItems([]);
                return;
            }

            setLoading(true);
            try {
                // Simple search on caption for now
                const { data, error } = await supabase
                    .from('memes')
                    .select('*, author:profiles!memes_author_id_fkey(*)')
                    .ilike('caption', `%${query}%`)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setItems((data || []).map(mapMeme));
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSearch = (newQuery: string) => {
        if (newQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(newQuery)}`);
        }
    };

    return (
        <div className="feed-container">
            <div className="mb-8">
                <SearchBar
                    placeholder="Search memes, creators, tags..."
                    className="w-full mb-4 md:hidden"
                    onSearch={handleSearch}
                    defaultValue={query}
                />
                <h1 className="text-xl font-semibold text-[var(--foreground)]">
                    {query ? (
                        <>
                            Results for <span className="text-[var(--accent-primary)]">"{query}"</span>
                        </>
                    ) : (
                        "Search Memes"
                    )}
                </h1>

                {query && (
                    <p className="text-sm text-[var(--foreground-muted)] mt-1">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" /> Searching...
                            </span>
                        ) : (
                            items.length === 0
                                ? "No results found"
                                : `Found ${items.length} ${items.length === 1 ? 'result' : 'results'}`
                        )}
                    </p>
                )}
            </div>

            {
                !query ? (
                    <Stack space="xl">
                        <EmptyState
                            icon={Search}
                            title="Start Searching"
                            description="Enter a keyword to find the best memes!"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 animate-fade-in">
                            <section className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] overflow-hidden h-fit">
                                <div className="p-4 border-b border-[var(--border)]">
                                    <h2 className="font-bold flex items-center gap-2">
                                        🔥 Trending Now
                                    </h2>
                                </div>
                                <div className="p-2">
                                    <TrendingSection />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-lg font-bold">Suggested Searches</h2>
                                <div className="flex flex-wrap gap-2">
                                    {['IPL 2026', 'Shark Tank', 'Wickets', 'Tech Life', 'Monday Blues'].map(term => (
                                        <button
                                            key={term}
                                            onClick={() => handleSearch(term)}
                                            className="px-4 py-2 rounded-full bg-[var(--muted)] hover:bg-[var(--accent-primary)] hover:text-white transition-all text-sm font-medium"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg">
                                    <h3 className="font-bold mb-2 text-lg">Daily Meme Challenge</h3>
                                    <p className="text-sm opacity-90 mb-4">Post a meme about "AI taking over" and get featured on the Trending page!</p>
                                    <button
                                        onClick={() => router.push('/submit')}
                                        className="px-4 py-2 bg-white text-[var(--accent-primary)] rounded-lg text-sm font-bold hover:shadow-md transition-shadow"
                                    >
                                        Join Challenge
                                    </button>
                                </div>
                            </section>
                        </div>
                    </Stack>
                ) : items.length === 0 && !loading ? (
                    <EmptyState
                        icon={SearchX}
                        title="No Results Found"
                        description={`We couldn't find any memes matching "${query}". Try different keywords!`}
                    />
                ) : (
                    <div className="flex flex-col gap-6">
                        {loading && items.length === 0 ? (
                            <>
                                <MemeSkeleton />
                                <MemeSkeleton />
                            </>
                        ) : (
                            items.map((meme) => (
                                <MemeCard key={meme.id} meme={meme} />
                            ))
                        )}
                    </div>
                )
            }
        </div >
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="feed-container">
                <MemeSkeleton />
                <MemeSkeleton />
                <MemeSkeleton />
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}
