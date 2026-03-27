import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientInspectMessage extends ClientChatSessionMessage {
    $type: 'inspect';
    enabled: boolean;
}
