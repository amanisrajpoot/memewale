"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SideRail } from "./SideRail";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on route change
    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[var(--z-modal)] transition-opacity duration-300",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
        >
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Sidebar content */}
            <div
                className={cn(
                    "absolute top-0 left-0 bottom-0 w-[280px] bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-out border-r border-[var(--border)]",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 border-b border-[var(--border)] shrink-0 h-[var(--nav-height)]">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">😂</span>
                            <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">Memewale</span>
                        </div>
                        <Button variant="icon" size="sm" onClick={onClose}>
                            <X size={24} />
                        </Button>
                    </div>

                    {/* Content (SideRail) */}
                    <div
                        className="flex-1 overflow-auto"
                        onClickCapture={(e) => {
                            // Close if clicking a link or button, but allow scrolling/clicks on container
                            const target = e.target as HTMLElement;
                            if (target.closest('a') || target.closest('button')) {
                                onClose();
                            }
                        }}
                    >
                        <SideRail />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
