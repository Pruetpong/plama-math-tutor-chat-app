import { GoogleGenAI, Chat } from "@google/genai";
import { Message, MessageRole } from '../types';
import { PLAMA_TUTOR_PROMPT, PLAMA_EXAM_PROMPT } from '../prompts';

interface PlamaConfig {
    mode: 'tutor' | 'exam';
    grade: string;
    topic: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Maps our internal MessageRole enum to the role expected by the Gemini API
const roleMap = {
    [MessageRole.USER]: 'user',
    [MessageRole.ASSISTANT]: 'model',
};

export const createChatSession = (history: Message[], config: PlamaConfig): Chat => {
    let systemPrompt = config.mode === 'tutor' ? PLAMA_TUTOR_PROMPT : PLAMA_EXAM_PROMPT;
    systemPrompt = systemPrompt
        .replace('{grade_input}', config.grade)
        .replace('{topic_input}', config.topic);
    
    // Convert message history to the format expected by the Gemini API
    const chatHistory = history.map(msg => ({
        role: roleMap[msg.role as MessageRole.USER | MessageRole.ASSISTANT],
        parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: chatHistory,
        config: {
            systemInstruction: systemPrompt,
        },
    });

    return chat;
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error('Error getting response from Gemini:', error);
        return `ขออภัยครับน้อง เกิดข้อผิดพลาดในการสื่อสารกับ AI ครับ: ${error instanceof Error ? error.message : 'Unknown error'}. กรุณาลองใหม่อีกครั้งนะครับ`;
    }
};
