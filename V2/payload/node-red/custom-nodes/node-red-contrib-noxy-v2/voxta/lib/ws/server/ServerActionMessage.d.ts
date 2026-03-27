import { ChatMessageRole } from '../../shared';
import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerActionMessage extends ServerChatSessionMessage {
    $type: 'action';
    contextKey?: string;
    layer?: string;
    value: string;
    role: ChatMessageRole;
    arguments?: {
        name: string;
        value: string;
    }[];
}
