export interface Message {
    id: number;
    text: string;
    sender: "me" | "them";
    timestamp: string;
}

export interface Chat {
    id: number;
    /** Unique user ID of the other participant — used to derive the socket room. */
    userId?: string;
    name: string;
    initials: string;
    avatarUrl?: string;
    lastMessage: string;
    time: string;
    unread?: number;
    online?: boolean;
    isAi?: boolean;
    messages: Message[];
}

/** Represents a platform user that can be searched to start a new chat. */
export interface User {
    id: string;
    name: string;
    initials: string;
    online?: boolean;
    role?: string;
    avatarUrl?: string;
}

/** Seed data — only the AI assistant. Real user chats are created at runtime. */
export const CHATS_DATA: Chat[] = [
    {
        id: 0,
        name: "Beacon AI",
        initials: "AI",
        lastMessage: "How can I help you with your project today?",
        time: "Just now",
        isAi: true,
        online: true,
        messages: [
            { id: 1, text: "Hello! I'm your CodeYatra AI assistant.", sender: "them", timestamp: "10:00 AM" },
            { id: 2, text: "How can I help you with your project today?", sender: "them", timestamp: "10:01 AM" },
        ],
    },
];
