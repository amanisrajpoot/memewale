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
import { mockComments } from "@/data/mockComments";
import { useMemeStore } from "@/store/useMemeStore";
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "@/hooks/useToast";

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
    const { addToast } = useToast();
    const [showHeart, setShowHeart] = useState(false);
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Initialize meme in store
    useEffect(() => {
        initializeMeme(meme, mockComments);
    }, [meme, initializeMeme]);

    // Get current interaction state
    const interaction = getMemeInteraction(meme.id);
    const isUpvoted = interaction?.isUpvoted ?? false;
    const isDownvoted = interaction?.isDownvoted ?? false;
    const isSaved = interaction?.isSaved ?? false;
    const upvoteCount = interaction?.upvotes ?? meme.upvotes;
    const commentCount = interaction?.commentCount ?? meme.comments;
    const comments = interaction?.comments ?? mockComments;

    const handleDoubleTap = useCallback(() => {
        if (!isUpvoted) {
            upvote(meme.id);
            setShowHeart(true);
            addToast('Upvoted!', 'success');
            setTimeout(() => setShowHeart(false), 800);
        }
    }, [isUpvoted, meme.id, upvote, addToast]);

    const handleUpvote = useCallback(() => {
        upvote(meme.id);
        addToast(isUpvoted ? 'Upvote removed' : 'Upvoted!', 'success');
    }, [meme.id, upvote, isUpvoted, addToast]);

    const handleDownvote = useCallback(() => {
        downvote(meme.id);
        addToast(isDownvoted ? 'Downvote removed' : 'Downvoted', 'info');
    }, [meme.id, downvote, isDownvoted, addToast]);

    const handleSave = useCallback(() => {
        toggleSave(meme.id);
        addToast(isSaved ? 'Removed from saved' : 'Saved to collections!', 'success');
    }, [meme.id, toggleSave, isSaved, addToast]);

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

    const handleFollow = useCallback(() => {
        if (isFollowing) {
            unfollowUser(meme.creator.id);
            addToast(`Unfollowed ${meme.creator.displayName}`, 'success');
        } else {
            followUser(meme.creator.id);
            addToast(`Following ${meme.creator.displayName}!`, 'success');
        }
    }, [isFollowing, meme.creator.id, meme.creator.displayName, followUser, unfollowUser, addToast]);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/meme/${meme.id}` : '';

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
                    onFollowClick={handleFollow}
                    isFollowing={isFollowing}
                    onMoreClick={() => addToast('More options coming soon!', 'info')}
                />
            </div>

            {/* Media */}
            <div className="meme-card-media">
                <MediaRenderer
                    src={meme.mediaUrl}
                    alt={meme.caption}
                    type={meme.mediaType}
                    aspectRatio={meme.aspectRatio}
                    priority={priority}
                    onDoubleClick={handleDoubleTap}
                />
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
                comments={comments}
                commentCount={commentCount}
                onAddComment={handleAddComment}
                onReply={(commentId) => addToast('Reply feature coming soon!', 'info')}
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
