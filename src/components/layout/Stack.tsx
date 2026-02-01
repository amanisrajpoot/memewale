import { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

type SpaceSize = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface StackProps {
    children: ReactNode;
    space?: SpaceSize;
    className?: string;
    as?: ElementType;
}

/**
 * Stack - Vertical layout with consistent spacing between children
 * 
 * Uses the lobotomized owl selector (* + *) for automatic spacing.
 * Perfect for forms, content sections, and vertical lists.
 * 
 * @example
 * <Stack space="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Stack>
 */
export function Stack({
    children,
    space = "md",
    className,
    as: Component = "div"
}: StackProps) {
    return (
        <Component className={cn("stack", `stack-${space}`, className)}>
            {children}
        </Component>
    );
}
