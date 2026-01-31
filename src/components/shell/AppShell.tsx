"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TopNav } from "./TopNav";
import { BottomBar } from "./BottomBar";
import { SideRail } from "./SideRail";

// =============================================================================
// APP SHELL
// The persistent layout wrapper that contains all navigation elements.
// Responsive design that adapts to mobile, tablet, and desktop.
// =============================================================================

export interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearchClick = () => {
        setIsSearchOpen(true);
        // TODO: Implement search modal
        console.log("Search clicked");
    };

    const handleMenuClick = () => {
        setIsMobileMenuOpen(true);
        // TODO: Implement mobile menu drawer
        console.log("Menu clicked");
    };

    return (
        <div className="app-container">
            {/* Top Navigation - Always visible */}
            <TopNav onSearchClick={handleSearchClick} onMenuClick={handleMenuClick} />

            {/* Side Rail - Desktop only */}
            <SideRail />

            {/* Main Content Area */}
            <main
                className={cn(
                    // Offset for fixed headers
                    "main-content",
                    // Minimum height to fill viewport
                    "min-h-screen"
                )}
            >
                {children}
            </main>

            {/* Bottom Bar - Mobile only */}
            <BottomBar />

            {/* TODO: Search Modal */}
            {/* TODO: Mobile Menu Drawer */}
        </div>
    );
}

export default AppShell;
