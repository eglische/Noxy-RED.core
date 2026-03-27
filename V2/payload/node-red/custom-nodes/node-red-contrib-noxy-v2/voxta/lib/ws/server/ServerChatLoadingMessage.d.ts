import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerChatLoadingMessage extends ServerChatSessionMessage {
    $type: 'replyEnd';
    text: string;
    progress: number;
}
