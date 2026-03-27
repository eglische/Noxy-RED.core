import { ClientDoChatMessage } from './ClientDoChatMessage';
export interface ClientResumeChatMessage extends ClientDoChatMessage {
    $type: 'resumeChat';
    chatId: string;
}
