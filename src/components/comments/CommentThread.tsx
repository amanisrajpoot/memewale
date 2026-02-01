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
        <div className={cn("group", className)}>
            {/* Parent comment */}
            <CommentItem comment={comment} onReply={onReply} />

            {/* Replies */}
            {hasReplies && (
                <div className="relative mt-4 ml-6 pl-6 space-y-4">
                    {/* Thread line */}
                    <div className="absolute left-0 top-0 bottom-4 w-[2px] bg-[var(--border)] rounded-full opacity-40" />

                    {comment.replies!.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            isReply
                            className="relative"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentThread;
