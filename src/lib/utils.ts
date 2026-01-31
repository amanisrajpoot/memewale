import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind classes intelligently.
 * This is the primary utility for conditional class names.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a number into a compact representation (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(num: number): string {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    if (num < 1000000000)
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
}

/**
 * Formats a timestamp into a relative time string (e.g., "2h ago", "3d ago")
 */
export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 604800)}w ago`;
    if (diffInSeconds < 31536000)
        return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Generates a random ID (for mock data, not for production use)
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}

/**
 * Checks if we're on the client side
 */
export const isClient = typeof window !== "undefined";

/**
 * Checks if the device supports touch
 */
export const isTouchDevice = isClient && "ontouchstart" in window;

/**
 * Sleep utility for async/await
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    if (!isClient) return false;

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            return true;
        } catch {
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

/**
 * Shares content using Web Share API with fallback
 */
export async function shareContent(data: {
    title?: string;
    text?: string;
    url?: string;
}): Promise<boolean> {
    if (!isClient) return false;

    if (navigator.share) {
        try {
            await navigator.share(data);
            return true;
        } catch (error) {
            // User cancelled or share failed
            if ((error as Error).name !== "AbortError") {
                console.error("Share failed:", error);
            }
            return false;
        }
    }

    // Fallback: copy URL to clipboard
    if (data.url) {
        return copyToClipboard(data.url);
    }

    return false;
}

/**
 * Detects the media type from a URL or file
 */
export function getMediaType(url: string): "image" | "gif" | "video" | "unknown" {
    const extension = url.split("?")[0].split(".").pop()?.toLowerCase();

    if (!extension) return "unknown";

    if (["jpg", "jpeg", "png", "webp", "avif", "svg"].includes(extension)) {
        return "image";
    }

    if (extension === "gif") {
        return "gif";
    }

    if (["mp4", "webm", "mov", "avi"].includes(extension)) {
        return "video";
    }

    return "unknown";
}

/**
 * Validates file size (in bytes)
 */
export function isValidFileSize(
    file: File,
    maxSizeMB: number = 10
): boolean {
    return file.size <= maxSizeMB * 1024 * 1024;
}

/**
 * Validates file type for meme uploads
 */
export function isValidMemeFile(file: File): boolean {
    const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
    ];
    return validTypes.includes(file.type);
}

/**
 * Extracts hashtags from text
 */
export function extractHashtags(text: string): string[] {
    const regex = /#(\w+)/g;
    const matches = text.match(regex);
    return matches ? matches.map((tag) => tag.slice(1)) : [];
}

/**
 * Extracts mentions from text
 */
export function extractMentions(text: string): string[] {
    const regex = /@(\w+)/g;
    const matches = text.match(regex);
    return matches ? matches.map((mention) => mention.slice(1)) : [];
}
