export interface Message {
    id: number;
    text: string;
    sender: "me" | "them";
    timestamp: string;
}

export interface Chat {
    id: number;
    name: string;
    initials: string;
    lastMessage: string;
    time: string;
    unread?: number;
    online?: boolean;
    isAi?: boolean;
    messages: Message[];
}

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
    {
        id: 1,
        name: "Maneesh Shrestha",
        initials: "MS",
        lastMessage: "I've reviewed the latest design patterns.",
        time: "2m ago",
        unread: 2,
        online: true,
        messages: [
            { id: 1, text: "Hey, did you see the new UI updates?", sender: "them", timestamp: "9:45 AM" },
            { id: 2, text: "I've reviewed the latest design patterns.", sender: "them", timestamp: "9:46 AM" },
        ],
    },
    {
        id: 2,
        name: "Rahul Gupta",
        initials: "RG",
        lastMessage: "Let's sync up tomorrow about the API integration.",
        time: "1h ago",
        messages: [
            { id: 1, text: "The database schema looks good.", sender: "them", timestamp: "Yesterday" },
            { id: 2, text: "Let's sync up tomorrow about the API integration.", sender: "them", timestamp: "Yesterday" },
        ],
    },
    {
        id: 3,
        name: "Sagar Poudel",
        initials: "SP",
        lastMessage: "I've pushed the fix for the navigation bug.",
        time: "3h ago",
        messages: [
            { id: 1, text: "I've pushed the fix for the navigation bug.", sender: "them", timestamp: "2:00 PM" },
        ],
    },
];
