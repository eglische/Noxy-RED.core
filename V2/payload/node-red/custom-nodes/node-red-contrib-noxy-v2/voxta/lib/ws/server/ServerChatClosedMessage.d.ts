import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerChatClosedMessage extends ServerChatSessionMessage {
    $type: 'chatClosed';
    chatId: string;
}
