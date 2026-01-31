"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { Toast as ToastType } from "@/lib/types";
import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

// =============================================================================
// TOAST COMPONENT
// Non-intrusive notifications that appear at the bottom of the screen.
// =============================================================================

const toastIcons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

const toastStyles = {
    success: "border-l-4 border-l-[var(--success)]",
    error: "border-l-4 border-l-[var(--error)]",
    warning: "border-l-4 border-l-[var(--warning)]",
    info: "border-l-4 border-l-[var(--info)]",
};

const iconStyles = {
    success: "text-[var(--success)]",
    error: "text-[var(--error)]",
    warning: "text-[var(--warning)]",
    info: "text-[var(--info)]",
};

interface ToastItemProps {
    toast: ToastType;
    onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
    const Icon = toastIcons[toast.type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, toast.duration || 4000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onDismiss]);

    return (
        <div
            className={cn(
                // Base styles
                "flex items-start gap-3",
                "w-full max-w-sm",
                "bg-[var(--background-elevated)]",
                "rounded-[var(--radius-lg)]",
                "p-4",
                "shadow-[var(--shadow-lg)]",
                // Border accent
                toastStyles[toast.type],
                // Animation
                "animate-slide-up"
            )}
            role="alert"
        >
            <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", iconStyles[toast.type])} />

            <p className="flex-1 text-[var(--text-sm)] text-[var(--foreground)]">
                {toast.message}
            </p>

            <button
                onClick={() => onDismiss(toast.id)}
                className={cn(
                    "shrink-0",
                    "text-[var(--foreground-muted)]",
                    "hover:text-[var(--foreground)]",
                    "transition-colors duration-[var(--transition-fast)]"
                )}
                aria-label="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// =============================================================================
// TOAST CONTAINER
// Manages and displays multiple toasts.
// =============================================================================

interface ToastContainerProps {
    toasts: ToastType[];
    onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    const content = (
        <div
            className={cn(
                "fixed bottom-4 left-1/2 -translate-x-1/2",
                "z-[var(--z-toast)]",
                "flex flex-col gap-2",
                "w-full max-w-sm",
                "px-4",
                // On mobile, account for bottom bar
                "pb-[calc(var(--bottombar-height)+1rem)]",
                "lg:pb-0"
            )}
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );

    if (typeof document !== "undefined") {
        return createPortal(content, document.body);
    }

    return null;
}

// =============================================================================
// TOAST HOOK
// Custom hook for managing toasts.
// =============================================================================

let toastId = 0;

export function useToast() {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const addToast = useCallback(
        (message: string, type: ToastType["type"] = "info", duration?: number) => {
            const id = `toast-${++toastId}`;
            setToasts((prev) => [...prev, { id, message, type, duration }]);
            return id;
        },
        []
    );

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback(
        (message: string, duration?: number) => addToast(message, "success", duration),
        [addToast]
    );

    const error = useCallback(
        (message: string, duration?: number) => addToast(message, "error", duration),
        [addToast]
    );

    const warning = useCallback(
        (message: string, duration?: number) => addToast(message, "warning", duration),
        [addToast]
    );

    const info = useCallback(
        (message: string, duration?: number) => addToast(message, "info", duration),
        [addToast]
    );

    return {
        toasts,
        addToast,
        dismissToast,
        success,
        error,
        warning,
        info,
        ToastContainer: () => (
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        ),
    };
}

export default ToastContainer;
