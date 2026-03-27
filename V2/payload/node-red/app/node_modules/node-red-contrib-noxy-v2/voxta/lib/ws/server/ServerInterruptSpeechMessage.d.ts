import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerInterruptSpeechMessage extends ServerChatSessionMessage {
    $type: 'interruptSpeech';
    messageId: string;
}
