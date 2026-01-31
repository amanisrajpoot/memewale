"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { InputSize } from "@/lib/types";

// =============================================================================
// INPUT COMPONENT
// A styled text input with optional icon and error state.
// =============================================================================

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    size?: InputSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: string;
    fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
    sm: "h-8 px-3 text-[var(--text-sm)]",
    md: "h-10 px-4 text-[var(--text-base)]",
    lg: "h-12 px-4 text-[var(--text-lg)]",
};

const iconPaddingLeft: Record<InputSize, string> = {
    sm: "pl-8",
    md: "pl-10",
    lg: "pl-12",
};

const iconPaddingRight: Record<InputSize, string> = {
    sm: "pr-8",
    md: "pr-10",
    lg: "pr-12",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = "text",
            size = "md",
            leftIcon,
            rightIcon,
            error,
            fullWidth = false,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <div
                className={cn("relative", fullWidth && "w-full", disabled && "opacity-50")}
            >
                {/* Left icon */}
                {leftIcon && (
                    <div
                        className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2",
                            "text-[var(--foreground-muted)]",
                            "pointer-events-none"
                        )}
                    >
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    type={type}
                    disabled={disabled}
                    className={cn(
                        // Base styles
                        "w-full",
                        "bg-[var(--muted)]",
                        "text-[var(--foreground)]",
                        "placeholder:text-[var(--foreground-subtle)]",
                        "rounded-[var(--radius-lg)]",
                        "border border-[var(--border)]",
                        "transition-all duration-[var(--transition-fast)]",

                        // Focus styles
                        "focus:outline-none focus:border-[var(--border-focus)]",
                        "focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-opacity-20",

                        // Hover styles
                        "hover:border-[var(--foreground-subtle)]",

                        // Error styles
                        error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]",

                        // Disabled styles
                        "disabled:cursor-not-allowed",

                        // Size styles
                        sizeStyles[size],

                        // Icon padding
                        leftIcon && iconPaddingLeft[size],
                        rightIcon && iconPaddingRight[size],

                        // Custom className
                        className
                    )}
                    {...props}
                />

                {/* Right icon */}
                {rightIcon && (
                    <div
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2",
                            "text-[var(--foreground-muted)]"
                        )}
                    >
                        {rightIcon}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <p className="mt-1.5 text-[var(--text-sm)] text-[var(--error)]">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

// =============================================================================
// TEXTAREA COMPONENT
// =============================================================================

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, fullWidth = false, disabled, ...props }, ref) => {
        return (
            <div
                className={cn("relative", fullWidth && "w-full", disabled && "opacity-50")}
            >
                <textarea
                    ref={ref}
                    disabled={disabled}
                    className={cn(
                        // Base styles
                        "w-full min-h-[100px]",
                        "bg-[var(--muted)]",
                        "text-[var(--foreground)]",
                        "placeholder:text-[var(--foreground-subtle)]",
                        "rounded-[var(--radius-lg)]",
                        "border border-[var(--border)]",
                        "p-4",
                        "text-[var(--text-base)]",
                        "transition-all duration-[var(--transition-fast)]",
                        "resize-y",

                        // Focus styles
                        "focus:outline-none focus:border-[var(--border-focus)]",
                        "focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-opacity-20",

                        // Hover styles
                        "hover:border-[var(--foreground-subtle)]",

                        // Error styles
                        error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]",

                        // Disabled styles
                        "disabled:cursor-not-allowed",

                        // Custom className
                        className
                    )}
                    {...props}
                />

                {/* Error message */}
                {error && (
                    <p className="mt-1.5 text-[var(--text-sm)] text-[var(--error)]">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export default Input;
