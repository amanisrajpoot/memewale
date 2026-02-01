"use client";

import { use, useState } from "react";
import { MemeCard } from "@/components/feed/MemeCard";
import { mockMemes } from "@/data/mockMemes";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { MapPin, Link as LinkIcon, Calendar, Share2, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// Mock user data - normally fetched via API
const mockUser = {
    id: "u1",
    username: "memelord42",
    displayName: "Meme Lord 42",
    avatar: "https://i.pravatar.cc/150?u=memelord42",
    bio: "Professional meme connoisseur. I post daily fresh content. DM for collabs! 🚀",
    location: "Mumbai, India",
    website: "instagram.com/memelord",
    joinedAt: "Joined Jan 2024",
    stats: {
        posts: 1420,
        followers: "42.5K",
        following: 69,
        likes: "1.2M",
    },
};

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params); // React 19 unwrap
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");

    // Filter memes for this user (mock)
    const userMemes = mockMemes;

    const tabs = [
        { id: "posts", label: "Posts" },
        { id: "likes", label: "Likes" },
        { id: "saved", label: "Saved" },
    ];

    return (
        <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '5rem' }}>
            {/* Header */}
            <div className="flex flex-col items-start gap-4 mb-8">
                <div className="flex items-start justify-between w-full">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full p-1 bg-[var(--background)] ring-2 ring-[var(--border)] overflow-hidden">
                            <Image
                                src={mockUser.avatar}
                                alt={mockUser.displayName}
                                width={96}
                                height={96}
                                className="rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm" className="rounded-full border border-[var(--border)] w-9 h-9 p-0">
                            <Share2 size={18} />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full border border-[var(--border)] w-9 h-9 p-0">
                            <MoreHorizontal size={18} />
                        </Button>
                        {isFollowing ? (
                            <Button
                                variant="secondary"
                                className="rounded-full px-6 font-semibold"
                                onClick={() => setIsFollowing(false)}
                            >
                                Following
                            </Button>
                        ) : (
                            <Button
                                className="rounded-full px-6 bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] font-bold hover:opacity-90 transition-opacity"
                                onClick={() => setIsFollowing(true)}
                            >
                                Follow
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                        {mockUser.displayName}
                        <span className="text-[var(--accent-primary)] text-lg">✓</span>
                    </h1>
                    <p className="text-[var(--foreground-muted)]">@{mockUser.username}</p>
                </div>

                <p className="text-[var(--foreground)] leading-relaxed">
                    {mockUser.bio}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-[var(--foreground-muted)]">
                    <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{mockUser.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <LinkIcon size={14} />
                        <a href="#" className="text-[var(--accent-secondary)] hover:underline">
                            {mockUser.website}
                        </a>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{mockUser.joinedAt}</span>
                    </div>
                </div>

                <div className="flex gap-6 mt-2 pb-2 border-b border-[var(--border)] w-full">
                    <div className="flex gap-1">
                        <span className="font-bold text-[var(--foreground)]">{mockUser.stats.following}</span>
                        <span className="text-[var(--foreground-muted)]">Following</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="font-bold text-[var(--foreground)]">{mockUser.stats.followers}</span>
                        <span className="text-[var(--foreground-muted)]">Followers</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="font-bold text-[var(--foreground)]">{mockUser.stats.likes}</span>
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
                        {userMemes.map(meme => (
                            <MemeCard key={meme.id} meme={meme} />
                        ))}
                    </div>
                )}

                {activeTab === "likes" && (
                    <div className="py-20 text-center text-[var(--foreground-muted)] animate-fade-in">
                        <p>Liked memes are private 🔒</p>
                    </div>
                )}

                {activeTab === "saved" && (
                    <div className="py-20 text-center text-[var(--foreground-muted)] animate-fade-in">
                        <p>Only you can see your saved memes 🫣</p>
                    </div>
                )}
            </div>
        </div>
    );
}
