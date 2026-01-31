"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

// =============================================================================
// MEME CAPTION
// Expandable caption with hashtag highlighting.
// =============================================================================

export interface MemeCaptionProps {
    text: string;
    maxLength?: number;
    className?: string;
}

export function MemeCaption({
    text,
    maxLength = 100,
    className,
}: MemeCaptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text.length > maxLength;
    const displayText = shouldTruncate && !isExpanded
        ? text.slice(0, maxLength).trim() + "..."
        : text;

    // Parse hashtags and mentions
    const parseText = (content: string) => {
        const parts = content.split(/(#\w+|@\w+)/g);
        return parts.map((part, i) => {
            if (part.startsWith("#")) {
                return (
                    <span
                        key={i}
                        className="text-[var(--accent-primary)] hover:underline cursor-pointer"
                    >
                        {part}
                    </span>
                );
            }
            if (part.startsWith("@")) {
                return (
                    <span
                        key={i}
                        className="text-[var(--accent-secondary)] hover:underline cursor-pointer"
                    >
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className={cn("text-sm text-[var(--foreground)]", className)}>
            <p className="leading-relaxed">
                {parseText(displayText)}
                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-medium"
                    >
                        {isExpanded ? "less" : "more"}
                    </button>
                )}
            </p>
        </div>
    );
}

export default MemeCaption;
