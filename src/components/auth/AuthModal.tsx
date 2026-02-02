"use client";

import { useAuthModalStore } from "@/store/useAuthModalStore";
import { Modal } from "@/components/ui/Modal";
import { SocialAuth } from "./SocialAuth";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";

export function AuthModal() {
    const { isOpen, closeModal, view, setView } = useAuthModalStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (view === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username,
                            full_name: username, // Default full name to username
                        }
                    }
                });
                if (error) throw error;
                addToast("Check your email to verify your account!", "success");
                closeModal();
            } else if (view === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                addToast("Logged in successfully!", "success");
                closeModal();
                router.refresh();
            }
        } catch (error: any) {
            addToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const title = view === 'login' ? 'Log In' : view === 'signup' ? 'Sign Up' : 'Reset Password';
    const description = view === 'login'
        ? 'Login to vote, comment, and save memes.'
        : view === 'signup'
            ? 'Join the community to share your memes.'
            : 'Enter your email to reset your password.';

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={title}
            description={description}
            size="md"
        >
            <div className="flex flex-col gap-6">
                {/* Social Auth (Top) */}
                {view !== 'forgot-password' && (
                    <>
                        <SocialAuth />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[var(--border)]" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[var(--background-elevated)] px-2 text-[var(--foreground-muted)]">
                                    OR
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {/* Email Form */}
                <form onSubmit={handleAuth} className="flex flex-col gap-4">

                    {view === 'signup' && (
                        <div className="space-y-1">
                            <Input
                                label="Username"
                                type="text"
                                placeholder="cool_memer_69"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                required
                                autoFocus
                                minLength={3}
                                maxLength={20}
                                className="font-medium"
                            />
                            <p className="text-[11px] text-[var(--foreground-muted)] ml-1">
                                Lowercase, numbers, and underscores only.
                            </p>
                        </div>
                    )}

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus={view !== 'signup'}
                    />

                    {view !== 'forgot-password' && (
                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            {view === 'signup' && (
                                <p className="text-[11px] text-[var(--foreground-muted)] ml-1">
                                    Must be at least 6 characters.
                                </p>
                            )}
                        </div>
                    )}

                    <Button type="submit" isLoading={loading} className="mt-2" variant="primary">
                        {view === 'login' ? 'Log In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'}
                    </Button>
                </form>

                {/* Footer Links */}
                <div className="text-center text-sm text-[var(--foreground-muted)]">
                    {view === 'login' && (
                        <p>
                            New to Memewale?{' '}
                            <button
                                onClick={() => setView('signup')}
                                className="text-[var(--accent-primary)] hover:underline font-semibold"
                            >
                                Sign Up
                            </button>
                        </p>
                    )}
                    {view === 'signup' && (
                        <p>
                            Already member?{' '}
                            <button
                                onClick={() => setView('login')}
                                className="text-[var(--accent-primary)] hover:underline font-semibold"
                            >
                                Log In
                            </button>
                        </p>
                    )}
                    {view === 'login' && (
                        <button
                            onClick={() => setView('forgot-password')}
                            className="text-xs hover:text-[var(--foreground)] mt-2"
                        >
                            Forgot password?
                        </button>
                    )}
                    {view === 'forgot-password' && (
                        <button
                            onClick={() => setView('login')}
                            className="text-[var(--accent-primary)] hover:underline font-semibold"
                        >
                            Back to Login
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
