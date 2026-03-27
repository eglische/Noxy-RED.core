import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerChatStartingMessage extends ServerChatSessionMessage {
    $type: 'chatStarting';
    chatId: string;
}
