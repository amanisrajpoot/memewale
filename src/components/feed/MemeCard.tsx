"use client";

import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";
import type { Meme } from "@/data/mockMemes";
import { MediaRenderer } from "./MediaRenderer";
import { MemeCaption } from "./MemeCaption";
import { MemeActions } from "./MemeActions";
import { MemeMeta } from "./MemeMeta";
import { CommentDrawer } from "@/components/comments";
import { ShareModal } from "@/components/ui/ShareModal";
import { useMemeStore } from "@/store/useMemeStore";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// =============================================================================
// MEME CARD
// A properly styled card with clear visual boundaries.
// Now uses centralized store for interactions.
// =============================================================================

export interface MemeCardProps {
    meme: Meme;
    priority?: boolean;
    className?: string;
}

export function MemeCard({ meme, priority = false, className }: MemeCardProps) {
    const { initializeMeme, upvote, downvote, toggleSave, addComment, getMemeInteraction } = useMemeStore();
    const { user } = useAuthStore();
    const { addToast } = useToast();
    const [showHeart, setShowHeart] = useState(false);
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const supabase = createClient();

    // Initialize meme in store
    useEffect(() => {
        initializeMeme(meme, []);
    }, [meme, initializeMeme]);

    // Get current interaction state
    const interaction = getMemeInteraction(meme.id);
    const isUpvoted = interaction?.isUpvoted ?? false;
    const isDownvoted = interaction?.isDownvoted ?? false;
    const isSaved = interaction?.isSaved ?? false;
    const upvoteCount = interaction?.upvotes ?? meme.upvotes;
    const commentCount = interaction?.commentCount ?? meme.comments;
    const comments = interaction?.comments ?? [];

    const handleDoubleTap = useCallback(() => {
        if (!isUpvoted) {
            if (user) {
                upvote(meme.id, user.id);
                setShowHeart(true);
                addToast('Upvoted!', 'success');
                setTimeout(() => setShowHeart(false), 800);
            } else {
                addToast('Please login to vote!', 'error');
            }
        }
    }, [isUpvoted, meme.id, upvote, addToast, user]);

    const handleUpvote = useCallback(() => {
        if (!user) {
            addToast('Please login to vote!', 'error');
            return;
        }
        upvote(meme.id, user.id);
        addToast(isUpvoted ? 'Upvote removed' : 'Upvoted!', 'success');
    }, [meme.id, upvote, isUpvoted, addToast, user]);

    const handleDownvote = useCallback(() => {
        if (!user) {
            addToast('Please login to vote!', 'error');
            return;
        }
        downvote(meme.id, user.id);
        addToast(isDownvoted ? 'Downvote removed' : 'Downvoted', 'info');
    }, [meme.id, downvote, isDownvoted, addToast, user]);

    const handleSave = useCallback(() => {
        if (!user) {
            addToast('Please login to save!', 'error');
            return;
        }
        toggleSave(meme.id, user.id);
        addToast(isSaved ? 'Removed from saved' : 'Saved to collections!', 'success');
    }, [meme.id, toggleSave, isSaved, addToast, user]);

    const handleShare = useCallback(() => {
        setIsShareModalOpen(true);
    }, []);

    const handleDownload = useCallback(() => {
        const link = document.createElement("a");
        link.href = meme.mediaUrl;
        link.download = `meme-${meme.id}.jpg`;
        link.click();
        addToast('Download started!', 'success');
    }, [meme.mediaUrl, meme.id, addToast]);

    const handleAddComment = useCallback((text: string) => {
        const newComment = {
            id: `comment-${Date.now()}`,
            author: {
                id: 'current-user',
                username: 'memelover69',
                displayName: 'Meme Lover',
                avatar: 'https://i.pravatar.cc/150?u=memelover',
                isVerified: false,
                followers: 0,
                memesPosted: 0
            },
            text: text,
            upvotes: 0,
            downvotes: 0,
            createdAt: new Date(),
            replies: []
        };
        addComment(meme.id, newComment);
        addToast('Comment posted!', 'success');
    }, [meme.id, addComment, addToast]);

    // Follow state from store
    const { followUser, unfollowUser, isFollowing: checkIsFollowing } = useUserStore();
    const isFollowing = checkIsFollowing(meme.creator.id);
    const isOwnMeme = user?.id === meme.creator.id;

    const handleFollow = useCallback(async () => {
        if (!user) {
            addToast('Please login to follow!', 'error');
            return;
        }

        if (isFollowing) {
            await unfollowUser(meme.creator.id, user.id);
            addToast(`Unfollowed ${meme.creator.displayName}`, 'success');
        } else {
            await followUser(meme.creator.id, user.id);
            addToast(`Following ${meme.creator.displayName}!`, 'success');
        }
    }, [isFollowing, meme.creator.id, meme.creator.displayName, followUser, unfollowUser, addToast, user]);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/meme/${meme.id}` : '';

    // View Counting
    useEffect(() => {
        // Simple view counting on mount
        const incrementView = async () => {
            try {
                const { error } = await supabase.rpc('increment_view_count', { meme_id: meme.id });
                if (error) {
                    // Check for missing function error (Postgres 42883)
                    if (error.code === '42883' || error.message?.includes('function') || Object.keys(error).length === 0) {
                        console.warn("View counting setup required: 'increment_view_count' RPC function is missing or invalid. Please run the setup SQL.");
                    } else {
                        console.error("Error incrementing view:", error);
                    }
                }
            } catch (err) {
                console.error("Unexpected error in view counting:", err);
            }
        };

        // Timeout to prevent counting rapid scrolls
        const timer = setTimeout(incrementView, 2000);
        return () => clearTimeout(timer);
    }, [meme.id]);

    return (
        <article
            className={cn(
                "meme-card",
                className
            )}
        >
            {/* Header */}
            <div className="meme-card-header">
                <MemeMeta
                    creator={meme.creator}
                    createdAt={meme.createdAt}
                    onCreatorClick={() => { }}
                    onFollowClick={isOwnMeme ? undefined : handleFollow}
                    isFollowing={isFollowing}
                    onMoreClick={() => addToast('More options coming soon!', 'info')}
                />
            </div>

            {/* Media */}
            <div className="relative w-full bg-[var(--background-elevated)] overflow-hidden">
                <Link href={`/meme/${meme.id}`} className="block cursor-pointer">
                    <MediaRenderer
                        src={meme.mediaUrl}
                        alt={meme.caption}
                        type={meme.mediaType}
                        className="w-full object-contain bg-black/5"
                        priority={priority}
                        onDoubleClick={handleDoubleTap}
                    />
                </Link>
                {showHeart && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="heart-burst text-6xl">❤️</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="meme-card-actions">
                <MemeActions
                    upvotes={upvoteCount}
                    downvotes={meme.downvotes}
                    comments={commentCount}
                    shares={meme.shares}
                    views={(meme as any).views || 0} // Cast to any until interface is updated
                    isUpvoted={isUpvoted}
                    isDownvoted={isDownvoted}
                    isSaved={isSaved}
                    onUpvote={handleUpvote}
                    onDownvote={handleDownvote}
                    onComment={() => setIsCommentDrawerOpen(true)}
                    onShare={handleShare}
                    onSave={handleSave}
                    onDownload={handleDownload}
                />
            </div>

            {/* Caption */}
            <div className="meme-card-caption">
                <MemeCaption text={meme.caption} />
            </div>

            {/* Tags */}
            {meme.tags.length > 0 && (
                <div className="meme-card-tags">
                    {meme.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="meme-tag">#{tag}</span>
                    ))}
                </div>
            )}

            {/* Comments Drawer */}
            <CommentDrawer
                isOpen={isCommentDrawerOpen}
                onClose={() => setIsCommentDrawerOpen(false)}
                memeId={meme.id}
                initialCount={commentCount}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                url={shareUrl}
                title={meme.caption}
            />
        </article>
    );
}

export default MemeCard;
