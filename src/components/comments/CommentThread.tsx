"use client";

import { cn } from "@/lib/utils";
import type { Comment } from "@/data/mockComments";
import { CommentItem } from "./CommentItem";

// =============================================================================
// COMMENT THREAD
// Displays a comment with its nested replies.
// =============================================================================

export interface CommentThreadProps {
    comment: Comment;
    onReply?: (commentId: string) => void;
    className?: string;
}

export function CommentThread({
    comment,
    onReply,
    className,
}: CommentThreadProps) {
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
        <div className={cn("space-y-4", className)}>
            {/* Parent comment */}
            <CommentItem comment={comment} onReply={onReply} />

            {/* Replies */}
            {hasReplies && (
                <div className="space-y-3 border-l-2 border-[var(--border)] ml-4 pl-2">
                    {comment.replies!.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} isReply />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentThread;
