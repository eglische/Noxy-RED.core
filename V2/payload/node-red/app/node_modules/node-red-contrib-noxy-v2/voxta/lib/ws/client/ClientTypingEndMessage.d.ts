import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientTypingEndMessage extends ClientChatSessionMessage {
    $type: 'typingEnd';
    sent: boolean;
}
