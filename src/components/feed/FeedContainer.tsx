"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MemeCard } from "@/components/feed";
import { MemeSkeleton } from "@/components/feed/MemeSkeleton";
import { mockMemes } from "@/data/mockMemes";
import { cn } from "@/lib/utils";

export function FeedContainer() {
    const [items, setItems] = useState(mockMemes);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Simulate initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Simulated load more
    const loadMore = () => {
        console.log("Loading more memes...");
        // Append duplicate memes with new IDs to simulate infinite content
        const newMemes = mockMemes.map(m => ({
            ...m,
            id: `${m.id}-${Date.now()}-${Math.random()}`
        }));

        // Artificial delay
        setTimeout(() => {
            setItems(prev => [...prev, ...newMemes]);
            setIsFetching(false);
        }, 1500);
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
