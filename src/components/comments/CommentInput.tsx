"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Send, Smile } from "lucide-react";

// =============================================================================
// COMMENT INPUT
// Text input for adding new comments.
// =============================================================================

export interface CommentInputProps {
    placeholder?: string;
    onSubmit?: (text: string) => void;
    className?: string;
}

export function CommentInput({
    placeholder = "Add a comment...",
    onSubmit,
    className,
}: CommentInputProps) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (text.trim()) {
            onSubmit?.(text.trim());
            setText("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 p-3",
                "bg-[var(--background-elevated)]",
                "border-t border-[var(--border)]",
                className
            )}
        >
            {/* Emoji button */}
            <button
                className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors text-[var(--foreground-muted)]"
                aria-label="Add emoji"
            >
                <Smile className="w-5 h-5" />
            </button>

            {/* Input */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                    "flex-1 py-2 px-4",
                    "bg-[var(--muted)] rounded-full",
                    "text-sm text-[var(--foreground)]",
                    "placeholder:text-[var(--foreground-subtle)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                )}
            />

            {/* Send button */}
            <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className={cn(
                    "p-2 rounded-full transition-colors",
                    text.trim()
                        ? "bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] hover:opacity-90"
                        : "bg-[var(--muted)] text-[var(--foreground-subtle)]"
                )}
                aria-label="Send comment"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
    );
}

export default CommentInput;
