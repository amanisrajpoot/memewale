"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { Moon, Sun, User, Bell, Shield, LogOut, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

export default function SettingsPage() {
    const { user, logout } = useAuthStore();
    const { openModal } = useAuthModalStore();
    const supabase = createClient();
    const router = useRouter();
    const { addToast } = useToast();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>
                <p className="text-[var(--foreground-muted)] mb-6">Please log in to manage your settings.</p>
                <button
                    onClick={() => openModal('login')}
                    className="px-6 py-2 bg-[var(--accent-primary)] text-white rounded-full font-medium"
                >
                    Log In
                </button>
            </div>
        );
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        router.push("/login");
    };

    const SettingSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--foreground-muted)] px-1">{title}</h2>
            <div className="bg-[var(--background-elevated)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden shadow-sm">
                {children}
            </div>
        </div>
    );

    const SettingRow = ({ icon: Icon, label, action, destructive = false }: any) => (
        <button
            onClick={action}
            className="flex items-center justify-between w-full p-4 hover:bg-[var(--muted)] transition-all text-left group"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors ${destructive ? 'bg-red-500/10 text-red-500' : 'bg-[var(--background)] text-[var(--foreground-muted)] group-hover:text-[var(--accent-primary)]'}`}>
                    <Icon size={20} />
                </div>
                <span className={`font-medium ${destructive ? 'text-red-500' : 'text-[var(--foreground)]'}`}>
                    {label}
                </span>
            </div>
            <span className="text-[var(--foreground-subtle)] group-hover:text-[var(--foreground-muted)] group-hover:translate-x-1 transition-all">
                <ArrowLeft className="rotate-180 w-4 h-4" />
            </span>
        </button>
    );

    return (
        <div className="feed-container pt-10">
            <div className="max-w-2xl mx-auto">
                <Stack space="xl">
                    <header>
                        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                            Settings
                        </h1>
                        <p className="text-sm text-[var(--foreground-muted)]" style={{ marginBlockStart: "var(--space-3xs)" }}>
                            Manage your preferences and account
                        </p>
                    </header>

                    <Stack space="lg">
                        {/* Account */}
                        <SettingSection title="Account">
                            <SettingRow
                                icon={User}
                                label="Edit Profile"
                                action={() => addToast("Profile editing coming soon!", "info")}
                            />
                            <SettingRow
                                icon={Shield}
                                label="Privacy & Security"
                                action={() => addToast("Privacy settings coming soon!", "info")}
                            />
                        </SettingSection>

                        {/* Preferences */}
                        <SettingSection title="Preferences">
                            <SettingRow
                                icon={Moon}
                                label="Appearance (Dark Mode)"
                                action={() => addToast("Theme toggle coming soon!", "info")}
                            />
                            <SettingRow
                                icon={Bell}
                                label="Notifications"
                                action={() => router.push('/notifications')}
                            />
                        </SettingSection>

                        {/* Danger Zone */}
                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-red-500/10">
                                <h2 className="font-bold text-red-500 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Danger Zone
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-red-500/70 mb-4 px-2">
                                    Actions here can affect your account session. Please be careful.
                                </p>
                                <SettingRow
                                    icon={LogOut}
                                    label="Log Out"
                                    action={handleLogout}
                                    destructive
                                />
                            </div>
                        </div>
                    </Stack>
                </Stack>
            </div>
        </div>
    );
}