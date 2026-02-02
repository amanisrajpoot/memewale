"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, KeyboardEvent } from "react";

export interface SearchBarProps {
    className?: string;
    placeholder?: string;
    onSearch?: (query: string) => void;
    defaultValue?: string;
}

export function SearchBar({
    className,
    placeholder = "Search memes, creators, tags...",
    onSearch,
    defaultValue = "",
}: SearchBarProps) {
    const [value, setValue] = useState(defaultValue);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && value.trim()) {
            onSearch?.(value.trim());
        }
    };

    return (
        <div className={cn("relative w-full max-w-md", className)}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[var(--foreground-muted)]" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                    "flex h-10 w-full rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-2 pl-10 text-sm ring-offset-[var(--background)]",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    "placeholder:text-[var(--foreground-muted)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-all duration-200 ease-in-out"
                )}
                placeholder={placeholder}
            />
        </div>
    );
}
