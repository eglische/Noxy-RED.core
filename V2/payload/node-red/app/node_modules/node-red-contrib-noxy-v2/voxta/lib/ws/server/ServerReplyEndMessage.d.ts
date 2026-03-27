import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerReplyEndMessage extends ServerChatSessionMessage {
    $type: 'replyEnd';
    messageId: string;
    tokens: number;
    messageIndex: number;
}
