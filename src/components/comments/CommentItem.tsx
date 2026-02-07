"use client";

import { cn } from "@/lib/utils";
import { formatTimeAgo, formatCount } from "@/lib/utils";
import type { Comment } from "@/lib/types";
import { ArrowBigUp, ArrowBigDown, MessageCircle, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState, useCallback } from "react";

// =============================================================================
// COMMENT ITEM
// Single comment display with upvote/downvote and reply.
// =============================================================================

export interface CommentItemProps {
    comment: Comment;
    isReply?: boolean;
    onReply?: (commentId: string) => void;
    className?: string;
}

export function CommentItem({
    comment,
    isReply = false,
    onReply,
    className,
}: CommentItemProps) {
    const [isUpvoted, setIsUpvoted] = useState(comment.userVote === 'up');
    const [isDownvoted, setIsDownvoted] = useState(comment.userVote === 'down');
    const [upvoteCount, setUpvoteCount] = useState(comment.upvotes);

    const handleUpvote = useCallback(() => {
        if (isUpvoted) {
            setIsUpvoted(false);
            setUpvoteCount((prev) => prev - 1);
        } else {
            setIsUpvoted(true);
            setIsDownvoted(false);
            setUpvoteCount((prev) => prev + (isDownvoted ? 2 : 1));
        }
    }, [isUpvoted, isDownvoted]);

    const handleDownvote = useCallback(() => {
        if (isDownvoted) {
            setIsDownvoted(false);
            setUpvoteCount((prev) => prev + 1);
        } else {
            setIsDownvoted(true);
            setIsUpvoted(false);
            setUpvoteCount((prev) => prev - (isUpvoted ? 2 : 1));
        }
    }, [isUpvoted, isDownvoted]);

    const netVotes = upvoteCount - comment.downvotes;

    return (
        <div className={cn("flex gap-4 items-start w-full", className)}>
            {/* Avatar - larger and more visible */}
            <div className="shrink-0">
                <Image
                    src={comment.author.avatarUrl || `https://ui-avatars.com/api/?name=${comment.author.username}&background=random`}
                    alt={comment.author.displayName}
                    width={isReply ? 32 : 40}
                    height={isReply ? 32 : 40}
                    className="rounded-full bg-neutral-800"
                />
            </div>

            {/* Content - more breathing room */}
            <div className="flex-1 space-y-2">
                {/* Header - better spacing */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[var(--foreground)] hover:text-[var(--accent-primary)] cursor-pointer transition-colors">
                        {comment.author.displayName}
                    </span>
                    {comment.author.isVerified && (
                        <span className="text-[var(--accent-primary)]">✓</span>
                    )}
                    <span className="text-xs text-[var(--foreground-muted)]">
                        {formatTimeAgo(comment.createdAt)}
                    </span>
                </div>

                {/* Text - much more readable */}
                <p className="text-sm text-[var(--foreground)] leading-relaxed break-words">
                    {comment.content}
                </p>

                {/* Actions - better spacing */}
                <div className="flex items-center gap-4 pt-1">
                    {/* Vote buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleUpvote}
                            className={cn(
                                "flex items-center justify-center p-1.5 rounded-full hover:bg-[var(--muted)] transition-colors",
                                isUpvoted ? "text-[var(--upvote)]" : "text-[var(--foreground-muted)]"
                            )}
                            title="Upvote"
                        >
                            <ArrowBigUp className={cn("w-4 h-4", isUpvoted && "fill-current")} />
                        </button>
                        <span className={cn(
                            "text-sm font-semibold min-w-[24px] text-center",
                            isUpvoted ? "text-[var(--upvote)]" : isDownvoted ? "text-[var(--downvote)]" : "text-[var(--foreground-muted)]"
                        )}>
                            {formatCount(netVotes)}
                        </span>
                        <button
                            onClick={handleDownvote}
                            className={cn(
                                "flex items-center justify-center p-1.5 rounded-full hover:bg-[var(--muted)] transition-colors",
                                isDownvoted ? "text-[var(--downvote)]" : "text-[var(--foreground-muted)]"
                            )}
                            title="Downvote"
                        >
                            <ArrowBigDown className={cn("w-4 h-4", isDownvoted && "fill-current")} />
                        </button>
                    </div>

                    {/* Reply button */}
                    <button
                        onClick={() => onReply?.(comment.id)}
                        className="text-sm font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommentItem;
