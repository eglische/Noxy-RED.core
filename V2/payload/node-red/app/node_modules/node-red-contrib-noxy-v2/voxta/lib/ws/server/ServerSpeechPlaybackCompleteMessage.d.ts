import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerSpeechPlaybackCompleteMessage extends ServerChatSessionMessage {
    $type: 'speechPlaybackComplete';
    messageId: string;
}
