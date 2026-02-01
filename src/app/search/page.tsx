"use client";

import { useSearchParams } from "next/navigation";
import { FeedContainer } from "@/components/feed/FeedContainer";
import { SearchBar } from "@/components/discovery/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search } from "lucide-react";
import { Suspense } from "react";

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");

    return (
        <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
            <div className="mb-8">
                <SearchBar
                    placeholder="Search again..."
                    className="w-full mb-4 md:hidden"
                    onSearch={(q) => console.log(q)}
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
                        Searching...
                    </p>
                )}
            </div>

            {query ? (
                <FeedContainer />
            ) : (
                <EmptyState
                    icon={Search}
                    title="Start Searching"
                    description="Enter a keyword, hashtag, or creator name to find the best memes!"
                />
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}
