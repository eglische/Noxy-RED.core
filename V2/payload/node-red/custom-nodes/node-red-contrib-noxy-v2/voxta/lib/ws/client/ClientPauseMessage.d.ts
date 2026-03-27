import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientPauseMessage extends ClientChatSessionMessage {
    $type: 'pauseChat';
    pause: boolean;
}
