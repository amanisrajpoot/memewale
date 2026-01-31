"use client";

import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import type { Meme } from "@/data/mockMemes";
import { MediaRenderer } from "./MediaRenderer";
import { MemeCaption } from "./MemeCaption";
import { MemeActions } from "./MemeActions";
import { MemeMeta } from "./MemeMeta";
import { CommentDrawer } from "@/components/comments";
import { mockComments } from "@/data/mockComments";

// =============================================================================
// MEME CARD
// A properly styled card with clear visual boundaries.
// =============================================================================

export interface MemeCardProps {
    meme: Meme;
    priority?: boolean;
    className?: string;
}

export function MemeCard({ meme, priority = false, className }: MemeCardProps) {
    const [isUpvoted, setIsUpvoted] = useState(meme.isUpvoted ?? false);
    const [isDownvoted, setIsDownvoted] = useState(meme.isDownvoted ?? false);
    const [isSaved, setIsSaved] = useState(meme.isSaved ?? false);
    const [showHeart, setShowHeart] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(meme.upvotes);
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

    const handleDoubleTap = useCallback(() => {
        if (!isUpvoted) {
            setIsUpvoted(true);
            setIsDownvoted(false);
            setUpvoteCount((prev) => prev + 1);
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 800);
        }
    }, [isUpvoted]);

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

    const handleSave = useCallback(() => setIsSaved((prev) => !prev), []);

    const handleShare = useCallback(() => {
        if (navigator.share) {
            navigator.share({ title: "Check out this meme!", text: meme.caption, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    }, [meme.caption]);

    const handleDownload = useCallback(() => {
        const link = document.createElement("a");
        link.href = meme.mediaUrl;
        link.download = `meme-${meme.id}.jpg`;
        link.click();
    }, [meme.mediaUrl, meme.id]);

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
                    onFollowClick={() => { }}
                    onMoreClick={() => { }}
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
                    comments={meme.comments}
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
                comments={mockComments}
                commentCount={meme.comments}
                onAddComment={(text) => console.log("Add comment:", text)}
                onReply={(commentId) => console.log("Reply to:", commentId)}
            />
        </article>
    );
}

export default MemeCard;
