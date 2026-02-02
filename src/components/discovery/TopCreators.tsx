"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Creator {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    karma: number; // Assuming we use karma or follower count
}

export function TopCreators() {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                // Fetch top 5 profiles by karma (descending)
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, username, full_name, avatar_url, karma')
                    .order('karma', { ascending: false })
                    .limit(5);

                if (error) throw error;
                setCreators(data || []);
            } catch (error) {
                console.error("Error fetching top creators:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCreators();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--foreground-muted)]" />
            </div>
        );
    }

    if (creators.length === 0) {
        return (
            <div className="p-4 text-sm text-[var(--foreground-muted)] text-center">
                No creators yet. Be the first!
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 p-3">
            {creators.map((creator) => (
                <Link
                    key={creator.id}
                    href={`/u/${creator.username}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--muted)] transition-colors group"
                >
                    <div className="relative shrink-0 w-9 h-9 rounded-full overflow-hidden bg-[var(--background)] ring-1 ring-[var(--border)] group-hover:ring-[var(--accent-primary)] transition-all">
                        <Image
                            src={creator.avatar_url || `https://ui-avatars.com/api/?name=${creator.username}`}
                            alt={creator.username}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[var(--foreground)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                            {creator.full_name || creator.username}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate">
                            @{creator.username}
                        </p>
                    </div>
                    {creator.karma > 0 ? (
                        <div className="text-xs font-semibold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2.5 py-1 rounded-full shrink-0">
                            {creator.karma}
                        </div>
                    ) : null}
                </Link>
            ))}
        </div>
    );
}
