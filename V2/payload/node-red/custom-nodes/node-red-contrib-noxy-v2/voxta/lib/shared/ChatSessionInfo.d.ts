import { ChatParticipantInfo } from './ChatParticipantInfo';
export interface ChatSessionInfo {
    sessionId: string;
    chatId: string;
    user: ChatParticipantInfo;
    characters: ChatParticipantInfo[];
}
