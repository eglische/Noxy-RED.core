import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientTriggerActionMessage extends ClientChatSessionMessage {
    $type: 'triggerAction';
    messageId: string;
    value: string;
    arguments?: {
        name: string;
        value: string;
    }[];
}
