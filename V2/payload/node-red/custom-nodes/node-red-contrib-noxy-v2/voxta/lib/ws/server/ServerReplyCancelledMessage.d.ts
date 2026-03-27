import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerReplyCancelledMessage extends ServerChatSessionMessage {
    $type: 'replyCancelled';
    messageId: string;
}
