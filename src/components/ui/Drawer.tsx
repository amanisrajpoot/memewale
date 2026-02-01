"use client";

import { useEffect, useCallback, useRef, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

// =============================================================================
// DRAWER COMPONENT
// A bottom sheet drawer for mobile, optimized for touch interactions.
// Slides up from bottom with drag-to-dismiss support.
// =============================================================================

export interface DrawerProps {
    /** Whether the drawer is open */
    isOpen: boolean;
    /** Called when the drawer should close */
    onClose: () => void;
    /** Drawer title */
    title?: string;
    /** Drawer content */
    children: React.ReactNode;
    /** Height of the drawer */
    height?: "auto" | "half" | "full";
    /** Whether to show the drag handle */
    showHandle?: boolean;
    /** Whether to show the close button */
    showCloseButton?: boolean;
    /** Custom className */
    className?: string;
}

const heightStyles: Record<string, string> = {
    auto: "max-h-[85vh]",
    half: "h-[50vh]",
    full: "h-[calc(100vh-3rem)]",
};

export function Drawer({
    isOpen,
    onClose,
    title,
    children,
    height = "auto",
    showHandle = true,
    showCloseButton = true,
    className,
}: DrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const dragStartY = useRef<number | null>(null);
    const currentY = useRef<number>(0);

    // Handle touch start for drag-to-dismiss
    const handleTouchStart = useCallback((e: TouchEvent) => {
        dragStartY.current = e.touches[0].clientY;
    }, []);

    // Handle touch move
    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (dragStartY.current === null) return;

        const deltaY = e.touches[0].clientY - dragStartY.current;

        // Only allow dragging down
        if (deltaY > 0 && drawerRef.current) {
            currentY.current = deltaY;
            drawerRef.current.style.transform = `translateY(${deltaY}px)`;
        }
    }, []);

    // Handle touch end
    const handleTouchEnd = useCallback(() => {
        if (drawerRef.current) {
            // If dragged more than 100px, close the drawer
            if (currentY.current > 100) {
                onClose();
            } else {
                // Snap back
                drawerRef.current.style.transform = "";
            }
        }
        dragStartY.current = null;
        currentY.current = 0;
    }, [onClose]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleKeyDown);

            return () => {
                document.body.style.overflow = originalOverflow;
                document.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isOpen, onClose]);

    // Reset transform on close
    useEffect(() => {
        if (!isOpen && drawerRef.current) {
            drawerRef.current.style.transform = "";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const drawerContent = (
        <div
            className={cn(
                // Backdrop
                "fixed inset-0",
                "bg-[var(--background-overlay)]",
                "z-[var(--z-modal-backdrop)]",
                // Animation
                "animate-fade-in"
            )}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "drawer-title" : undefined}
        >
            <div
                ref={drawerRef}
                className={cn(
                    // Positioning
                    "fixed inset-x-0 bottom-0",
                    "lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2",
                    "z-[var(--z-modal)]",
                    // Size
                    "w-full lg:max-w-2xl",
                    // Reset height on desktop to allow auto-height or specific modal height
                    // Mobile uses fixed heights, desktop uses auto or max
                    height === "full" ? "h-[calc(100vh-3rem)] lg:h-auto lg:max-h-[85vh]" : heightStyles[height],
                    // Styling
                    "bg-[var(--background-elevated)]",
                    "rounded-t-[var(--radius-2xl)] lg:rounded-[var(--radius-2xl)]", // Full rounded on desktop
                    "border-t border-x lg:border border-[var(--border)]",
                    "shadow-[var(--shadow-xl)]",
                    // Safe area for mobile
                    "safe-area-inset-bottom",
                    // Animation - slide up on mobile, fade/scale on desktop could be better but reusing slide for now
                    "animate-slide-up",
                    // Transition for drag
                    "transition-transform duration-150 ease-out",
                    // Overflow
                    "flex flex-col",
                    // Custom className
                    className
                )}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag handle */}
                {showHandle && (
                    <div className="flex justify-center py-3">
                        <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
                    </div>
                )}

                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 pb-4 border-b border-[var(--border)]">
                        {title && (
                            <h2
                                id="drawer-title"
                                className="text-lg font-bold text-[var(--foreground)]"
                            >
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <Button
                                variant="icon"
                                size="sm"
                                onClick={onClose}
                                aria-label="Close drawer"
                                className="ml-auto"
                            >
                                <X size={20} />
                            </Button>
                        )}
                    </div>
                )}

                {/* Content - no default padding, let children control their own layout */}
                <div className="flex-1 overflow-hidden flex flex-col px-6">{children}</div>
            </div>
        </div>
    );

    if (typeof document !== "undefined") {
        return createPortal(drawerContent, document.body);
    }

    return null;
}

export default Drawer;
