import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientRetryMessage extends ClientChatSessionMessage {
    $type: 'retry';
}
