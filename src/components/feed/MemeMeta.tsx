"use client";

import { cn } from "@/lib/utils";
import { formatTimeAgo, formatCount, type Creator } from "@/data/mockMemes";
import { BadgeCheck, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// =============================================================================
// MEME META
// Creator info: avatar, username, verified badge, timestamp, follow button.
// =============================================================================

export interface MemeMetaProps {
    creator: Creator;
    createdAt: Date;
    onCreatorClick?: () => void;
    onFollowClick?: () => void;
    onMoreClick?: () => void;
    isFollowing?: boolean;
    className?: string;
}

export function MemeMeta({
    creator,
    createdAt,
    onCreatorClick,
    onFollowClick,
    onMoreClick,
    isFollowing = false,
    className,
}: MemeMetaProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* Avatar */}
            <button
                onClick={onCreatorClick}
                className="shrink-0 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-[var(--accent-primary)] transition-all"
            >
                <Image
                    src={creator.avatar}
                    alt={creator.displayName}
                    width={44}
                    height={44}
                    className="rounded-full"
                />
            </button>

            {/* Username & timestamp */}
            <div className="flex-1 min-w-0">
                <button
                    onClick={onCreatorClick}
                    className="flex items-center gap-1 hover:text-[var(--accent-primary)] transition-colors"
                >
                    <span className="font-semibold text-[var(--foreground)] truncate">
                        {creator.displayName}
                    </span>
                    {creator.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    )}
                </button>
                <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                    <span>@{creator.username}</span>
                    <span>·</span>
                    <span>{formatTimeAgo(createdAt)}</span>
                </div>
            </div>

            {/* Follow button */}
            {!isFollowing && (
                <button
                    onClick={onFollowClick}
                    className={cn(
                        "flex items-center justify-center h-8 px-4 rounded-full text-sm font-semibold transition-colors",
                        "bg-[var(--accent-primary)] text-[hsl(220,25%,10%)]",
                        "hover:bg-[var(--accent-primary-hover)]",
                        "active:scale-95"
                    )}
                >
                    Follow
                </button>
            )}

            {/* More options */}
            <button
                onClick={onMoreClick}
                className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors"
                aria-label="More options"
            >
                <MoreHorizontal className="w-5 h-5 text-[var(--foreground-muted)]" />
            </button>
        </div>
    );
}

export default MemeMeta;
