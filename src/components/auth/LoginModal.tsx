"use client";

import { useState } from "react";
import { X, Mail, Phone, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "@/components/layout";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const login = useAuthStore((state) => state.login);
    const [method, setMethod] = useState<"email" | "phone">("email");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(); // Mock login
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Welcome back! 👋">
            <div style={{ padding: "var(--space-md)" }}>
                <p
                    className="text-sm text-[var(--foreground-muted)]"
                    style={{ marginBlockEnd: "var(--space-md)" }}
                >
                    Login to share memes, vote, and build your collection.
                </p>

                {/* Tab Switcher */}
                <div
                    className="flex bg-[var(--muted)] rounded-lg"
                    style={{
                        padding: "var(--space-3xs)",
                        marginBlockEnd: "var(--space-md)",
                        borderRadius: "var(--radius-md)"
                    }}
                >
                    <button
                        onClick={() => setMethod("email")}
                        className={cn(
                            "flex-1 text-sm font-medium rounded-md",
                            method === "email"
                                ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                        )}
                        style={{
                            paddingBlock: "var(--space-2xs)",
                            transition: "all var(--transition-fast)",
                            borderRadius: "var(--radius-sm)"
                        }}
                    >
                        Email
                    </button>
                    <button
                        onClick={() => setMethod("phone")}
                        className={cn(
                            "flex-1 text-sm font-medium rounded-md",
                            method === "phone"
                                ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                        )}
                        style={{
                            paddingBlock: "var(--space-2xs)",
                            transition: "all var(--transition-fast)",
                            borderRadius: "var(--radius-sm)"
                        }}
                    >
                        Phone
                    </button>
                </div>

                {/* Form with Stack layout */}
                <form onSubmit={handleLogin}>
                    <Stack space="sm">
                        {method === "email" ? (
                            <>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)] group-focus-within:text-[var(--accent-primary)]"
                                        style={{ transition: "color var(--transition-fast)" }}
                                    />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full outline-none placeholder:text-[var(--foreground-subtle)] text-[var(--foreground)]"
                                        style={{
                                            paddingInlineStart: "3rem",
                                            paddingInlineEnd: "var(--space-sm)",
                                            paddingBlock: "var(--space-xs)",
                                            background: "var(--background-elevated)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "var(--radius-lg)",
                                            transition: "all var(--transition-fast)"
                                        }}
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)] group-focus-within:text-[var(--accent-primary)]"
                                        style={{ transition: "color var(--transition-fast)" }}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full outline-none placeholder:text-[var(--foreground-subtle)] text-[var(--foreground)]"
                                        style={{
                                            paddingInlineStart: "3rem",
                                            paddingInlineEnd: "var(--space-sm)",
                                            paddingBlock: "var(--space-xs)",
                                            background: "var(--background-elevated)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "var(--radius-lg)",
                                            transition: "all var(--transition-fast)"
                                        }}
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="w-full outline-none"
                                    style={{
                                        paddingInlineStart: "2.5rem",
                                        paddingInlineEnd: "var(--space-sm)",
                                        paddingBlock: "var(--space-xs)",
                                        background: "var(--background-elevated)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-lg)",
                                        transition: "all var(--transition-fast)"
                                    }}
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full font-bold hover:opacity-90"
                            style={{
                                paddingBlock: "var(--space-xs)",
                                background: "var(--accent-primary)",
                                color: "hsl(220,25%,10%)",
                                borderRadius: "var(--radius-lg)",
                                transition: "opacity var(--transition-fast)"
                            }}
                        >
                            Continue
                        </button>
                    </Stack>
                </form>

                <div className="text-center" style={{ marginBlockStart: "var(--space-md)" }}>
                    <p className="text-xs text-[var(--foreground-muted)]">
                        By continuing, you agree to our Terms of Service & Privacy Policy.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
