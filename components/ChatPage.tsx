import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createChatSession, sendMessage } from '../services/geminiService';
import { Message, MessageRole } from '../types';
import { ChatMessage } from './Message';
import { SendIcon } from './icons/SendIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ThemeToggleButton } from './ThemeToggleButton';
import { DownloadIcon } from './icons/DownloadIcon';
import { usePlamaConfig } from '../hooks/usePlamaConfig';
import type { Chat } from '@google/genai';

const TypingIndicator: React.FC = () => (
  <div className="flex items-start p-4">
      <div className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none shadow-md">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
  </div>
);

const ModeToggle: React.FC = () => {
    const { mode, setMode } = usePlamaConfig();
    
    const toggleMode = () => {
        setMode(current => current === 'tutor' ? 'exam' : 'tutor');
    };

    return (
        <button
            onClick={toggleMode}
            className="relative inline-flex items-center h-8 rounded-full w-40 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            aria-live="polite"
        >
            <div className={`absolute w-1/2 h-full rounded-full transition-transform duration-300 ease-in-out bg-blue-600 ${mode === 'tutor' ? 'transform translate-x-0' : 'transform translate-x-full'}`}></div>
            <span className={`relative z-10 w-1/2 text-center text-sm font-medium transition-colors duration-300 ${mode === 'tutor' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>โหมดติวเตอร์</span>
            <span className={`relative z-10 w-1/2 text-center text-sm font-medium transition-colors duration-300 ${mode === 'exam' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>โหมดติสอบ</span>
        </button>
    );
};


export const ChatPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { grade, topic, mode } = usePlamaConfig();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);
  
  const userHistoryKey = `plamaChatHistory_${user?.id}_${grade}_${topic}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (user && grade && topic) {
      let initialMessages: Message[];
      try {
        const savedHistory = localStorage.getItem(userHistoryKey);
        if (savedHistory) {
          initialMessages = JSON.parse(savedHistory);
        } else {
           initialMessages = [{ role: MessageRole.ASSISTANT, content: `สวัสดีครับน้อง ${user.name}! วันนี้เราจะมาเรียนเรื่อง '${topic}' สำหรับชั้น ${grade} กันนะครับ มีอะไรให้พี่ช่วยไหมครับ?` }];
        }
      } catch (error) {
        console.error("Failed to load chat history", error);
        initialMessages = [{ role: MessageRole.ASSISTANT, content: `สวัสดีครับน้อง ${user.name}! วันนี้เราจะมาเรียนเรื่อง '${topic}' สำหรับชั้น ${grade} กันนะครับ มีอะไรให้พี่ช่วยไหมครับ?` }];
      }
      
      setMessages(initialMessages);
      // Initialize chat session
      chatRef.current = createChatSession(initialMessages, { grade, topic, mode });

      setIsHistoryLoading(false);
    }
  }, [user, grade, topic, mode]); // Re-initialize chat if mode changes too

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && messages.length > 0 && !isHistoryLoading) {
      try {
        localStorage.setItem(userHistoryKey, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save chat history", error);
      }
    }
  }, [messages, user, isHistoryLoading, userHistoryKey]);

  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading || !chatRef.current) return;

    const userMessage: Message = { role: MessageRole.USER, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    
    const messageToSend = input;
    setInput('');
    setIsLoading(true);

    const aiResponseContent = await sendMessage(chatRef.current, messageToSend);

    const aiMessage: Message = { role: MessageRole.ASSISTANT, content: aiResponseContent };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  }, [input, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExport = () => {
    if (!user || messages.length === 0 || !grade || !topic) return;

    const dataToExport = {
      userId: user.id,
      userName: user.name,
      grade,
      topic,
      exportedAt: new Date().toISOString(),
      messages: messages,
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `plama-chat-${user.username}-${date}.json`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="flex items-center justify-between p-2 sm:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">PLAMA</h1>
        <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />
            <ThemeToggleButton />
            <button
                onClick={handleExport}
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition"
                aria-label="ส่งออกประวัติการแชท"
                title="ส่งออกประวัติการแชท"
            >
                <DownloadIcon className="w-6 h-6" />
            </button>
            <button
                onClick={logout}
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition"
                aria-label="ออกจากระบบ"
                title="ออกจากระบบ"
            >
                <LogoutIcon className="w-6 h-6" />
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {isHistoryLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="พิมพ์คำถามที่นี่..."
            rows={1}
            className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="ส่งข้อความ"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </div>
  );
};
