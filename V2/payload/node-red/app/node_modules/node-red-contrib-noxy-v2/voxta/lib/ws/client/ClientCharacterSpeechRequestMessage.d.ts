import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientCharacterSpeechRequestMessage extends ClientChatSessionMessage {
    $type: 'characterSpeechRequest';
    text: string;
}
