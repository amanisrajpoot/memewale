"use client";

import { cn } from "@/lib/utils";
import type { CardVariant } from "@/lib/types";

// =============================================================================
// CARD COMPONENT
// A flexible container component with hover effects and variants.
// =============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    interactive?: boolean;
    noPadding?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
    default: `
    bg-[var(--background-elevated)]
    border border-[var(--border)]
  `,
    elevated: `
    bg-[var(--background-elevated)]
    shadow-[var(--shadow-md)]
  `,
    outlined: `
    bg-transparent
    border border-[var(--border)]
  `,
};

export function Card({
    className,
    variant = "default",
    interactive = false,
    noPadding = false,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                // Base styles
                "rounded-[var(--radius-lg)]",
                "overflow-hidden",

                // Variant styles
                variantStyles[variant],

                // Padding
                !noPadding && "p-4",

                // Interactive styles
                interactive && [
                    "cursor-pointer",
                    "transition-all duration-[var(--transition-fast)]",
                    "hover:border-[var(--foreground-subtle)]",
                    "hover:shadow-[var(--shadow-lg)]",
                    "active:scale-[0.99]",
                ],

                // Custom className
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Card sub-components for structured content
export function CardHeader({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex items-center gap-3",
                "pb-3 mb-3",
                "border-b border-[var(--border)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardTitle({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn(
                "text-[var(--text-lg)] font-semibold",
                "text-[var(--foreground)]",
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
}

export function CardContent({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("text-[var(--foreground-muted)]", className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex items-center gap-3",
                "pt-3 mt-3",
                "border-t border-[var(--border)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;
