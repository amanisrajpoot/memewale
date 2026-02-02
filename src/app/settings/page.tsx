"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "@/components/layout";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { Moon, Sun, User, Bell, Shield, LogOut } from "lucide-react";
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
        <div className="bg-[var(--background-elevated)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
                <h2 className="font-semibold">{title}</h2>
            </div>
            <div className="p-6">
                <Stack space="md">
                    {children}
                </Stack>
            </div>
        </div>
    );

    const SettingRow = ({ icon: Icon, label, action, destructive = false }: any) => (
        <button
            onClick={action}
            className="flex items-center justify-between w-full p-2 hover:bg-[var(--muted)] rounded-lg transition-colors text-left"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${destructive ? 'bg-red-500/10 text-red-500' : 'bg-[var(--muted)] text-[var(--foreground)]'}`}>
                    <Icon size={18} />
                </div>
                <span className={destructive ? 'text-red-500 font-medium' : 'text-[var(--foreground)] font-medium'}>
                    {label}
                </span>
            </div>
            <span className="text-[var(--foreground-muted)] text-sm">→</span>
        </button>
    );

    return (
        <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '3rem' }}>
            <Stack space="lg">
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
                    <SettingSection title="Session">
                        <SettingRow
                            icon={LogOut}
                            label="Log Out"
                            action={handleLogout}
                            destructive
                        />
                    </SettingSection>
                </Stack>
            </Stack>
        </div>
    );
}
