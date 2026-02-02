"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Tag {
    id: string;
    name: string;
    follower_count: number;
    meme_count: number;
}

export function TrendingSection() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const { data, error } = await supabase
                    .from('tags')
                    .select('*')
                    .order('meme_count', { ascending: false })
                    .limit(5);

                if (error) throw error;
                setTags(data as any[] || []);
            } catch (error) {
                console.error("Error fetching tags:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    if (loading) {
        return (
            <div className="p-4 text-center text-sm text-[var(--foreground-muted)]">
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Loading trends...
            </div>
        );
    }

    if (tags.length === 0) {
        return (
            <div className="p-4 text-center text-sm text-[var(--foreground-muted)]">
                No trending tags yet.
            </div>
        );
    }

    return (
        <div style={{ padding: "var(--space-sm)" }} className="space-y-3">
            {tags.map((tag) => (
                <Link
                    key={tag.id || tag.name}
                    href={`/search?q=${tag.name}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--muted)] transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">#</span>
                        <span className="text-sm font-semibold text-[var(--foreground)]">{tag.name}</span>
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)]">
                        {tag.meme_count} posts
                    </span>
                </Link>
            ))}
        </div>
    );
}
