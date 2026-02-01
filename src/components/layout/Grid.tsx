import { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface GridProps {
    children: ReactNode;
    minItemWidth?: string;
    gap?: "sm" | "md" | "lg" | "xl";
    autoFill?: boolean;
    className?: string;
    as?: ElementType;
}

/**
 * Grid - Responsive auto-fit/auto-fill grid layout
 * 
 * Automatically creates responsive columns based on minimum item width.
 * No media queries needed - pure CSS Grid magic!
 * 
 * @example
 * <Grid minItemWidth="250px" gap="md">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 */
export function Grid({
    children,
    minItemWidth = "250px",
    gap = "md",
    autoFill = false,
    className,
    as: Component = "div"
}: GridProps) {
    const gridClass = autoFill ? "grid-auto-fill" : "grid-auto";

    return (
        <Component
            className={cn(gridClass, className)}
            style={{
                "--grid-min": minItemWidth,
                "--grid-gap": `var(--space-${gap})`,
            } as React.CSSProperties}
        >
            {children}
        </Component>
    );
}
