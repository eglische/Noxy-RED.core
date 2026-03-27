import { ChatMessageRole } from '../../shared';
import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerUpdatedMessage extends ServerChatSessionMessage {
    $type: 'update';
    messageId: string;
    senderId: string;
    text?: string;
    summarizedBy?: string;
    tokens?: number;
    role: ChatMessageRole;
    timestamp: string;
    index: number;
    chatTime: number;
}
