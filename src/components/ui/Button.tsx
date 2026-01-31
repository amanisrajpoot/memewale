"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { ButtonVariant, ButtonSize } from "@/lib/types";

// =============================================================================
// BUTTON COMPONENT
// A versatile button with multiple variants and sizes.
// Supports loading state, icons, and full accessibility.
// =============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
    bg-[var(--accent-primary)] text-[hsl(220,20%,10%)]
    hover:bg-[var(--accent-primary-hover)]
    active:scale-[0.98]
    shadow-md hover:shadow-lg
  `,
    secondary: `
    bg-[var(--muted)] text-[var(--foreground)]
    hover:bg-[var(--muted-hover)]
    active:scale-[0.98]
    border border-[var(--border)]
  `,
    ghost: `
    bg-transparent text-[var(--foreground)]
    hover:bg-[var(--muted)]
    active:bg-[var(--muted-hover)]
  `,
    icon: `
    bg-transparent text-[var(--foreground-muted)]
    hover:bg-[var(--muted)] hover:text-[var(--foreground)]
    active:scale-[0.95]
    p-2
  `,
    danger: `
    bg-[var(--error)] text-white
    hover:opacity-90
    active:scale-[0.98]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-[var(--text-sm)] gap-1.5 rounded-[var(--radius-md)]",
    md: "h-10 px-4 text-[var(--text-base)] gap-2 rounded-[var(--radius-lg)]",
    lg: "h-12 px-6 text-[var(--text-lg)] gap-2.5 rounded-[var(--radius-lg)]",
};

const iconSizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 w-8 rounded-[var(--radius-md)]",
    md: "h-10 w-10 rounded-[var(--radius-lg)]",
    lg: "h-12 w-12 rounded-[var(--radius-lg)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const isIconOnly = variant === "icon";

        return (
            <button
                ref={ref}
                className={cn(
                    // Base styles
                    "inline-flex items-center justify-center",
                    "font-medium",
                    "transition-all duration-[var(--transition-fast)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
                    "select-none",

                    // Variant styles
                    variantStyles[variant],

                    // Size styles
                    isIconOnly ? iconSizeStyles[size] : sizeStyles[size],

                    // Full width
                    fullWidth && "w-full",

                    // Custom className
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {/* Loading spinner */}
                {isLoading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}

                {/* Left icon (hidden when loading) */}
                {!isLoading && leftIcon && (
                    <span className="shrink-0">{leftIcon}</span>
                )}

                {/* Button text (hidden when icon-only or loading with icon variant) */}
                {children && !isIconOnly && (
                    <span className={isLoading ? "opacity-0" : ""}>{children}</span>
                )}

                {/* Icon-only content */}
                {isIconOnly && !isLoading && children}

                {/* Right icon */}
                {!isLoading && rightIcon && (
                    <span className="shrink-0">{rightIcon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
