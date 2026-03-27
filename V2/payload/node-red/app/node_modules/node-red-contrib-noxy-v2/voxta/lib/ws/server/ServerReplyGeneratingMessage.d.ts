import { ChatMessageRole } from '../../shared';
import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerReplyGeneratingMessage extends ServerChatSessionMessage {
    $type: 'replyGenerating';
    messageId: string;
    senderId: string;
    role: ChatMessageRole;
    thinkingSpeechUrl?: string;
    isNarration?: boolean;
}
