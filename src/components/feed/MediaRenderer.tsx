"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

// =============================================================================
// MEDIA RENDERER
// Smart media handling for images, GIFs, and videos.
// Lazy loading, blur placeholder, aspect ratio preservation.
// =============================================================================

export interface MediaRendererProps {
    src: string;
    alt: string;
    type: "image" | "gif" | "video";
    aspectRatio?: number;
    className?: string;
    priority?: boolean;
    onDoubleClick?: () => void;
}

export function MediaRenderer({
    src,
    alt,
    type,
    aspectRatio = 1,
    className,
    priority = false,
    onDoubleClick,
}: MediaRendererProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [ratio, setRatio] = useState<number | undefined>(undefined);

    if (type === "video") {
        return (
            <div
                className={cn("relative w-full bg-[var(--muted)]", className)}
                onDoubleClick={onDoubleClick}
            >
                <video
                    src={src}
                    className="w-full h-auto block"
                    controls
                    playsInline
                    preload="metadata"
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "relative w-full overflow-hidden bg-[var(--muted)]",
                className
            )}
            style={{ aspectRatio: ratio || aspectRatio }}
            onDoubleClick={onDoubleClick}
        >
            {/* Loading skeleton */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 animate-pulse bg-[var(--muted)]" />
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)]">
                    <span className="text-[var(--foreground-muted)] text-sm">
                        Failed to load
                    </span>
                </div>
            )}

            {/* Image */}
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                className={cn(
                    "object-contain transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 512px"
                onLoad={(e) => {
                    setIsLoaded(true);
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                        setRatio(img.naturalWidth / img.naturalHeight);
                    }
                }}
                onError={() => setHasError(true)}
                unoptimized={type === "gif"}
            />
        </div>
    );
}

export default MediaRenderer;
