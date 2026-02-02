export interface Notification {
    id: string;
    type: "like" | "comment" | "follow" | "mention" | "system";
    actor: {
        id: string;
        username: string;
        displayName: string;
        avatar: string;
    };
    content?: string; // For comments or mentions
    target?: {
        id: string;
        preview: string; // URL of meme image
    };
    isRead: boolean;
    createdAt: string; // ISO string
}

export const mockNotifications: Notification[] = [
    {
        id: "n1",
        type: "like",
        actor: {
            id: "u2",
            username: "dank_memer",
            displayName: "Dank Memer",
            avatar: "https://i.pravatar.cc/150?u=dank_memer"
        },
        target: {
            id: "m1",
            preview: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&h=500&fit=crop"
        },
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
    },
    {
        id: "n2",
        type: "comment",
        actor: {
            id: "u3",
            username: "cat_lover",
            displayName: "Cat Lover",
            avatar: "https://i.pravatar.cc/150?u=cat_lover"
        },
        content: "LMAO this is exactly me 🤣🤣",
        target: {
            id: "m1",
            preview: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&h=500&fit=crop"
        },
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
    },
    {
        id: "n3",
        type: "follow",
        actor: {
            id: "u4",
            username: "newbie_memer",
            displayName: "Newbie",
            avatar: "https://i.pravatar.cc/150?u=newbie"
        },
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    },
    {
        id: "n4",
        type: "system",
        actor: {
            id: "system",
            username: "memewale",
            displayName: "Memewale Team",
            avatar: "/favicon.ico" // Fallback to system icon
        },
        content: "Welcome to Memewale! 🚀 Start by following some creators.",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
    },
    {
        id: "n5",
        type: "mention",
        actor: {
            id: "u2",
            username: "dank_memer",
            displayName: "Dank Memer",
            avatar: "https://i.pravatar.cc/150?u=dank_memer"
        },
        content: "Check this out @memelord42 it's hilarious!",
        target: {
            id: "m2",
            preview: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=500&h=500&fit=crop"
        },
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() // 1 day 1 hour ago
    }
];
