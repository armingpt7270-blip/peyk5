
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { generateChatResponse } from '../../services/geminiService';
import GlassCard from '../common/GlassCard';
import { Icons } from '../../constants';

const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'ai', text: 'سلام! چطور می‌تونم امروز کمکتون کنم؟', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await generateChatResponse(input);
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: aiResponseText,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error getting AI response:", error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: "متاسفانه مشکلی در اتصال پیش آمده. لطفا دوباره تلاش کنید.",
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlassCard className="h-[500px] flex flex-col" noPadding>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-2xl">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 ml-2 animate-pulse"></span>
                    دستیار هوشمند
                </h3>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-bl-none shadow-md' 
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-br-none shadow-sm border border-gray-100 dark:border-gray-600'
                        }`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-sm rounded-br-none">
                           <div className="flex items-center space-x-1 space-x-reverse">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 rounded-b-2xl">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="پیام خود را بنویسید..."
                        className="flex-grow px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <Icons.Send className="h-5 w-5 rotate-180" />
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};

export default ChatWindow;
