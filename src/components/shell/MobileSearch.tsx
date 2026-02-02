"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface MobileSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
    const [mounted, setMounted] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Small timeout to allow transition
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    if (!mounted) return null;

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[var(--z-modal)] bg-[var(--background)] animate-fade-in">
            {/* Header / Search Bar */}
            <div className="flex items-center gap-2 p-2 border-b border-[var(--border)] h-[var(--nav-height)]">
                <Button variant="icon" onClick={onClose}>
                    <ArrowLeft size={24} />
                </Button>

                <form onSubmit={handleSubmit} className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search memes..."
                        className="w-full bg-[var(--background-elevated)] text-[var(--foreground)] px-4 py-2 pl-10 rounded-full border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" size={18} />
                </form>
            </div>

            {/* Recent Searches or Trending (Placeholder) */}
            <div className="p-4">
                <h3 className="text-sm font-semibold text-[var(--foreground-muted)] mb-3">Suggested</h3>
                <div className="flex flex-wrap gap-2">
                    {["Trending", "Funny", "Cats", "Cricket", "Desi"].map(tag => (
                        <button
                            key={tag}
                            onClick={() => {
                                router.push(`/search?q=${tag.toLowerCase()}`);
                                onClose();
                            }}
                            className="px-3 py-1.5 bg-[var(--muted)] text-sm rounded-full hover:bg-[var(--muted-hover)]"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
}
