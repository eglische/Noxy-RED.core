import { ChatMessageRole } from './ChatMessageRole';
export type ChatMessage = {
    messageId: string;
    senderId: string;
    role: ChatMessageRole;
    name?: string;
    text: string;
    timestamp: string;
    tokens?: number;
    index: number;
    conversationIndex: number;
    chatTime: number;
    summarizedBy?: string;
};
