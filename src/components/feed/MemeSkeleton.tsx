"use client";

import { cn } from "@/lib/utils";

export interface MemeSkeletonProps {
    className?: string;
}

export function MemeSkeleton({ className }: MemeSkeletonProps) {
    return (
        <article className={cn("meme-card", className)}>
            {/* Header Skeleton */}
            <div className="meme-card-header">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[var(--muted)] animate-shimmer" />

                    {/* Creator info */}
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-[var(--muted)] rounded animate-shimmer" />
                        <div className="h-3 w-20 bg-[var(--muted)] rounded animate-shimmer" />
                    </div>
                </div>
            </div>

            {/* Media Skeleton */}
            <div className="meme-card-media">
                <div className="w-full aspect-square bg-[var(--muted)] animate-shimmer" />
            </div>

            {/* Actions Skeleton */}
            <div className="meme-card-actions">
                <div className="flex items-center gap-2">
                    <div className="h-9 w-24 bg-[var(--muted)] rounded-full animate-shimmer" />
                    <div className="h-9 w-20 bg-[var(--muted)] rounded-full animate-shimmer" />
                    <div className="h-9 w-9 bg-[var(--muted)] rounded-full animate-shimmer" />
                </div>
            </div>

            {/* Caption Skeleton */}
            <div className="meme-card-caption space-y-2">
                <div className="h-4 w-full bg-[var(--muted)] rounded animate-shimmer" />
                <div className="h-4 w-3/4 bg-[var(--muted)] rounded animate-shimmer" />
            </div>

            {/* Tags Skeleton */}
            <div className="meme-card-tags flex gap-2">
                <div className="h-6 w-16 bg-[var(--muted)] rounded-full animate-shimmer" />
                <div className="h-6 w-20 bg-[var(--muted)] rounded-full animate-shimmer" />
                <div className="h-6 w-16 bg-[var(--muted)] rounded-full animate-shimmer" />
            </div>
        </article>
    );
}
