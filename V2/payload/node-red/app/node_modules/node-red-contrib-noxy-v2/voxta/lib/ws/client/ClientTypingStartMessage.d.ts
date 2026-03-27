import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientTypingStartMessage extends ClientChatSessionMessage {
    $type: 'typingStart';
}
