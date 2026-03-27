import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerReplyChunkMessage extends ServerChatSessionMessage {
    $type: 'replyChunk';
    text: string;
    messageId: string;
    startIndex: number;
    endIndex: number;
    audioUrl?: string;
    isNarration?: boolean;
    audioGapMs?: number;
}
