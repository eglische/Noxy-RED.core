import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientSpeechPlaybackCompleteMessage extends ClientChatSessionMessage {
    $type: 'speechPlaybackComplete';
    messageId: string;
}
