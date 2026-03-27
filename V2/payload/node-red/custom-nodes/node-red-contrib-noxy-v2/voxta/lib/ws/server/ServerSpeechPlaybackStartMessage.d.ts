import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerSpeechPlaybackStartMessage extends ServerChatSessionMessage {
    $type: 'speechPlaybackStart';
    messageId: string;
    startIndex: number;
    duration: number;
}
