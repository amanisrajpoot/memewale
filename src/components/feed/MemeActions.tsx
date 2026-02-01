"use client";

import { cn } from "@/lib/utils";
import { formatCount } from "@/data/mockMemes";
import {
    ArrowBigUp,
    ArrowBigDown,
    MessageCircle,
    Share2,
    Bookmark,
    Download,
} from "lucide-react";

// =============================================================================
// MEME ACTIONS
// Interactive buttons: upvote, downvote, comment, share, save, download.
// =============================================================================

export interface MemeActionsProps {
    upvotes: number;
    downvotes: number;
    comments: number;
    shares: number;
    isUpvoted?: boolean;
    isDownvoted?: boolean;
    isSaved?: boolean;
    onUpvote?: () => void;
    onDownvote?: () => void;
    onComment?: () => void;
    onShare?: () => void;
    onSave?: () => void;
    onDownload?: () => void;
    className?: string;
}

export function MemeActions({
    upvotes,
    downvotes,
    comments,
    isUpvoted = false,
    isDownvoted = false,
    isSaved = false,
    onUpvote,
    onDownvote,
    onComment,
    onShare,
    onSave,
    onDownload,
    className,
}: MemeActionsProps) {
    const netVotes = upvotes - downvotes;

    return (
        <div
            className={cn(
                "flex items-center gap-1",
                className
            )}
        >
            {/* Upvote/Downvote group */}
            <div className="flex items-center rounded-full bg-[var(--muted)]">
                <button
                    onClick={onUpvote}
                    className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-l-full transition-all",
                        "hover:bg-[var(--muted-hover)]",
                        isUpvoted && "bg-[var(--upvote)]/20 text-[var(--upvote)]"
                    )}
                    aria-label="Upvote"
                >
                    <ArrowBigUp
                        className={cn("w-5 h-5 transition-all", isUpvoted && "fill-current scale-110")}
                    />
                    <span className={cn("text-sm font-medium", isUpvoted && "font-bold")}>{formatCount(netVotes)}</span>
                </button>
                <div className="w-px h-5 bg-[var(--border)]" />
                <button
                    onClick={onDownvote}
                    className={cn(
                        "flex items-center px-3 py-2 rounded-r-full transition-all",
                        "hover:bg-[var(--muted-hover)]",
                        isDownvoted && "bg-[var(--downvote)]/20 text-[var(--downvote)]"
                    )}
                    aria-label="Downvote"
                >
                    <ArrowBigDown
                        className={cn("w-5 h-5 transition-all", isDownvoted && "fill-current scale-110")}
                    />
                </button>
            </div>

            {/* Comment button */}
            <button
                onClick={onComment}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors",
                    "bg-[var(--muted)] hover:bg-[var(--muted-hover)]"
                )}
                aria-label="Comments"
            >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{formatCount(comments)}</span>
            </button>

            {/* Share button */}
            <button
                onClick={onShare}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors",
                    "bg-[var(--muted)] hover:bg-[var(--muted-hover)]"
                )}
                aria-label="Share"
            >
                <Share2 className="w-5 h-5" />
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Save button */}
            <button
                onClick={onSave}
                className={cn(
                    "p-2 rounded-full transition-all",
                    "hover:bg-[var(--muted)]",
                    isSaved && "bg-[var(--save)]/20 text-[var(--save)]"
                )}
                aria-label={isSaved ? "Unsave" : "Save"}
            >
                <Bookmark className={cn("w-5 h-5 transition-all", isSaved && "fill-current scale-110")} />
            </button>

            {/* Download button */}
            <button
                onClick={onDownload}
                className={cn(
                    "p-2 rounded-full transition-colors",
                    "hover:bg-[var(--muted)]"
                )}
                aria-label="Download"
            >
                <Download className="w-5 h-5" />
            </button>
        </div>
    );
}

export default MemeActions;
