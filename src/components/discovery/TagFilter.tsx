"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Tag {
    id: string;
    label: string;
    emoji?: string;
}

interface TagFilterProps {
    tags: Tag[];
    selectedTag?: string;
    onSelectTag: (tagId: string) => void;
    className?: string;
}

export function TagFilter({
    tags,
    selectedTag,
    onSelectTag,
    className,
}: TagFilterProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Check scroll position to toggle arrows
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    };

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = 200;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className={cn("relative group", className)}>
            {/* Left Fade/Arrow */}
            {showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-[var(--background)] to-transparent w-12 pl-1">
                    <button
                        onClick={() => scroll("left")}
                        className="p-1 rounded-full bg-[var(--background-elevated)] border border-[var(--border)] shadow-sm hover:bg-[var(--muted)] transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-1"
            >
                <button
                    onClick={() => onSelectTag("all")}
                    className={cn(
                        "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                        selectedTag === "all" || !selectedTag
                            ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                            : "bg-[var(--background-elevated)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--foreground-muted)]"
                    )}
                >
                    All
                </button>
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() => onSelectTag(tag.id)}
                        className={cn(
                            "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                            selectedTag === tag.id
                                ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                                : "bg-[var(--background-elevated)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--foreground-muted)]"
                        )}
                    >
                        {tag.emoji && <span className="mr-1.5">{tag.emoji}</span>}
                        {tag.label}
                    </button>
                ))}
            </div>

            {/* Right Fade/Arrow */}
            {showRightArrow && (
                <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end bg-gradient-to-l from-[var(--background)] to-transparent w-12 pr-1">
                    <button
                        onClick={() => scroll("right")}
                        className="p-1 rounded-full bg-[var(--background-elevated)] border border-[var(--border)] shadow-sm hover:bg-[var(--muted)] transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
