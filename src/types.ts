export type EventType = {
    _id: string;
    title: string;
    category: string;
    location: string;
    date: string;
    joined: number;
    image: string;
    description: string,
    thumbnailUrl: string;
    tagClass?: string;
};


// for profile:

export type ProfileUser = {
    name: string
    email: string
    avatarUrl: string | null
    joinedAt: string
    verified: boolean
    username: string
    interests: string[]
}

export type ProfileStat = { label: string; value: string }

export type ProfileBadge = { name: string; tone: string; icon: React.ComponentType<{ className?: string }> }

export type ProfileEventItem = {
    id: string
    title: string
    category: string
    date: string
    location: string
    image: string
    completed: boolean
}

export type ProfileEvents = { joined: ProfileEventItem[]; created: ProfileEventItem[] }

export type ProfileFormValues = {
    name: string
    username: string
    avatarUrl: string
}
