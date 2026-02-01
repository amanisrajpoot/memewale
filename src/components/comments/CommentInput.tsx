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
    const maxLength = 500;
    const isNearLimit = text.length > 480;
    const isAtLimit = text.length >= maxLength;

    const handleSubmit = () => {
        if (text.trim() && text.length <= maxLength) {
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
        <div className="space-y-2">
            <div
                className={cn(
                    "flex items-center gap-3",
                    "bg-[var(--background-elevated)]",
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
                    maxLength={maxLength}
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
                    disabled={!text.trim() || isAtLimit}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        text.trim() && !isAtLimit
                            ? "bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] hover:opacity-90"
                            : "bg-[var(--muted)] text-[var(--foreground-subtle)]"
                    )}
                    aria-label="Send comment"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            {/* Character counter */}
            {text.length > 0 && (
                <div className={cn(
                    "text-xs text-right transition-colors px-2",
                    isAtLimit ? "text-red-500 font-semibold" :
                        isNearLimit ? "text-yellow-500" :
                            "text-[var(--foreground-muted)]"
                )}>
                    {text.length}/{maxLength}
                </div>
            )}
        </div>
    );
}

export default CommentInput;
