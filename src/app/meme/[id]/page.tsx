"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { MemeCard } from "@/components/feed/MemeCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";

interface MemeDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MemeDetailPage({ params }: MemeDetailPageProps) {
    const { id } = use(params);
    const [meme, setMeme] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchMeme = async () => {
            // Basic UUID validation to prevent 500s on invalid IDs
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('memes')
                .select(`
                    *,
                    author:profiles!memes_author_id_fkey(*)
                `)
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching meme:", error);
            } else if (data) {
                // Map to Meme interface
                setMeme({
                    id: data.id,
                    caption: data.caption,
                    mediaUrl: data.media_url,
                    mediaType: data.media_type || "image",
                    creator: {
                        id: data.author.id,
                        username: data.author.username,
                        displayName: data.author.full_name || data.author.username,
                        avatar: data.author.avatar_url || `https://ui-avatars.com/api/?name=${data.author.username}&background=random`,
                        isVerified: data.author.is_verified || false,
                    },
                    upvotes: data.upvote_count || 0,
                    downvotes: data.downvote_count || 0,
                    comments: data.comment_count || 0,
                    shares: data.share_count || 0,
                    createdAt: data.created_at,
                    tags: [],
                    isUpvoted: false,
                    isDownvoted: false,
                    isSaved: false
                });
            }
            setLoading(false);
        };

        fetchMeme();
    }, [id, supabase]);

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
        <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '5rem' }}>
            {/* Back button */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors mb-4"
            >
                <ArrowLeft size={16} />
                Back to Feed
            </Link>

            {/* Main meme card */}
            <MemeCard meme={meme} className="mb-8" />
        </div>
    );
}
