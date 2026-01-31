"use client";

import { useState } from "react";
import { X, Mail, Phone, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/useAuthStore";

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
            <div className="p-6">
                <p className="text-sm text-[var(--foreground-muted)] mb-6">
                    Login to share memes, vote, and build your collection.
                </p>

                {/* Tab Switcher */}
                <div className="flex bg-[var(--muted)] p-1 rounded-lg mb-6">
                    <button
                        onClick={() => setMethod("email")}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                            method === "email"
                                ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                        )}
                    >
                        Email
                    </button>
                    <button
                        onClick={() => setMethod("phone")}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                            method === "phone"
                                ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                        )}
                    >
                        Phone
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    {method === "email" ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-[var(--background-elevated)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full pl-10 pr-4 py-3 bg-[var(--background-elevated)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="w-full pl-10 pr-4 py-3 bg-[var(--background-elevated)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-all"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Continue
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-[var(--foreground-muted)]">
                        By continuing, you agree to our Terms of Service & Privacy Policy.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
