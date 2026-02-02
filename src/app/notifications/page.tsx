"use client";

import { useEffect, useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

// Define the shape of our real notification
interface Notification {
    id: string;
    type: string;
    is_read: boolean;
    created_at: string;
    data: any;
    actor: {
        username: string;
        full_name: string;
        avatar_url: string;
    } | null; // Actor might be deleted
    entity_id: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            // router.push("/login"); // Optional: redirect if not logged in
            return;
        }

        const fetchNotifications = async () => {
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select(`
                        id,
                        type,
                        is_read,
                        created_at,
                        data,
                        entity_id,
                        actor:actor_id (
                            username,
                            full_name,
                            avatar_url
                        )
                    `)
                    .eq('recipient_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Supabase returns 'actor' as an array or object depending on relationship. 
                // Since it's a foreign key, it returns an object if 1:1 or N:1. 
                // We cast it to match our interface.
                setNotifications(data as any[] || []);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();

        // Mark all as read when page loads (optional, or on button click)
        // For now, let's keep it manual or auto-mark on view
    }, [user, supabase]);

    const markAllRead = async () => {
        if (!user) return;

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('recipient_id', user.id)
            .eq('is_read', false);

        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "like": return <Heart size={16} className="text-white fill-white" />;
            case "comment": return <MessageCircle size={16} className="text-white fill-white" />;
            case "follow": return <UserPlus size={16} className="text-white" />;
            case "mention": return <AtSign size={16} className="text-white" />;
            default: return <Info size={16} className="text-white" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case "like": return "bg-red-500";
            case "comment": return "bg-blue-500";
            case "follow": return "bg-purple-500";
            case "mention": return "bg-orange-500";
            default: return "bg-gray-500";
        }
    };

    if (isLoading) {
        return (
            <div className="pt-8 flex items-center justify-center">
                <div className="animate-spin text-[var(--accent-primary)]">⏳</div>
            </div>
        );
    }

    return (
        <div style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Notifications</h1>
                <button
                    onClick={markAllRead}
                    className="text-sm text-[var(--accent-primary)] font-semibold hover:opacity-80 disabled:opacity-50 whitespace-nowrap self-start sm:self-auto"
                    disabled={notifications.every(n => n.is_read)}
                >
                    Mark all as read
                </button>
            </div>

            {notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${notification.is_read
                                ? "bg-[var(--background)] hover:bg-[var(--muted)]"
                                : "bg-[var(--background-elevated)] border border-[var(--accent-primary)]/20 shadow-sm"
                                }`}
                        >
                            {/* Actor Avatar with Type Icon */}
                            <div className="relative shrink-0">
                                <Link href={notification.actor ? `/u/${notification.actor.username}` : '#'}>
                                    <Image
                                        src={notification.actor?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown"}
                                        alt={notification.actor?.full_name || "Unknown User"}
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover aspect-square bg-[var(--muted)]"
                                    />
                                </Link>
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[var(--background)] ${getIconBg(notification.type)}`}>
                                    {getIcon(notification.type)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm">
                                    <Link href={notification.actor ? `/u/${notification.actor.username}` : '#'} className="font-bold text-[var(--foreground)] hover:underline">
                                        {notification.actor?.full_name || "Someone"}
                                    </Link>
                                    {" "}
                                    <span className="text-[var(--foreground-muted)]">
                                        {notification.type === "like" && "liked your meme"}
                                        {notification.type === "comment" && "commented on your meme:"}
                                        {notification.type === "follow" && "started following you"}
                                        {notification.type === "mention" && "mentioned you in a comment:"}
                                    </span>
                                </div>

                                {/* Content Preview from JSONB data */}
                                {notification.data?.content && (
                                    <p className="text-sm text-[var(--foreground)] mt-1 line-clamp-2">
                                        "{notification.data.content}"
                                    </p>
                                )}

                                <p className="text-xs text-[var(--foreground-subtle)] mt-2">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </p>
                            </div>

                            {/* Target Preview (Meme Image) */}
                            {notification.entity_id && notification.data?.preview_url && (
                                <Link href={`/meme/${notification.entity_id}`} className="shrink-0">
                                    <Image
                                        src={notification.data.preview_url}
                                        alt="Meme preview"
                                        width={48}
                                        height={48}
                                        className="rounded-lg object-cover bg-[var(--muted)]"
                                    />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Bell}
                    title="No Notifications"
                    description="You're all caught up! Interact with others to get things moving."
                />
            )}
        </div>
    );
}
