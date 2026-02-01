"use client";

import { useToast, type ToastType } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[var(--z-tooltip)] flex flex-col gap-3 max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    onClose: () => void;
}

function Toast({ id, type, message, onClose }: ToastProps) {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info
    };

    const styles = {
        success: 'bg-gradient-to-r from-green-500/15 to-green-600/10 border-green-500/30 text-green-400',
        error: 'bg-gradient-to-r from-red-500/15 to-red-600/10 border-red-500/30 text-red-400',
        warning: 'bg-gradient-to-r from-yellow-500/15 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
        info: 'bg-gradient-to-r from-blue-500/15 to-blue-600/10 border-blue-500/30 text-blue-400'
    };

    const Icon = icons[type];

    return (
        <div
            className={cn(
                "flex items-center gap-3 pl-4 pr-3 py-3.5 rounded-xl border backdrop-blur-md",
                "shadow-lg shadow-black/20 pointer-events-auto",
                "animate-fade-in",
                styles[type]
            )}
            role="alert"
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-semibold text-white leading-tight">
                {message}
            </p>
            <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
            >
                <X className="w-4 h-4 text-white/70" />
            </button>
        </div>
    );
}
