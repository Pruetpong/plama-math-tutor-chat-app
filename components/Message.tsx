import React, { useEffect, useRef } from 'react';
import { Message, MessageRole } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface MessageProps {
  message: Message;
}

declare global {
    interface Window {
        renderMathInElement: (element: HTMLElement, options?: any) => void;
    }
}


export const ChatMessage: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && window.renderMathInElement) {
        window.renderMathInElement(contentRef.current, {
             delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
              {left: '\\(', right: '\\)', display: false},
              {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
  }, [message.content]);


  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <BotIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>
      )}
      <div
        className={`max-w-md lg:max-w-2xl rounded-2xl px-5 py-3 shadow-md ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <div ref={contentRef} className="whitespace-pre-wrap">{message.content}</div>
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </div>
      )}
    </div>
  );
};