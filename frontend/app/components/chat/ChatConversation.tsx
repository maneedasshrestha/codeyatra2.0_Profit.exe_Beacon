"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Smile, Paperclip, ChevronLeft } from "lucide-react";
import Avatar from "@/app/components/Avatar";
import { Chat, Message } from "../../dashboard/chat/mockData";

interface ChatConversationProps {
    chat: Chat | null;
    messages: Message[];
    onUpdateMessages: (messages: Message[]) => void;
    /** For non-AI chats: called with the message text so the parent can emit via socket. */
    onSendMessage?: (text: string) => void;
    /** Called with true when user starts typing, false when they stop. */
    onTyping?: (isTyping: boolean) => void;
    /** True when the other user in this chat is typing. */
    isTyping?: boolean;
    onBack: () => void;
}

const ChatConversation: React.FC<ChatConversationProps> = ({
    chat,
    messages,
    onUpdateMessages,
    onSendMessage,
    onTyping,
    isTyping = false,
    onBack,
}) => {
    const [messageText, setMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom whenever messages or loading / typing state changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isTyping]);

    const handleTextChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setMessageText(e.target.value);
            if (!chat?.isAi && onTyping) {
                onTyping(true);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
            }
        },
        [chat, onTyping]
    );

    const handleSendMessage = async () => {
        if (!messageText.trim() || isLoading) return;

        const userMsgText = messageText;
        setMessageText("");

        // Stop typing indicator immediately on send
        if (!chat?.isAi && onTyping) {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            onTyping(false);
        }

        if (chat?.isAi) {
            // For AI chat: optimistically add the message locally
            const newMessage: Message = {
                id: Date.now(),
                text: userMsgText,
                sender: "me",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            onUpdateMessages([...messages, newMessage]);
            setIsLoading(true);
            try {
                // Assuming backend runs on port 5000 based on backend/src/index.js
                const response = await fetch("http://localhost:5000/api/ai/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: userMsgText,
                    }),
                });

                const data = await response.json();

                if (data.response) {
                    const aiMessage: Message = {
                        id: Date.now() + 1,
                        text: data.response,
                        sender: "them",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    onUpdateMessages([...messages, newMessage, aiMessage]);
                }
            } catch (error) {
                console.error("AI Chat Error:", error);
                const errorMessage: Message = {
                    id: Date.now() + 1,
                    text: "Sorry, I'm having trouble connecting right now. As a senior, I should tell you: sometimes the system just goes down. Try again later!",
                    sender: "them",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                onUpdateMessages([...messages, newMessage, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        } else {
            // For real chats: delegate send to the parent (which emits via socket)
            onSendMessage?.(userMsgText);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!chat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F7FA] p-10 text-center">
                <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-6 text-violet-200">
                    <Send size={32} />
                </div>
                <h2 className="text-[20px] font-black text-gray-900 mb-2 tracking-tight">Select a conversation</h2>
                <p className="text-[14px] font-medium text-gray-500 max-w-[280px]">
                    Choose a chat from the sidebar to start messaging your teammates.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F7FA] overflow-hidden relative">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-6 py-4 flex items-center gap-3 sticky top-0 z-10 min-h-[72px]">
                {/* Mobile Back Button */}
                <button
                    onClick={onBack}
                    className="md:hidden p-2 -ml-2 hover:bg-gray-50 rounded-xl text-gray-400 active:scale-90 transition-all font-bold flex items-center"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                        <Avatar initials={chat.initials} size="md" />
                        {chat.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[16px] font-black text-gray-900 leading-tight truncate">
                            {chat.name}
                            {chat.isAi && <span className="ml-2 text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full uppercase tracking-wider">AI</span>}
                        </h3>
                        {isTyping ? (
                            <p className="text-[12px] font-semibold text-violet-500 flex items-center gap-1">
                                typing
                                <span className="flex gap-0.5 items-center">
                                    <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" />
                                </span>
                            </p>
                        ) : (
                            <p className="text-[12px] font-semibold text-gray-400">
                                {chat.online ? "Online now" : "Offline"}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar pb-32">
                {messages.map((msg) => {
                    const isOrder = msg.text.startsWith("__ORDER__:");
                    const orderData: { orderNumber: string; productName: string; productImage?: string | null; price: number } | null = isOrder
                        ? (() => { try { return JSON.parse(msg.text.slice("__ORDER__:".length)); } catch { return null; } })()
                        : null;

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                            {isOrder && orderData ? (
                                /* ── Order confirmation card ── */
                                <div className="max-w-[85%] md:max-w-[70%] bg-white rounded-[1.5rem] shadow-sm border border-black/5 overflow-hidden">
                                    <div className="px-4 pt-3 pb-2">
                                        <p className="text-[11px] font-bold text-gray-700 tracking-tight">
                                            Order Number #{orderData.orderNumber}
                                        </p>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        {orderData.productImage ? (
                                            <img
                                                src={orderData.productImage}
                                                alt={orderData.productName}
                                                className="w-12 h-12 object-cover rounded-xl shrink-0 border border-gray-100"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl shrink-0 bg-violet-50 flex items-center justify-center">
                                                <span className="text-[18px]">🛍️</span>
                                            </div>
                                        )}
                                        <p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug">
                                            {orderData.productName}
                                        </p>
                                    </div>
                                    <div className="pb-1" />
                                </div>
                            ) : (
                                /* ── Normal message bubble ── */
                                <div
                                    className={`max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-[1.5rem] text-[14px] font-medium leading-relaxed shadow-sm ${msg.sender === "me"
                                        ? "bg-violet-600 text-white rounded-tr-none"
                                        : "bg-white text-gray-800 rounded-tl-none border border-black/5"
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                    <span
                                        className={`text-[10px] block mt-1.5 font-bold ${msg.sender === "me" ? "text-white/60 text-right" : "text-gray-400"
                                            }`}
                                    >
                                        {msg.timestamp}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
                {(isLoading || isTyping) && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 px-5 py-3.5 rounded-[1.5rem] rounded-tl-none border border-black/5 shadow-sm text-[14px] flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
                <div className="h-20" /> {/* Extra space at bottom for scrolling */}
            </div>

            {/* Input - Positioned above BottomNavBar */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-28 md:pb-32 bg-linear-to-t from-[#F8F7FA] via-[#F8F7FA]/90 to-transparent pointer-events-none">
                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-2 pr-2 flex items-center gap-2 pointer-events-auto">
                    <button className="p-3 text-gray-400 hover:text-violet-500 transition-colors hidden sm:block">
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="text"
                        placeholder="Write a message..."
                        value={messageText}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium px-4 py-3 placeholder:text-gray-300"
                    />
                    <button className="p-3 text-gray-400 hover:text-violet-500 transition-colors">
                        <Smile size={20} />
                    </button>
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || isLoading}
                        className={`p-3 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center w-11 h-11 ${messageText.trim() && !isLoading
                            ? "bg-violet-600 text-white shadow-violet-200"
                            : "bg-gray-100 text-gray-300"
                            }`}
                    >
                        <Send size={18} fill={messageText.trim() && !isLoading ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatConversation;
