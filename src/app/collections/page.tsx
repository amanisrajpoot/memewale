"use client";

import { MemeCard } from "@/components/feed/MemeCard";
import { useMemeStore } from "@/store/useMemeStore";
import { FolderHeart, Plus, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface Collection {
    id: string;
    name: string;
    description: string | null;
    is_public: boolean;
    cover_image: string | null;
    created_at: string;
    count?: number; // Added client-side
}

interface SavedMeme {
    user_id: string;
    meme_id: string;
    created_at: string;
    meme: any; // The full meme object
}

export default function CollectionsPage() {
    const { user } = useAuthStore();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [savedMemes, setSavedMemes] = useState<any[]>([]); // Array of memes
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            // router.push("/login"); 
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch User Collections
                const { data: cols, error: colsError } = await supabase
                    .from('collections')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (colsError) throw colsError;

                // 2. Fetch Collection Counts (Optional enhancement later)
                // For now, we'll just display the collections as is.
                setCollections(cols || []);

                // 3. Fetch Saved Memes
                // We join with the 'memes' table and the author profile
                const { data: saved, error: savedError } = await supabase
                    .from('saved_memes')
                    .select(`
                        meme:meme_id (
                            id,
                            author_id,
                            caption,
                            media_url,
                            media_type,
                            created_at,
                            upvote_count,
                            downvote_count,
                            comment_count,
                            share_count,
                            author:author_id (
                                id,
                                username,
                                full_name,
                                avatar_url,
                                is_verified
                            )
                        )
                    `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (savedError) throw savedError;

                // Transform the result to match MemeCard expectations
                const memes = saved?.map((item: any) => {
                    const m = item.meme;
                    if (!m) return null;
                    return {
                        id: m.id,
                        caption: m.caption,
                        mediaUrl: m.media_url,
                        mediaType: m.media_type,
                        createdAt: new Date(m.created_at),
                        upvotes: m.upvote_count || 0,
                        downvotes: m.downvote_count || 0,
                        comments: m.comment_count || 0,
                        shares: m.share_count || 0,
                        tags: [], // Tags not fetched in this view yet
                        creator: {
                            id: m.author?.id || m.author_id,
                            username: m.author?.username || 'unknown',
                            displayName: m.author?.full_name || 'Unknown User',
                            avatar: m.author?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown',
                            isVerified: m.author?.is_verified || false,
                        }
                    };
                }).filter(Boolean) || [];

                setSavedMemes(memes);

            } catch (error) {
                console.error("Error fetching collections:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, supabase]);

    if (isLoading) {
        return (
            <div className="feed-container pt-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
            </div>
        );
    }

    return (
        <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Collections</h1>
                <button
                    className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] hover:opacity-80 transition-opacity"
                    onClick={() => {/* Open Create Collection Modal */ }}
                >
                    <Plus size={18} />
                    New Collection
                </button>
            </div>

            {/* Grid of Collections */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                {collections.length > 0 ? (
                    collections.map((col) => (
                        <div key={col.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-[var(--background-elevated)] border border-[var(--border)]">
                            {col.cover_image ? (
                                <img
                                    src={col.cover_image}
                                    alt={col.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[var(--muted)] text-[var(--foreground-muted)]">
                                    <FolderHeart size={32} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                                <h3 className="font-bold text-white text-lg leading-tight">{col.name}</h3>
                                {col.description && <p className="text-white/80 text-xs mt-1 line-clamp-1">{col.description}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-8 text-center bg-[var(--background-elevated)] rounded-xl border border-dashed border-[var(--border)]">
                        <p className="text-[var(--foreground-muted)]">You haven't created any collections yet.</p>
                    </div>
                )}
            </div>

            {/* Saved Memes Section */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2 mb-4">
                    <FolderHeart className="text-[var(--accent-secondary)]" size={24} />
                    Saved Memes
                </h2>
                {savedMemes.length > 0 ? (
                    <div className="space-y-6">
                        {savedMemes.map((meme) => (
                            <div key={meme.id} className="border-b border-[var(--border)] pb-6 last:border-0 last:pb-0">
                                <MemeCard meme={meme} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={FolderHeart}
                        title="No Saved Memes Yet"
                        description="Start saving memes you love by clicking the bookmark icon!"
                    />
                )}
            </div>
        </div>
    );
}
