import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerReplyStartMessage extends ServerChatSessionMessage {
    $type: 'replyStart';
    messageId: string;
    senderId: string;
    index: number;
    tokens: number;
    chatTime: number;
}
