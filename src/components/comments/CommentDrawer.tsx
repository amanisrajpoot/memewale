"use client";

import { cn } from "@/lib/utils";
import { Drawer } from "@/components/ui/Drawer";
import { CommentThread } from "./CommentThread";
import { CommentInput } from "./CommentInput";
import type { Comment } from "@/data/mockComments";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";

// =============================================================================
// COMMENT DRAWER
// Bottom sheet (mobile) or side panel for displaying comments.
// =============================================================================

export interface CommentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    // Retrofitted props
    memeId?: string;
    initialCount?: number;
    // Legacy props (optional now)
    comments?: Comment[];
    commentCount?: number;
    onAddComment?: (text: string) => void;
    onReply?: (commentId: string) => void;
}

export function CommentDrawer({
    isOpen,
    onClose,
    memeId,
    initialCount = 0,
}: CommentDrawerProps & { memeId: string; initialCount?: number }) {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const { user } = useAuthStore();
    const { addToast } = useToast();

    // Fetch comments when drawer opens
    useEffect(() => {
        if (isOpen && memeId) {
            setLoading(true);
            const fetchComments = async () => {
                const { data, error } = await supabase
                    .from('comments')
                    .select('*, author:profiles(*)')
                    .eq('meme_id', memeId)
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    setComments(data.map(c => ({
                        id: c.id,
                        text: c.content,
                        createdAt: new Date(c.created_at),
                        upvotes: 0,
                        downvotes: 0,
                        author: {
                            id: c.author.id,
                            username: c.author.username,
                            displayName: c.author.full_name || c.author.username,
                            avatar: c.author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author.username}`,
                            isVerified: false
                        },
                        replies: []
                    })));
                }
                setLoading(false);
            };
            fetchComments();
        }
    }, [isOpen, memeId]);

    const handleAddComment = async (text: string) => {
        if (!user) {
            addToast("Please login to comment", "error");
            return;
        }

        // Optimistic update
        const newComment = {
            id: `temp-${Date.now()}`,
            text,
            createdAt: new Date(),
            upvotes: 0,
            downvotes: 0,
            author: {
                id: user.id,
                username: user.user_metadata.username,
                displayName: user.user_metadata.full_name,
                avatar: user.user_metadata.avatar_url,
                isVerified: false
            },
            replies: []
        };
        setComments([newComment, ...comments]);

        const { error } = await supabase.from('comments').insert({
            content: text,
            meme_id: memeId,
            user_id: user.id
        });

        if (error) {
            console.error(error);
            addToast("Failed to post comment", "error");
            // Revert optimistic update (filter out temp id)
            setComments(prev => prev.filter(c => c.id !== newComment.id));
        } else {
            // In real app, replace temp ID with real ID or re-fetch
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={`Comments`} height="full" className="lg:h-[600px]">
            {/* Comments list */}
            <div className="flex-1 overflow-y-auto pb-4">
                {loading ? (
                    <div className="p-8 text-center text-[var(--foreground-muted)]">Loading...</div>
                ) : comments.length === 0 ? (
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
                                onReply={() => { }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Input - full width */}
            <div className="sticky bottom-0 bg-[var(--background-elevated)] border-t border-[var(--border)] pt-4 pb-6">
                <CommentInput onSubmit={handleAddComment} />
            </div>
        </Drawer>
    );
}

export default CommentDrawer;
