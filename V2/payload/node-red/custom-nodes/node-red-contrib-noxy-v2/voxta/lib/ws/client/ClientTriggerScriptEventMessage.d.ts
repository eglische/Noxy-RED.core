import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientTriggerScriptEventMessage extends ClientChatSessionMessage {
    $type: 'triggerScriptEvent';
    name: string;
    arguments?: {
        name: string;
        value: string;
    }[];
}
