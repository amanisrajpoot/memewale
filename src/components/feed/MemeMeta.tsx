"use client";

import { cn } from "@/lib/utils";
import { formatTimeAgo, formatCount, type Creator } from "@/data/mockMemes";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
        <div className={cn("flex items-center justify-between gap-4", className)}>
            {/* Left: Creator info */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Avatar */}
                <button
                    onClick={onCreatorClick}
                    className="shrink-0 rounded-full ring-2 ring-[var(--border)] hover:ring-[var(--accent-primary)] transition-all overflow-hidden"
                >
                    <Image
                        src={creator.avatar}
                        alt={creator.displayName}
                        width={44}
                        height={44}
                        className="rounded-full object-cover aspect-square"
                    />
                </button>

                {/* Name & time */}
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <button
                        onClick={onCreatorClick}
                        className="flex items-center gap-2 group"
                    >
                        <span className="font-bold text-sm text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                            {creator.displayName}
                        </span>
                        {creator.isVerified && (
                            <span className="text-[var(--accent-primary)] shrink-0 text-base">
                                ✓
                            </span>
                        )}
                    </button>
                    <span className="text-xs text-[var(--foreground-muted)]">
                        @{creator.username} · {formatTimeAgo(createdAt)}
                    </span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Follow button */}
                {onFollowClick && (
                    <Button
                        variant={isFollowing ? "secondary" : "primary"}
                        size="sm"
                        onClick={onFollowClick}
                        className={cn(
                            "px-5 py-2 text-sm font-bold min-w-[90px] transition-all",
                            isFollowing && "bg-[var(--muted)] hover:bg-[var(--muted-hover)] text-[var(--foreground)]"
                        )}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </Button>
                )}

                {/* More options */}
                <Button
                    variant="icon"
                    size="sm"
                    onClick={onMoreClick}
                    className="p-2.5"
                    aria-label="More options"
                >
                    <MoreHorizontal size={20} />
                </Button>
            </div>
        </div>
    );
}

export default MemeMeta;
