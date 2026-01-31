"use client";

import { useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// =============================================================================
// TABS COMPONENT
// Animated tab switcher with underline indicator.
// =============================================================================

export interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    variant?: "underline" | "pills";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    className?: string;
}

const sizeStyles = {
    sm: "text-[var(--text-sm)] py-2 px-3",
    md: "text-[var(--text-base)] py-2.5 px-4",
    lg: "text-[var(--text-lg)] py-3 px-5",
};

export function Tabs({
    tabs,
    activeTab,
    onTabChange,
    variant = "underline",
    size = "md",
    fullWidth = false,
    className,
}: TabsProps) {
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    const handleTabClick = useCallback(
        (tabId: string) => {
            onTabChange(tabId);
        },
        [onTabChange]
    );

    if (variant === "pills") {
        return (
            <div
                className={cn(
                    "flex gap-2",
                    "bg-[var(--muted)]",
                    "p-1",
                    "rounded-[var(--radius-lg)]",
                    fullWidth && "w-full",
                    className
                )}
                role="tablist"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={cn(
                            "flex items-center justify-center gap-2",
                            sizeStyles[size],
                            "rounded-[var(--radius-md)]",
                            "font-medium",
                            "transition-all duration-[var(--transition-fast)]",
                            fullWidth && "flex-1",
                            activeTab === tab.id
                                ? [
                                    "bg-[var(--background-elevated)]",
                                    "text-[var(--foreground)]",
                                    "shadow-[var(--shadow-sm)]",
                                ]
                                : [
                                    "text-[var(--foreground-muted)]",
                                    "hover:text-[var(--foreground)]",
                                ]
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
        );
    }

    // Underline variant (default)
    return (
        <div
            className={cn(
                "relative flex",
                "border-b border-[var(--border)]",
                fullWidth && "w-full",
                className
            )}
            role="tablist"
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isHovered = hoveredTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleTabClick(tab.id)}
                        onMouseEnter={() => setHoveredTab(tab.id)}
                        onMouseLeave={() => setHoveredTab(null)}
                        className={cn(
                            "relative flex items-center justify-center gap-2",
                            sizeStyles[size],
                            "font-medium",
                            "transition-colors duration-[var(--transition-fast)]",
                            fullWidth && "flex-1",
                            isActive
                                ? "text-[var(--foreground)]"
                                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                        )}
                    >
                        {tab.icon}
                        {tab.label}

                        {/* Active indicator */}
                        <span
                            className={cn(
                                "absolute bottom-0 left-0 right-0 h-0.5",
                                "bg-[var(--accent-primary)]",
                                "transition-all duration-[var(--transition-fast)]",
                                isActive
                                    ? "opacity-100 scale-x-100"
                                    : isHovered
                                        ? "opacity-50 scale-x-75"
                                        : "opacity-0 scale-x-0"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}

// =============================================================================
// TAB PANELS
// Container for tab content with optional animation.
// =============================================================================

export interface TabPanelProps {
    id: string;
    activeTab: string;
    children: ReactNode;
    className?: string;
}

export function TabPanel({
    id,
    activeTab,
    children,
    className,
}: TabPanelProps) {
    if (id !== activeTab) return null;

    return (
        <div
            role="tabpanel"
            aria-labelledby={id}
            className={cn("animate-fade-in", className)}
        >
            {children}
        </div>
    );
}

export default Tabs;
