import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientInterruptMessage extends ClientChatSessionMessage {
    $type: 'interrupt';
}
