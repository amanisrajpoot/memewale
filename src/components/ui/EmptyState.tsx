"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
    icon?: LucideIcon;
    emoji?: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    icon: Icon,
    emoji,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center text-center py-16 px-6",
            className
        )}>
            {/* Icon or Emoji */}
            {emoji ? (
                <span className="text-6xl mb-4">{emoji}</span>
            ) : Icon ? (
                <Icon className="w-16 h-16 text-[var(--foreground-muted)] mb-4" />
            ) : null}

            {/* Title */}
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className="text-sm text-[var(--foreground-muted)] mb-6 max-w-md">
                    {description}
                </p>
            )}

            {/* Action Button */}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-3 bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
