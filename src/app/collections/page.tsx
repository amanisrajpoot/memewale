"use client";

import { MemeCard } from "@/components/feed/MemeCard";
import { mockMemes } from "@/data/mockMemes";
import { useMemeStore } from "@/store/useMemeStore";
import { FolderHeart, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useEffect } from "react";

const mockCollections = [
    { id: "c1", title: "Funny Cats", count: 12, cover: mockMemes[0].mediaUrl },
    { id: "c2", title: "Reaction GIFs", count: 8, cover: mockMemes[1].mediaUrl },
    { id: "c3", title: "Desi Parents", count: 45, cover: mockMemes[2].mediaUrl },
];

export default function CollectionsPage() {
    const { interactions, initializeMeme } = useMemeStore();

    // Initialize all memes
    useEffect(() => {
        mockMemes.forEach(meme => initializeMeme(meme, []));
    }, [initializeMeme]);

    // Get saved memes
    const savedMemes = mockMemes.filter(meme => {
        const interaction = interactions[meme.id];
        return interaction?.isSaved === true;
    });

    return (
        <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '5rem' }}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Collections</h1>
                <button className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] hover:opacity-80 transition-opacity">
                    <Plus size={18} />
                    New Collection
                </button>
            </div>

            {/* Grid of Collections */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                {mockCollections.map((col) => (
                    <div key={col.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer">
                        <img
                            src={col.cover}
                            alt={col.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                            <h3 className="font-bold text-white text-lg leading-tight">{col.title}</h3>
                            <p className="text-white/80 text-xs mt-1">{col.count} memes</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Saved Memes Section */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2 mb-4">
                    <FolderHeart className="text-[var(--accent-secondary)]" size={24} />
                    Saved Memes
                </h2>
                {savedMemes.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {savedMemes.map((meme) => (
                            <MemeCard key={meme.id} meme={meme} className="border-b border-[var(--border)] pb-6 last:border-0" />
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
