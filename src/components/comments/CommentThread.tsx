"use client";

import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/types";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";

// =============================================================================
// COMMENT THREAD
// Displays a comment with its nested replies.
// =============================================================================

export interface CommentThreadProps {
    comment: Comment;
    onReply?: (commentId: string) => void;
    replyingToId?: string | null;
    onCommentAdd?: (text: string, parentId: string) => void;
    isReply?: boolean;
    level?: number;
    className?: string;
}

export function CommentThread({
    comment,
    onReply,
    replyingToId,
    onCommentAdd,
    isReply = false,
    level = 0,
    className,
}: CommentThreadProps) {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isReplying = replyingToId === comment.id;

    return (
        <div
            className={cn(
                "flex flex-col w-full",
                isReply && "border-l border-[var(--border)] border-opacity-30",
                className
            )}
            style={{
                paddingLeft: level > 0 ? '1.5rem' : '0',
                marginTop: level > 0 ? '0.5rem' : '1rem'
            }}
        >
            {/* Parent comment */}
            <div className={cn(
                "relative rounded-xl transition-all duration-200",
                isReply && "hover:bg-[var(--background-elevated)] hover:bg-opacity-50"
            )}>
                <CommentItem
                    comment={comment}
                    onReply={onReply}
                    isReply={isReply}
                />
            </div>

            {/* Reply Input */}
            {isReplying && onCommentAdd && (
                <div className="mt-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-200" style={{ marginLeft: '2.5rem' }}>
                    <CommentInput
                        onSubmit={(text) => onCommentAdd(text, comment.id)}
                        placeholder={`Reply to ${comment.author.displayName}...`}
                    />
                </div>
            )}

            {/* Nested Replies Container */}
            {hasReplies && (
                <div className="mt-2 space-y-4">
                    {comment.replies!.map((reply) => (
                        <CommentThread
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            replyingToId={replyingToId}
                            onCommentAdd={onCommentAdd}
                            isReply={true}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentThread;
