"use client";

import { cn } from "@/lib/utils";
import { Drawer } from "@/components/ui/Drawer";
import { CommentThread } from "./CommentThread";
import { CommentInput } from "./CommentInput";
import type { Comment } from "@/data/mockComments";
import { X } from "lucide-react";

// =============================================================================
// COMMENT DRAWER
// Bottom sheet (mobile) or side panel for displaying comments.
// =============================================================================

export interface CommentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    comments: Comment[];
    commentCount: number;
    onAddComment?: (text: string) => void;
    onReply?: (commentId: string) => void;
}

export function CommentDrawer({
    isOpen,
    onClose,
    comments,
    commentCount,
    onAddComment,
    onReply,
}: CommentDrawerProps) {
    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={`Comments (${commentCount})`} height="full" className="lg:h-[600px]">
            <div className="flex flex-col h-full">
                {/* Comments list */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {comments.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[var(--foreground-muted)]">
                                No comments yet. Be the first to comment!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <CommentThread
                                    key={comment.id}
                                    comment={comment}
                                    onReply={onReply}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="pt-2 sticky bottom-0 bg-[var(--background-elevated)]">
                    <CommentInput onSubmit={onAddComment} />
                </div>
            </div>
        </Drawer>
    );
}

export default CommentDrawer;
