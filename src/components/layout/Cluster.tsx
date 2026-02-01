import { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

type SpaceSize = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg";
type JustifyContent = "start" | "center" | "end" | "between";

interface ClusterProps {
    children: ReactNode;
    space?: SpaceSize;
    justify?: JustifyContent;
    className?: string;
    as?: ElementType;
}

/**
 * Cluster - Horizontal wrapping layout with consistent gaps
 * 
 * Perfect for tags, buttons, navigation items, and any horizontal list
 * that should wrap naturally.
 * 
 * @example
 * <Cluster space="sm" justify="start">
 *   <button>Action 1</button>
 *   <button>Action 2</button>
 *   <button>Action 3</button>
 * </Cluster>
 */
export function Cluster({
    children,
    space = "sm",
    justify = "start",
    className,
    as: Component = "div"
}: ClusterProps) {
    return (
        <Component
            className={cn(
                "cluster",
                `cluster-${space}`,
                `cluster-${justify}`,
                className
            )}
        >
            {children}
        </Component>
    );
}
