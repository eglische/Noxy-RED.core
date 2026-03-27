import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientSpeakMessage extends ClientChatSessionMessage {
    $type: 'speak';
    messageId: string;
}
