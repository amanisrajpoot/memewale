"use client";

import { use, useState, useEffect, useCallback } from "react";
import { MemeCard } from "@/components/feed/MemeCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapPin, Link as LinkIcon, Calendar, Share2, MoreHorizontal, Camera, Edit2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Types matching DB
interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    bio: string | null;
    website: string | null;
    location: string | null;
    created_at: string;
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const [activeTab, setActiveTab] = useState("posts");
    const { user: currentUser } = useAuthStore();
    const { followUser, unfollowUser, isFollowing: checkIsFollowing } = useUserStore();
    const { addToast } = useToast();
    const supabase = createClient();
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [memes, setMemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMemes, setLoadingMemes] = useState(false);

    // Stats (Mocked for now as we need complex queries/RPC for real counts)
    const stats = {
        posts: memes.length,
        followers: 120,
        following: 45,
        likes: 0
    };

    const isOwnProfile = currentUser?.id === profile?.id;
    const isFollowing = profile ? checkIsFollowing(profile.id) : false;

    // Fetch Profile
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('username', username)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (error: any) {
                // Supabase .single() returns error code PGRST116 if no rows found
                if (error.code !== 'PGRST116') {
                    console.error("Error fetching profile:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchProfile();
    }, [username, supabase, addToast]);

    // Fetch Memes once profile is loaded
    useEffect(() => {
        const fetchMemes = async () => {
            if (!profile?.id) return;

            setLoadingMemes(true);
            try {
                const { data, error } = await supabase
                    .from('memes')
                    .select('*, author:profiles!memes_author_id_fkey(*)')
                    .eq('author_id', profile.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Map DB result to Meme interface
                const mappedMemes = (data || []).map((item: any) => ({
                    id: item.id,
                    shortId: item.short_id,
                    caption: item.caption,
                    mediaUrl: item.media_url,
                    mediaType: item.media_type || "image",
                    creator: {
                        id: item.author.id,
                        username: item.author.username,
                        displayName: item.author.full_name || item.author.username,
                        avatar: item.author.avatar_url || `https://ui-avatars.com/api/?name=${item.author.username}`,
                        isVerified: item.author.is_verified || false,
                    },
                    upvotes: item.upvote_count || 0,
                    downvotes: item.downvote_count || 0,
                    comments: item.comment_count || 0,
                    shares: item.share_count || 0,
                    createdAt: item.created_at,
                    tags: [], // TODO: fetch tags
                    isUpvoted: false,
                    isDownvoted: false,
                    isSaved: false
                }));

                setMemes(mappedMemes);
            } catch (error) {
                console.error("Error fetching user memes:", error);
            } finally {
                setLoadingMemes(false);
            }
        };

        fetchMemes();
    }, [profile?.id, supabase]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        addToast("Profile link copied!", "success");
    };

    const handleFollow = async () => {
        if (!currentUser) {
            addToast("Please login to follow", "error");
            return;
        }
        if (!profile) return;

        if (isFollowing) {
            await unfollowUser(profile.id, currentUser.id);
            addToast(`Unfollowed ${profile.full_name}`, "success");
        } else {
            await followUser(profile.id, currentUser.id);
            addToast(`Following ${profile.full_name}`, "success");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <h2 className="text-2xl font-bold">User not found</h2>
                <Button onClick={() => router.push('/')}>Go Home</Button>
            </div>
        );
    }

    const tabs = [
        { id: "posts", label: "Posts" },
        // { id: "likes", label: "Likes" }, // TODO: Implement likes table fetch
        // { id: "saved", label: "Saved" }, // TODO: Implement saved table fetch
    ];

    return (
        <div className="feed-container pt-10">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="flex flex-col items-start gap-4 mb-8">
                    <div className="flex items-start justify-between w-full">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full p-1 bg-[var(--background)] ring-4 ring-[var(--border)] overflow-hidden">
                                <Image
                                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}`}
                                    alt={profile.full_name}
                                    width={128}
                                    height={128}
                                    className="rounded-full object-cover aspect-square"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <Button onClick={handleShare} variant="ghost" size="sm" className="rounded-full border border-[var(--border)] w-9 h-9 p-0">
                                <Share2 size={18} />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-full border border-[var(--border)] w-9 h-9 p-0">
                                <MoreHorizontal size={18} />
                            </Button>

                            {isOwnProfile ? (
                                <Button
                                    variant="outline"
                                    className="rounded-full px-6 font-semibold min-w-[100px]"
                                    onClick={() => router.push('/settings')}
                                >
                                    <Edit2 size={16} className="mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <Button
                                    variant={isFollowing ? "outline" : "primary"}
                                    className="rounded-full px-6 font-semibold min-w-[100px]"
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                            {profile.full_name}
                            {/* Verification badge can be added here if we add is_verified col to DB */}
                            {/* <span className="text-[var(--accent-primary)] text-lg">✓</span> */}
                        </h1>
                        <p className="text-[var(--foreground-muted)]">@{profile.username}</p>
                    </div>

                    {profile.bio && (
                        <p className="text-[var(--foreground)] leading-relaxed">
                            {profile.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-[var(--foreground-muted)]">
                        {profile.location && (
                            <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile.website && (
                            <div className="flex items-center gap-1">
                                <LinkIcon size={14} />
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-secondary)] hover:underline">
                                    {profile.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <div className="flex gap-6 mt-2 pb-2 border-b border-[var(--border)] w-full">
                        <div className="flex gap-1">
                            <span className="font-bold text-[var(--foreground)]">{stats.following}</span>
                            <span className="text-[var(--foreground-muted)]">Following</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="font-bold text-[var(--foreground)]">{stats.followers}</span>
                            <span className="text-[var(--foreground-muted)]">Followers</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="font-bold text-[var(--foreground)]">{stats.likes}</span>
                            <span className="text-[var(--foreground-muted)]">Likes</span>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="w-full">
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        className="mb-6"
                        fullWidth
                    />

                    {activeTab === "posts" && (
                        <div className="space-y-8 animate-fade-in">
                            {loadingMemes ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]" />
                                </div>
                            ) : memes.length > 0 ? (
                                memes.map(meme => (
                                    <MemeCard key={meme.id} meme={meme} />
                                ))
                            ) : (
                                <div className="text-center py-20 px-6">
                                    <div className="w-20 h-20 bg-[var(--background-elevated)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border)]">
                                        <Camera className="w-10 h-10 text-[var(--foreground-muted)] opacity-50" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
                                    <p className="text-[var(--foreground-muted)] mb-8 max-w-xs mx-auto">
                                        {isOwnProfile ? "You haven't posted any memes yet. Share your first one to start your journey!" : "This user hasn't posted any memes yet."}
                                    </p>
                                    {isOwnProfile && (
                                        <Button
                                            onClick={() => router.push("/submit")}
                                            className="bg-[var(--accent-primary)] text-[var(--background)] font-bold px-8 py-6 rounded-2xl shadow-lg hover:shadow-[var(--accent-primary)]/20 transition-all active:scale-95"
                                        >
                                            Create First Meme
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
