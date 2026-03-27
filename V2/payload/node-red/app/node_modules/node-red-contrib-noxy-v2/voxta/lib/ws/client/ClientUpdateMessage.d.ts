import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientUpdateMessage extends ClientChatSessionMessage {
    $type: 'update';
    messageId: string;
    text: string;
}
