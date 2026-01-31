"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    TrendingUp,
    PlusSquare,
    Bookmark,
    User,
} from "lucide-react";

// =============================================================================
// BOTTOM BAR
// Mobile-only navigation bar fixed to bottom of screen.
// Thumb-reachable design with 5 core navigation items.
// =============================================================================

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    isSpecial?: boolean;
}

const navItems: NavItem[] = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/submit", label: "Post", icon: PlusSquare, isSpecial: true },
    { href: "/collections", label: "Saved", icon: Bookmark },
    { href: "/profile", label: "Profile", icon: User },
];

export function BottomBar() {
    const pathname = usePathname();

    return (
        <nav
            className={cn(
                // Show only on mobile
                "lg:hidden",
                // Positioning
                "fixed bottom-0 left-0 right-0",
                "z-[var(--z-fixed)]",
                // Size
                "h-[var(--bottombar-height)]",
                // Styling
                "bg-[var(--background)]",
                "border-t border-[var(--border)]",
                // Glass effect
                "backdrop-blur-lg",
                "bg-opacity-90",
                // Safe area for notched phones
                "safe-area-inset-bottom"
            )}
        >
            <div className="h-full flex items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    // Special styling for the center "Post" button
                    if (item.isSpecial) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    // Size
                                    "flex items-center justify-center",
                                    "w-12 h-12",
                                    "-mt-4", // Raise it above the bar
                                    // Styling
                                    "rounded-[var(--radius-xl)]",
                                    "bg-[var(--accent-primary)]",
                                    "text-[hsl(220,20%,10%)]",
                                    "shadow-[var(--shadow-lg)]",
                                    // Transition
                                    "transition-all duration-[var(--transition-fast)]",
                                    "active:scale-95"
                                )}
                                aria-label={item.label}
                            >
                                <Icon size={24} />
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                // Size & layout
                                "flex flex-col items-center justify-center gap-1",
                                "flex-1",
                                "py-2",
                                // Text
                                "text-[var(--text-xs)]",
                                "transition-colors duration-[var(--transition-fast)]",
                                // Active/inactive states
                                isActive
                                    ? "text-[var(--accent-primary)]"
                                    : "text-[var(--foreground-muted)]"
                            )}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <Icon
                                size={22}
                                className={cn(
                                    "transition-transform duration-[var(--transition-fast)]",
                                    isActive && "scale-110"
                                )}
                            />
                            <span className="font-medium">{item.label}</span>

                            {/* Active indicator dot */}
                            {isActive && (
                                <span
                                    className={cn(
                                        "absolute bottom-1",
                                        "w-1 h-1",
                                        "rounded-full",
                                        "bg-[var(--accent-primary)]"
                                    )}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export default BottomBar;
