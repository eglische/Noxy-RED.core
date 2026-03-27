import { ChatMessage } from '../../shared';
import { ChatResponse } from './ChatResponse';
export interface ChatSummaryResponse extends ChatResponse {
    chatId: string;
    lastUpdated: string;
    lastMessages: ChatMessage[];
    lastSummary?: ChatMessage;
    scenario?: string;
}
