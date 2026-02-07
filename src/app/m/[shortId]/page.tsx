"use client";

import { use, useEffect, useState } from "react";
import { notFound, redirect } from "next/navigation";
import { MemeCard } from "@/components/feed/MemeCard";
import { CommentThread } from "@/components/comments/CommentThread";
import { CommentInput } from "@/components/comments/CommentInput";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/useAuthStore";
import { isValidShortId } from "@/lib/shortId";
import type { Meme, Comment } from "@/lib/types";

interface MemeShortPageProps {
    params: Promise<{
        shortId: string;
    }>;
}

export default function MemeShortPage({ params }: MemeShortPageProps) {
    const { shortId } = use(params);
    const [meme, setMeme] = useState<Meme | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [relatedMemes, setRelatedMemes] = useState<Meme[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const supabase = createClient();
    const { addToast } = useToast();
    const { user } = useAuthStore();
    const [replyingToId, setReplyingToId] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeme = async () => {
            // Validate short ID format
            if (!isValidShortId(shortId)) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('memes')
                .select(`
                    *,
                    author:profiles!memes_author_id_fkey(*)
                `)
                .eq('short_id', shortId)
                .single();

            if (error) {
                console.error("Error fetching meme:", error);
            } else if (data) {
                // Map to Meme interface
                const mappedMeme: Meme = {
                    id: data.id,
                    caption: data.caption,
                    mediaUrl: data.media_url,
                    mediaType: data.media_type || "image",
                    creator: {
                        id: data.author.id,
                        username: data.author.username,
                        displayName: data.author.full_name || data.author.username,
                        avatarUrl: data.author.avatar_url || `https://ui-avatars.com/api/?name=${data.author.username}&background=random`,
                        isVerified: data.author.is_verified || false,
                        bio: data.author.bio || null,
                        createdAt: data.author.created_at || new Date().toISOString(),
                        badges: [],
                        stats: {
                            followers: 0,
                            following: 0,
                            memesPosted: 0,
                            totalUpvotes: 0,
                            totalShares: 0
                        }
                    },
                    stats: {
                        upvotes: data.upvote_count || 0,
                        downvotes: data.downvote_count || 0,
                        comments: data.comment_count || 0,
                        shares: data.share_count || 0,
                        saves: 0,
                        views: 0,
                        score: 0
                    },
                    userInteraction: null,
                    createdAt: data.created_at,
                    tags: [],
                    shortId: data.short_id,
                };
                setMeme(mappedMeme);

                // Fetch related memes (same author or similar tags)
                fetchRelatedMemes(data.author.id, data.id);
            }
            setLoading(false);
        };

        const fetchRelatedMemes = async (authorId: string, currentMemeId: string) => {
            const { data } = await supabase
                .from('memes')
                .select(`*, author:profiles!memes_author_id_fkey(*)`)
                .eq('author_id', authorId)
                .neq('id', currentMemeId)
                .limit(3);

            if (data) {
                setRelatedMemes(data.map((item: any): Meme => ({
                    id: item.id,
                    caption: item.caption,
                    mediaUrl: item.media_url,
                    mediaType: item.media_type || "image",
                    creator: {
                        id: item.author.id,
                        username: item.author.username,
                        displayName: item.author.full_name || item.author.username,
                        avatarUrl: item.author.avatar_url || `https://ui-avatars.com/api/?name=${item.author.username}&background=random`,
                        isVerified: item.author.is_verified || false,
                        bio: item.author.bio || null,
                        createdAt: item.author.created_at || new Date().toISOString(),
                        badges: [],
                        stats: {
                            followers: 0,
                            following: 0,
                            memesPosted: 0,
                            totalUpvotes: 0,
                            totalShares: 0
                        }
                    },
                    stats: {
                        upvotes: item.upvote_count || 0,
                        downvotes: item.downvote_count || 0,
                        comments: item.comment_count || 0,
                        shares: item.share_count || 0,
                        saves: 0,
                        views: 0,
                        score: 0
                    },
                    userInteraction: null,
                    createdAt: item.created_at,
                    tags: [],
                    shortId: item.short_id,
                })));
            }
        };

        fetchMeme();
    }, [shortId, supabase]);

    // Define fetchComments outside useEffect so handleAddComment can call it
    const fetchComments = async () => {
        if (!meme) return;
        setCommentsLoading(true);

        // Fetch ALL comments for this meme to build a tree client-side
        const { data: allComments, error } = await supabase
            .from('comments')
            .select('*, author:profiles(*)')
            .eq('meme_id', meme.id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching comments:", error);
            setCommentsLoading(false);
            return;
        }

        if (allComments) {
            // Helper to map DB row to Comment type
            const mapComment = (c: any): Comment => ({
                id: c.id,
                memeId: c.meme_id,
                content: c.content,
                author: {
                    id: c.author.id,
                    username: c.author.username,
                    displayName: c.author.full_name || c.author.username,
                    avatarUrl: c.author.avatar_url || `https://ui-avatars.com/api/?name=${c.author.username}&background=random`,
                    isVerified: c.author.is_verified || false,
                    bio: c.author.bio || null,
                    createdAt: c.author.created_at || new Date().toISOString(),
                    badges: [],
                    stats: { followers: 0, following: 0, memesPosted: 0, totalUpvotes: 0, totalShares: 0 }
                },
                createdAt: c.created_at,
                upvotes: 0,
                downvotes: 0,
                parentId: c.parent_id,
                replyCount: 0,
                userVote: null,
                replies: []
            });

            // Build tree structure
            const commentMap = new Map<string, Comment>();
            const roots: Comment[] = [];

            allComments.forEach(c => {
                const commentId = String(c.id).toLowerCase().trim();
                commentMap.set(commentId, mapComment(c));
            });

            allComments.forEach(c => {
                const commentId = String(c.id).toLowerCase().trim();
                const comment = commentMap.get(commentId)!;

                if (c.parent_id) {
                    const parentId = String(c.parent_id).toLowerCase().trim();
                    if (commentMap.has(parentId)) {
                        const parent = commentMap.get(parentId)!;
                        parent.replies.push(comment);
                        parent.replyCount++;
                    } else {
                        console.warn(`[Comments Debug] Parent ${parentId} not found for ${commentId}`);
                        roots.push(comment);
                    }
                } else {
                    roots.push(comment);
                }
            });

            // Sort roots by newest first (Reddit/Twitter style)
            setComments(roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
        setCommentsLoading(false);
    };

    // Fetch comments
    useEffect(() => {
        fetchComments();
    }, [meme, supabase]);

    const handleAddComment = async (text: string, parentId?: string) => {
        if (!user) {
            addToast("Please login to comment", "error");
            return;
        }

        if (!meme) return;

        const { error } = await supabase.from('comments').insert({
            content: text,
            meme_id: meme.id,
            user_id: user.id,
            parent_id: parentId || null
        });

        if (error) {
            addToast("Failed to post comment", "error");
        } else {
            addToast(parentId ? "Reply posted!" : "Comment posted!", "success");
            setReplyingToId(null);
            fetchComments();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
            </div>
        );
    }

    if (!meme) {
        notFound();
    }

    return (
        <div className="feed-container pt-8">
            <div className="max-w-3xl mx-auto">
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Back to Feed
                </Link>

                {/* Main meme card */}
                <MemeCard meme={meme} className="mb-12" />

                {/* Comments Section */}
                <div className="space-y-8 mt-12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                            <MessageCircle size={20} />
                            Comments ({comments.length})
                        </h2>
                    </div>

                    {/* Comment Input */}
                    <div className="bg-[var(--background-elevated)] rounded-xl p-4 border border-[var(--border)]">
                        <CommentInput onSubmit={handleAddComment} placeholder="Share your thoughts..." />
                    </div>

                    {/* Comments List */}
                    {commentsLoading ? (
                        <div className="text-center py-8 text-[var(--foreground-muted)]">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-12 bg-[var(--background-elevated)] rounded-xl border border-[var(--border)]">
                            <MessageCircle className="w-12 h-12 mx-auto text-[var(--foreground-muted)] mb-3" />
                            <p className="text-[var(--foreground-muted)] font-medium">Be the first to comment!</p>
                            <p className="text-sm text-[var(--foreground-subtle)] mt-1">Share what you think about this meme</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <CommentThread
                                    key={comment.id}
                                    comment={comment}
                                    onReply={setReplyingToId}
                                    replyingToId={replyingToId}
                                    onCommentAdd={handleAddComment}
                                    isReply={false}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Related Memes */}
                {relatedMemes.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-[var(--border)] space-y-6">
                        <h2 className="text-xl font-bold text-[var(--foreground)]">
                            More from {meme.creator.displayName}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {relatedMemes.map((relatedMeme) => (
                                <Link key={relatedMeme.id} href={relatedMeme.shortId ? `/m/${relatedMeme.shortId}` : `/meme/${relatedMeme.id}`}>
                                    <div className="aspect-square relative rounded-xl overflow-hidden hover:opacity-80 transition-opacity border border-[var(--border)]">
                                        <img
                                            src={relatedMeme.mediaUrl}
                                            alt={relatedMeme.caption || "Meme"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
