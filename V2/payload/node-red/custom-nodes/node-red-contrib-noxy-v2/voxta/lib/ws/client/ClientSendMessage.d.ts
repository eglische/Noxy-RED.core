import { ComputerVisionSource } from '../../shared';
import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientSendMessage extends ClientChatSessionMessage {
    $type: 'send';
    text?: string;
    attachments?: Base64UrlImageAttachment[];
    characterResponsePrefix?: string;
    retry?: boolean;
    doUserActionInference?: boolean;
    doReply?: boolean;
    doCharacterActionInference?: boolean;
}
export interface Attachment {
    $type: string;
    source: ComputerVisionSource;
}
export interface Base64UrlImageAttachment extends Attachment {
    $type: 'base64UrlImage';
    base64Url: string;
}
