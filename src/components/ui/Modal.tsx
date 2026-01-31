"use client";

import { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

// =============================================================================
// MODAL COMPONENT
// A centered overlay modal with backdrop, animations, and accessibility.
// =============================================================================

export interface ModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Called when the modal should close */
    onClose: () => void;
    /** Modal title */
    title?: string;
    /** Modal description */
    description?: string;
    /** Modal content */
    children: React.ReactNode;
    /** Size of the modal */
    size?: "sm" | "md" | "lg" | "xl" | "full";
    /** Whether clicking the backdrop closes the modal */
    closeOnBackdrop?: boolean;
    /** Whether pressing Escape closes the modal */
    closeOnEscape?: boolean;
    /** Whether to show the close button */
    showCloseButton?: boolean;
    /** Custom className for the modal container */
    className?: string;
}

const sizeStyles: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = "md",
    closeOnBackdrop = true,
    closeOnEscape = true,
    showCloseButton = true,
    className,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle Escape key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (closeOnEscape && e.key === "Escape") {
                onClose();
            }
        },
        [closeOnEscape, onClose]
    );

    // Handle backdrop click
    const handleBackdropClick = useCallback(
        (e: React.MouseEvent) => {
            if (closeOnBackdrop && e.target === e.currentTarget) {
                onClose();
            }
        },
        [closeOnBackdrop, onClose]
    );

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleKeyDown);

            // Focus trap
            modalRef.current?.focus();

            return () => {
                document.body.style.overflow = originalOverflow;
                document.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const modalContent = (
        <div
            className={cn(
                // Backdrop
                "fixed inset-0",
                "bg-[var(--background-overlay)]",
                "z-[var(--z-modal-backdrop)]",
                "flex items-center justify-center",
                "p-4",
                // Animation
                "animate-fade-in"
            )}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className={cn(
                    // Base styles
                    "w-full",
                    sizeStyles[size],
                    "bg-[var(--background-elevated)]",
                    "rounded-[var(--radius-xl)]",
                    "border border-[var(--border)]",
                    "shadow-[var(--shadow-xl)]",
                    "overflow-hidden",
                    // Animation
                    "animate-scale-in",
                    // Focus
                    "outline-none",
                    // Custom className
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-6 pb-0">
                        <div className="flex-1 pr-4">
                            {title && (
                                <h2
                                    id="modal-title"
                                    className="text-[var(--text-xl)] font-semibold text-[var(--foreground)]"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p
                                    id="modal-description"
                                    className="mt-1 text-[var(--text-sm)] text-[var(--foreground-muted)]"
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                        {showCloseButton && (
                            <Button
                                variant="icon"
                                size="sm"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </Button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );

    // Render in portal to escape any overflow/positioning issues
    if (typeof document !== "undefined") {
        return createPortal(modalContent, document.body);
    }

    return null;
}

// =============================================================================
// MODAL FOOTER
// Helper component for modal action buttons
// =============================================================================

export function ModalFooter({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-3",
                "pt-4 mt-4",
                "border-t border-[var(--border)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export default Modal;
