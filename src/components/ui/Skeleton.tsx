"use client";

import { cn } from "@/lib/utils";

// =============================================================================
// SKELETON COMPONENT
// Animated loading placeholder for content.
// No spinners - using shimmer animation as per design principles.
// =============================================================================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Width of the skeleton. Can be any CSS value. */
    width?: string | number;
    /** Height of the skeleton. Can be any CSS value. */
    height?: string | number;
    /** Makes the skeleton circular (for avatars) */
    circle?: boolean;
    /** Disables the shimmer animation */
    static?: boolean;
}

export function Skeleton({
    className,
    width,
    height,
    circle = false,
    static: isStatic = false,
    style,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                // Base styles - slightly lighter for visibility
                "bg-[var(--muted)]",

                // Shape
                circle ? "rounded-full" : "rounded-lg",

                // Animation
                !isStatic && "animate-shimmer",

                // Custom className
                className
            )}
            style={{
                width: typeof width === "number" ? `${width}px` : width,
                height: typeof height === "number" ? `${height}px` : height,
                ...style,
            }}
            {...props}
        />
    );
}

// =============================================================================
// PRESET SKELETON COMPONENTS
// Common skeleton patterns for consistent loading states.
// =============================================================================

/** Skeleton for a single line of text */
export function SkeletonText({
    className,
    lines = 1,
    lastLineWidth = "60%",
    ...props
}: {
    lines?: number;
    lastLineWidth?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("space-y-3", className)} {...props}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height={14}
                    className="w-full"
                    style={{
                        width: i === lines - 1 ? lastLineWidth : "100%",
                    }}
                />
            ))}
        </div>
    );
}

/** Skeleton for an avatar */
export function SkeletonAvatar({
    size = 40,
    className,
    ...props
}: {
    size?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Skeleton
            width={size}
            height={size}
            circle
            className={className}
            {...props}
        />
    );
}

/** Skeleton for a meme card (used in feed loading) */
export function SkeletonMemeCard({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <article
            className={cn(
                "rounded-xl",
                "bg-[var(--background-elevated)]",
                "border border-[var(--border)]",
                "overflow-hidden",
                "shadow-sm",
                className
            )}
            {...props}
        >
            {/* Header: Avatar + Username + timestamp */}
            <div className="flex items-center gap-3 p-4">
                <SkeletonAvatar size={44} />
                <div className="flex-1 space-y-2">
                    <Skeleton height={16} className="w-28" />
                    <Skeleton height={12} className="w-20" />
                </div>
                <Skeleton width={24} height={24} className="rounded-md" />
            </div>

            {/* Media placeholder - more prominent */}
            <div className="relative">
                <Skeleton
                    className="w-full rounded-none"
                    style={{ aspectRatio: "1/1" }}
                />
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-1 px-4 py-3 border-t border-[var(--border)]">
                <Skeleton width={72} height={32} className="rounded-lg" />
                <Skeleton width={72} height={32} className="rounded-lg" />
                <Skeleton width={72} height={32} className="rounded-lg" />
                <div className="flex-1" />
                <Skeleton width={32} height={32} className="rounded-lg" />
            </div>

            {/* Caption area */}
            <div className="px-4 pb-4">
                <SkeletonText lines={2} lastLineWidth="75%" />
            </div>
        </article>
    );
}

/** Skeleton for a collection card */
export function SkeletonCollectionCard({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-xl",
                "bg-[var(--background-elevated)]",
                "border border-[var(--border)]",
                "overflow-hidden",
                className
            )}
            {...props}
        >
            {/* Cover grid (2x2) */}
            <div className="grid grid-cols-2 aspect-square gap-px bg-[var(--border)]">
                <Skeleton className="rounded-none" />
                <Skeleton className="rounded-none" />
                <Skeleton className="rounded-none" />
                <Skeleton className="rounded-none" />
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
                <Skeleton height={18} className="w-3/4" />
                <Skeleton height={14} className="w-1/2" />
            </div>
        </div>
    );
}

/** Skeleton for a comment */
export function SkeletonComment({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex gap-3 py-3", className)} {...props}>
            <SkeletonAvatar size={36} />
            <div className="flex-1 space-y-2">
                <Skeleton height={14} className="w-28" />
                <SkeletonText lines={2} lastLineWidth="80%" />
            </div>
        </div>
    );
}

export default Skeleton;
