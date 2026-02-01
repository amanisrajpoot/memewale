export interface TrendingHashtag {
    id: string;
    tag: string;
    count: number;
    emoji: string;
}

export interface TrendingCreator {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    followers: string;
    isVerified: boolean;
}

export const mockTrendingHashtags: TrendingHashtag[] = [
    { id: 'th1', tag: 'desi', count: 12500, emoji: '🇮🇳' },
    { id: 'th2', tag: 'bollywood', count: 8200, emoji: '🎬' },
    { id: 'th3', tag: 'cricket', count: 6800, emoji: '🏏' },
    { id: 'th4', tag: 'relatable', count: 5100, emoji: '😅' },
    { id: 'th5', tag: 'darkhumor', count: 4300, emoji: '💀' },
];

export const mockTrendingCreators: TrendingCreator[] = [
    {
        id: 'tc1',
        username: 'desi_memer',
        displayName: 'Desi Memer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=desi_memer',
        followers: '125K',
        isVerified: true
    },
    {
        id: 'tc2',
        username: 'bollywood_tadka',
        displayName: 'Bollywood Tadka',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bollywood',
        followers: '89K',
        isVerified: true
    },
    {
        id: 'tc3',
        username: 'dark_humor_india',
        displayName: 'Dark Humor India',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dark',
        followers: '201K',
        isVerified: true
    }
];
