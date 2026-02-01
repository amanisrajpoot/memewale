import { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

type ContentWidth = "sm" | "md" | "lg" | "xl";

interface CenterProps {
    children: ReactNode;
    maxWidth?: ContentWidth;
    className?: string;
    as?: ElementType;
}

/**
 * Center - Horizontally centered content with max-width constraint
 * 
 * Perfect for centering main content areas, forms, and articles.
 * Uses logical properties (inline) for better i18n support.
 * 
 * @example
 * <Center maxWidth="md">
 *   <article>Centered content</article>
 * </Center>
 */
export function Center({
    children,
    maxWidth = "md",
    className,
    as: Component = "div"
}: CenterProps) {
    return (
        <Component className={cn("center", `center-${maxWidth}`, className)}>
            {children}
        </Component>
    );
}
