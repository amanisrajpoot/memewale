"use client";

import { notFound } from "next/navigation";
import { mockMemes } from "@/data/mockMemes";
import { mockComments } from "@/data/mockComments";
import { MemeCard } from "@/components/feed/MemeCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MemeDetailPageProps {
    params: {
        id: string;
    };
}

export default function MemeDetailPage({ params }: MemeDetailPageProps) {
    const meme = mockMemes.find(m => m.id === params.id);

    if (!meme) {
        notFound();
    }

    // Get related memes (same tags or creator)
    const relatedMemes = mockMemes
        .filter(m =>
            m.id !== meme.id && (
                m.creator.id === meme.creator.id ||
                m.tags?.some(tag => meme.tags?.includes(tag))
            )
        )
        .slice(0, 3);

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
            <MemeCard meme={meme} />

            {/* Related memes section */}
            {relatedMemes.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
                        Related Memes
                    </h2>
                    <div className="flex flex-col gap-6">
                        {relatedMemes.map((relatedMeme) => (
                            <MemeCard key={relatedMeme.id} meme={relatedMeme} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
