import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientSpeechPlaybackStartMessage extends ClientChatSessionMessage {
    $type: 'speechPlaybackStart';
    messageId: string;
    startIndex: number;
    endIndex: number;
    duration: number;
    isNarration?: boolean;
}
