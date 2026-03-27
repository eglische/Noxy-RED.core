import { ChatInspectResponse, ChatResponse, ChatSummaryResponse } from '../responses';
import { VoxtaApiClientBase } from './VoxtaApiClientBase';
export declare class ChatsApiClient extends VoxtaApiClientBase {
    getChats(characterId?: string): Promise<ChatResponse[]>;
    getChatInspect(chatId?: string): Promise<ChatInspectResponse>;
    getChatSummary(chatId?: string): Promise<ChatSummaryResponse>;
    createChat(params: {
        characters: string[];
        roles?: Record<string, string>;
        scenario?: string;
        client: string;
        ephemeral?: boolean;
    }): Promise<ChatResponse>;
    deleteChat(chatId: string): Promise<void>;
    deleteMessage(chatId: string, messageId: string): Promise<void>;
    cloneChat(chatId: string): Promise<ChatResponse>;
    patchChat(chatId: string, params: Partial<ChatResponse>): Promise<void>;
}
