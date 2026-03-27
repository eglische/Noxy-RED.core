import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerChatPausedMessage extends ServerChatSessionMessage {
    $type: 'chatPaused';
    paused: boolean;
}
