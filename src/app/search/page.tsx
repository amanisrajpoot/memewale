"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { MemeCard } from "@/components/feed/MemeCard";
import { SearchBar } from "@/components/discovery/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, SearchX, Loader2 } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MemeSkeleton } from "@/components/feed/MemeSkeleton";
import type { Meme } from "@/data/mockMemes";

// Mapper function (should ideally be shared)
const mapMeme = (item: any): any => ({
    id: item.id,
    caption: item.caption,
    mediaUrl: item.media_url, // Fixed column name
    mediaType: item.media_type || "image",
    creator: {
        id: item.author.id,
        username: item.author.username,
        displayName: item.author.full_name || item.author.username,
        avatar: item.author.avatar_url || `https://ui-avatars.com/api/?name=${item.author.username}`,
        isVerified: item.author.is_verified || false,
    },
    upvotes: item.upvote_count || 0,
    downvotes: item.downvote_count || 0,
    comments: item.comment_count || 0,
    shares: item.share_count || 0,
    createdAt: item.created_at,
    tags: [], // TODO: fetch tags
    isUpvoted: false,
    isDownvoted: false,
    isSaved: false
});

function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";

    const [items, setItems] = useState<any[]>([]);
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
        <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
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
                    <EmptyState
                        icon={Search}
                        title="Start Searching"
                        description="Enter a keyword to find the best memes!"
                    />
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
            <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem' }}>
                <MemeSkeleton />
                <MemeSkeleton />
                <MemeSkeleton />
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}
