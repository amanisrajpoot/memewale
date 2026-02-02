"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MemeCard } from "@/components/feed";
import { MemeSkeleton } from "@/components/feed/MemeSkeleton";
import { mockMemes } from "@/data/mockMemes";
import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";

// Mapper function to convert DB result to Meme type
const mapMeme = (item: any): any => ({
    id: item.id,
    caption: item.caption,
    mediaUrl: item.media_url, // Changed from item.url
    mediaType: item.media_type || "image",
    creator: {
        id: item.author.id,
        username: item.author.username,
        displayName: item.author.full_name || item.author.username,
        // Fallback to UI avatars if no avatar
        avatar: item.author.avatar_url || `https://ui-avatars.com/api/?name=${item.author.username}&background=random`,
        isVerified: item.author.is_verified || false,
    },
    upvotes: item.upvote_count || 0,
    downvotes: item.downvote_count || 0,
    comments: item.comment_count || 0,
    shares: item.share_count || 0,
    createdAt: item.created_at,
    tags: [], // Tags needs a join, keeping empty for now
    isUpvoted: false, // Needs user-specific fetch
    isDownvoted: false,
    isSaved: false
});

export function FeedContainer({ sortBy = 'latest' }: { sortBy?: 'latest' | 'trending' }) {
    const [items, setItems] = useState<any[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const supabase = createClient();
    const { addToast } = useToast();

    // Initial Load
    useEffect(() => {
        setIsInitialLoading(true);
        const fetchMemes = async () => {
            let query = supabase
                .from('memes')
                .select(`
                    *,
                    author:profiles!memes_author_id_fkey(*)
                `);

            // Apply Sorting
            if (sortBy === 'trending') {
                query = query.order('upvote_count', { ascending: false });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query.limit(10);

            if (error) {
                console.error("Supabase Fetch Error:", JSON.stringify(error, null, 2));
                addToast("Failed to load feed", "error");
            } else {
                setItems((data || []).map(mapMeme));
            }
            setIsInitialLoading(false);
        };

        fetchMemes();
    }, [sortBy]); // Re-fetch when sorting changes

    const loadMore = async () => {
        // Simple pagination (cursor-based ideal, but offset for now)
        const { data, error } = await supabase
            .from('memes')
            .select(`*, author:profiles(*)`)
            .order('created_at', { ascending: false })
            .range(items.length, items.length + 9);

        if (!error && data?.length) {
            setItems(prev => [...prev, ...data.map(mapMeme)]);
            setIsFetching(false);
        } else {
            setIsFetching(false);
        }
    };

    const { observerTarget, isFetching, setIsFetching } = useInfiniteScroll(loadMore);

    // Show skeletons on initial load
    if (isInitialLoading) {
        return (
            <div className="flex flex-col">
                <MemeSkeleton />
                <MemeSkeleton />
                <MemeSkeleton />
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {items.map((meme, index) => (
                <MemeCard
                    key={meme.id}
                    meme={meme}
                    priority={index < 2}
                />
            ))}

            {/* Loading Indicator / Intersection Target */}
            <div
                ref={observerTarget}
                className="py-12 flex flex-col items-center justify-center text-[var(--foreground-muted)]"
            >
                {isFetching ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin mb-2 text-[var(--accent-primary)]" />
                        <span className="text-xs font-medium">Cooking more memes...</span>
                    </>
                ) : (
                    <span className="text-xs opacity-50">Scroll for more</span>
                )}
            </div>
        </div>
    );
}
