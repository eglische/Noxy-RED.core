import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerActionAppTriggerMessage extends ServerChatSessionMessage {
    $type: 'appTrigger';
    messageId?: string;
    name: string;
    senderId: string;
    arguments: (string | number)[];
}
