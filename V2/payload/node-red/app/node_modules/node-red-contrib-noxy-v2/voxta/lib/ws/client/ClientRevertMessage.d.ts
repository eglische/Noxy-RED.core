import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientRevertMessage extends ClientChatSessionMessage {
    $type: 'revert';
    messageId: string;
}
