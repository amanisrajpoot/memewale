"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui";
import { SearchBar } from "@/components/discovery/SearchBar";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginModal } from "@/components/auth/LoginModal";
import { useState } from "react";

// =============================================================================
// TOP NAVIGATION
// Persistent header with logo, search, and user menu.
// Always visible across all screen sizes.
// =============================================================================

export interface TopNavProps {
    onMenuClick?: () => void;
    onSearchClick?: () => void;
}

export function TopNav({ onMenuClick, onSearchClick }: TopNavProps) {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <header
            className={cn(
                // Positioning
                "fixed top-0 left-0 right-0",
                "z-[var(--z-fixed)]",
                // Size
                "h-[var(--nav-height)]",
                // Styling
                "bg-[var(--background)]",
                "border-b border-[var(--border)]",
                // Glass effect
                "backdrop-blur-lg",
                "bg-opacity-80"
            )}
        >
            <div
                className={cn(
                    "h-full",
                    "flex items-center justify-between gap-4",
                    "px-4"
                )}
            >
                {/* Left section: Menu (mobile) + Logo */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <Button
                        variant="icon"
                        size="sm"
                        onClick={onMenuClick}
                        className="lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </Button>

                    {/* Logo */}
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center gap-2",
                            "text-[var(--text-xl)] font-bold",
                            "text-[var(--foreground)]",
                            "hover:opacity-80 transition-opacity"
                        )}
                    >
                        {/* Logo icon - simple meme emoji for now */}
                        <span className="text-2xl">😂</span>
                        <span className="hidden sm:inline text-[var(--accent-primary)]">Memewale</span>
                    </Link>
                </div>

                {/* Center: Search bar (desktop) */}
                <div className="hidden md:flex flex-1 justify-center mx-4">
                    <SearchBar
                        onSearch={(q) => {
                            if (typeof window !== 'undefined') {
                                window.location.href = `/search?q=${encodeURIComponent(q)}`;
                            }
                        }}
                        className="max-w-md w-full"
                    />
                </div>

                {/* Right section: Search (mobile) + User */}
                <div className="flex items-center gap-2">
                    {/* Mobile search button */}
                    <Button
                        variant="icon"
                        size="sm"
                        onClick={onSearchClick}
                        className="md:hidden"
                        aria-label="Search"
                    >
                        <Search size={20} />
                    </Button>

                    {/* User menu / Login button */}
                    {isAuthenticated && user ? (
                        <div className="hidden sm:flex items-center gap-3">
                            <span className="text-sm font-medium">{user.name}</span>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="hidden sm:flex"
                            onClick={() => setIsLoginModalOpen(true)}
                        >
                            <User size={18} />
                            <span>Login</span>
                        </Button>
                    )}

                    {/* Mobile: Just icon */}
                    <Button
                        variant="icon"
                        size="sm"
                        className="sm:hidden"
                        onClick={() => !isAuthenticated && setIsLoginModalOpen(true)}
                        aria-label="Account"
                    >
                        {isAuthenticated ? (
                            <img
                                src={user?.avatar || "https://i.pravatar.cc/32"}
                                alt="User"
                                className="w-6 h-6 rounded-full"
                            />
                        ) : (
                            <User size={20} />
                        )}
                    </Button>
                </div>
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </header >
    );
}

export default TopNav;
