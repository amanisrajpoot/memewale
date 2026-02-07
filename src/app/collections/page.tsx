"use client";

import { MemeCard } from "@/components/feed/MemeCard";
import { useMemeStore } from "@/store/useMemeStore";
import { FolderHeart, Plus, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

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
                            short_id,
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
                        shortId: m.short_id,
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
        <div className="feed-container pt-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Collections</h1>
                        <p className="text-[var(--foreground-muted)]">Organize your favorite memes</p>
                    </div>
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
                        <div className="text-center py-24 px-6 bg-[var(--background-elevated)] rounded-3xl border border-[var(--border)] border-dashed">
                            <div className="w-20 h-20 bg-[var(--background)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border)]">
                                <FolderHeart className="w-10 h-10 text-[var(--foreground-muted)] opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Saved Memes Yet</h3>
                            <p className="text-[var(--foreground-muted)] mb-8 max-w-xs mx-auto">Start saving memes you love by clicking the bookmark icon on any post!</p>
                            <Button
                                onClick={() => router.push("/")}
                                className="bg-[var(--accent-primary)] text-[var(--background)] font-bold px-8 py-6 rounded-2xl shadow-lg hover:shadow-[var(--accent-primary)]/20 transition-all active:scale-95"
                            >
                                Discover Memes
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
