"use client";

import { cn } from "@/lib/utils";
import { formatTimeAgo, formatCount } from "@/data/mockMemes";
import type { Comment } from "@/data/mockComments";
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
    const [isUpvoted, setIsUpvoted] = useState(comment.isUpvoted ?? false);
    const [isDownvoted, setIsDownvoted] = useState(comment.isDownvoted ?? false);
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
        <div className={cn("flex gap-3", isReply && "ml-12", className)}>
            {/* Avatar */}
            <Image
                src={comment.author.avatar}
                alt={comment.author.displayName}
                width={isReply ? 28 : 36}
                height={isReply ? 28 : 36}
                className="rounded-full shrink-0"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-0.5 text-sm">
                    <span className="font-semibold text-[var(--foreground)] hover:underline cursor-pointer">
                        {comment.author.displayName}
                    </span>
                    <span className="text-[var(--foreground-muted)] text-xs">
                        {formatTimeAgo(comment.createdAt)}
                    </span>
                </div>

                {/* Text */}
                <p className="text-[15px] text-[var(--foreground)] leading-relaxed text-pretty">
                    {comment.text}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-5 mt-2">
                    {/* Vote buttons */}
                    <div className="flex items-center gap-1 group">
                        <button
                            onClick={handleUpvote}
                            className={cn(
                                "p-0.5 -ml-1 rounded hover:bg-[var(--muted)] transition-colors",
                                isUpvoted && "text-[var(--upvote)]"
                            )}
                        >
                            <ArrowBigUp className={cn("w-5 h-5 transition-transform group-hover:-translate-y-0.5", isUpvoted && "fill-current")} />
                        </button>
                        <span className={cn(
                            "text-xs font-medium min-w-[20px] text-center",
                            isUpvoted ? "text-[var(--upvote)]" : "text-[var(--foreground-muted)]"
                        )}>
                            {formatCount(netVotes)}
                        </span>
                        <button
                            onClick={handleDownvote}
                            className={cn(
                                "p-0.5 rounded hover:bg-[var(--muted)] transition-colors",
                                isDownvoted && "text-[var(--downvote)]"
                            )}
                        >
                            <ArrowBigDown className={cn("w-5 h-5 transition-transform group-hover:translate-y-0.5", isDownvoted && "fill-current")} />
                        </button>
                    </div>

                    {/* Reply button */}
                    {!isReply && (
                        <button
                            onClick={() => onReply?.(comment.id)}
                            className="text-xs font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                        >
                            Reply
                        </button>
                    )}

                    {/* More options - hidden by default, visible on hover */}
                    <button className="text-[var(--foreground-subtle)] opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommentItem;
